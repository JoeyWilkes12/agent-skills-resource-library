#!/usr/bin/env python3
"""Fetch the public skills.sh listing and its three primary audit pages."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


PROVIDERS = {
    "Gen Agent Trust Hub": "agent-trust-hub",
    "Socket": "socket",
    "Snyk": "snyk",
}
BLOCK_TAGS = {
    "address", "article", "aside", "blockquote", "br", "dd", "div", "dl",
    "dt", "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5",
    "h6", "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section",
    "table", "tbody", "td", "th", "thead", "tr", "ul",
}
SKIP_TAGS = {"script", "style", "svg", "noscript", "template"}


class VisibleMainText(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.main_depth = 0
        self.skip_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "main":
            self.main_depth += 1
        if self.main_depth and tag in SKIP_TAGS:
            self.skip_depth += 1
        if self.main_depth and not self.skip_depth and tag in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if self.main_depth and tag in SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1
        if self.main_depth and not self.skip_depth and tag in BLOCK_TAGS:
            self.parts.append("\n")
        if tag == "main" and self.main_depth:
            self.main_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.main_depth and not self.skip_depth:
            self.parts.extend((" ", data, " "))

    def text(self) -> str:
        lines: list[str] = []
        for raw in "".join(self.parts).splitlines():
            line = re.sub(r"\s+", " ", raw).strip()
            if line:
                lines.append(line)
        try:
            lines = lines[: lines.index("Browse")]
        except ValueError:
            pass
        return "\n".join(lines)


def slugify(value: str) -> str:
    value = value.strip().lower().replace("_", "-")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def github_owner_repo(remote: str) -> tuple[str, str] | None:
    remote = remote.strip()
    match = re.search(r"github\.com[/:]([^/]+)/([^/#]+?)(?:\.git)?$", remote)
    if not match:
        return None
    return match.group(1), re.sub(r"\.git$", "", match.group(2))


def frontmatter_name(skill_file: Path) -> str | None:
    try:
        text = skill_file.read_text(encoding="utf-8")
    except OSError:
        return None
    match = re.search(r"\A---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return None
    name = re.search(r"(?m)^name:\s*[\"']?([^\n\"']+)", match.group(1))
    return name.group(1).strip() if name else None


def resolve_local(path: Path, explicit_skill: str | None) -> tuple[str, str, str]:
    path = path.resolve()
    directory = path.parent if path.is_file() else path
    skill_file = path if path.name == "SKILL.md" else directory / "SKILL.md"
    if not skill_file.is_file():
        raise ValueError(f"no SKILL.md found at {skill_file}")
    proc = subprocess.run(
        ["git", "-C", str(directory), "config", "--get", "remote.origin.url"],
        check=False,
        capture_output=True,
        text=True,
    )
    identity = github_owner_repo(proc.stdout)
    if not identity:
        raise ValueError("local skill has no parseable GitHub origin remote")
    name = explicit_skill or directory.name or frontmatter_name(skill_file)
    if not name:
        raise ValueError("could not infer a skill slug; pass --skill")
    return identity[0], identity[1], slugify(name)


def resolve_input(value: str, explicit_skill: str | None) -> tuple[str, str, str]:
    local = Path(value).expanduser()
    if local.exists():
        return resolve_local(local, explicit_skill)

    parsed = urlparse(value if "://" in value else f"https://{value}")
    host = parsed.netloc.lower().removeprefix("www.")
    parts = [part for part in parsed.path.split("/") if part]

    if host == "skills.sh":
        if len(parts) < 3:
            raise ValueError("skills.sh URL must identify owner, repository, and skill")
        return parts[0], parts[1], parts[2]

    if host == "github.com":
        if len(parts) < 2:
            raise ValueError("GitHub URL must identify owner and repository")
        skill = explicit_skill
        if not skill and len(parts) > 4 and parts[2] in {"tree", "blob"}:
            tail = parts[-2] if parts[-1].lower() == "skill.md" else parts[-1]
            skill = tail
        if not skill:
            raise ValueError("GitHub repository URLs require --skill unless the URL targets a skill directory")
        return parts[0], re.sub(r"\.git$", "", parts[1]), slugify(skill)

    plain = [part for part in value.strip("/").split("/") if part]
    if len(plain) == 3:
        return plain[0], plain[1], plain[2]
    raise ValueError("unresolved input; provide a skills.sh URL, owner/repo/skill, or GitHub URL plus --skill")


def fetch(url: str, timeout: float) -> dict[str, object]:
    request = Request(
        url,
        headers={"User-Agent": "Codex-skills-sh-security-check/1.0 (+https://skills.sh/docs/api)"},
    )
    try:
        with urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8", errors="replace")
            parser = VisibleMainText()
            parser.feed(raw)
            return {"http_status": response.status, "url": response.url, "text": parser.text()}
    except HTTPError as exc:
        return {"http_status": exc.code, "url": url, "error": str(exc)}
    except (URLError, TimeoutError, OSError) as exc:
        return {"http_status": None, "url": url, "error": str(exc)}


def first_match(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else None


def summarize(provider: str, slug: str, result: dict[str, object]) -> dict[str, object]:
    text = str(result.get("text", ""))
    status = first_match(r"^(PASS|WARN|FAIL|PENDING)$", text)
    audited_on = first_match(rf"Audited by\s+{re.escape(provider)}\s+on\s+([^\n]+)", text)
    risk_line = first_match(r"Risk Level:\s*([^\n]+)", text)
    risk_parts = risk_line.split() if risk_line else []
    count = first_match(r"^(\d+)\s+(?:alert\s*s?|issue\s*s?)\s+found:?$", text)
    return {
        "provider": provider,
        "provider_slug": slug,
        "status": status.lower() if status else None,
        "risk_level": risk_parts[0] if risk_parts else None,
        "categories": risk_parts[1:],
        "audited_on": audited_on,
        "finding_count": int(count) if count else None,
        **result,
    }


def run(urls: Iterable[tuple[str, str]], timeout: float) -> dict[str, dict[str, object]]:
    items = list(urls)
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(items)) as pool:
        futures = {pool.submit(fetch, url, timeout): key for key, url in items}
        return {futures[future]: future.result() for future in concurrent.futures.as_completed(futures)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", help="skills.sh URL, owner/repo/skill, GitHub URL, or local skill path")
    parser.add_argument("--skill", help="skill slug when it cannot be inferred safely")
    parser.add_argument("--timeout", type=float, default=20.0, help="per-request timeout in seconds")
    args = parser.parse_args()

    try:
        owner, repo, skill = resolve_input(args.input, args.skill)
    except ValueError as exc:
        print(json.dumps({"error": str(exc), "input": args.input}, indent=2))
        return 2

    base = f"https://skills.sh/{owner}/{repo}/{skill}"
    targets = [("listing", base)] + [
        (slug, f"{base}/security/{slug}") for slug in PROVIDERS.values()
    ]
    fetched = run(targets, args.timeout)
    audits = [summarize(provider, slug, fetched[slug]) for provider, slug in PROVIDERS.items()]
    payload = {
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "id": f"{owner}/{repo}/{skill}",
        "canonical_url": base,
        "listing": fetched["listing"],
        "audits": audits,
    }
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    if fetched["listing"].get("http_status") == 404:
        return 3
    if any(audit.get("http_status") != 200 for audit in audits):
        return 4
    return 0


if __name__ == "__main__":
    sys.exit(main())
