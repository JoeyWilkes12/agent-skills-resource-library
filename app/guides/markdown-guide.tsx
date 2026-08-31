import type { ReactNode } from "react";

type GuideBlock =
  | { type: "blockquote"; text: string }
  | { type: "code"; language?: string; text: string }
  | { type: "heading"; id: string; level: 3; text: string }
  | { type: "image"; alt: string; source: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[]; start: number }
  | { type: "paragraph"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

type GuideSection = {
  heading: string;
  id: string;
  blocks: GuideBlock[];
};

export type MarkdownGuide = {
  deck?: string;
  intro: GuideBlock[];
  sections: GuideSection[];
  title: string;
};

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" className="guide-resource-link-icon" viewBox="0 0 16 16">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function tableCells(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

function isBlockStart(line: string, nextLine?: string) {
  return (
    /^#{1,3}\s+/.test(line) ||
    /^```/.test(line) ||
    /^!\[[^\]]*\]\([^)]+\)$/.test(line) ||
    /^-\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^>\s?/.test(line) ||
    (line.includes("|") && Boolean(nextLine && isTableDivider(nextLine)))
  );
}

function parseFrontmatter(source: string) {
  if (!source.startsWith("---\n")) return source;

  const end = source.indexOf("\n---\n", 4);
  return end === -1 ? source : source.slice(end + 5);
}

function asDeck(text: string) {
  const match = text.match(/^\*([\s\S]+)\*$/);
  return match?.[1];
}

export function parseMarkdownGuide(source: string): MarkdownGuide {
  const lines = parseFrontmatter(source).replace(/\r\n/g, "\n").split("\n");
  const intro: GuideBlock[] = [];
  const sections: GuideSection[] = [];
  let title = "Untitled guide";
  let deck: string | undefined;
  let activeBlocks = intro;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    const titleMatch = line.match(/^#\s+(.+)$/);
    if (titleMatch) {
      title = titleMatch[1];
      continue;
    }

    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1];
      const section = { heading, id: slugify(heading), blocks: [] };
      sections.push(section);
      activeBlocks = section.blocks;
      continue;
    }

    const subheadingMatch = line.match(/^###\s+(.+)$/);
    if (subheadingMatch) {
      const text = subheadingMatch[1];
      activeBlocks.push({ type: "heading", id: slugify(text), level: 3, text });
      continue;
    }

    const codeFenceMatch = line.match(/^```([\w-]*)$/);
    if (codeFenceMatch) {
      const codeLines: string[] = [];
      while (index + 1 < lines.length) {
        if (lines[index + 1].trim() === "```") {
          index += 1;
          break;
        }
        index += 1;
        codeLines.push(lines[index]);
      }
      activeBlocks.push({
        type: "code",
        language: codeFenceMatch[1] || undefined,
        text: codeLines.join("\n"),
      });
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      activeBlocks.push({
        type: "image",
        alt: imageMatch[1],
        source: imageMatch[2],
      });
      continue;
    }

    if (line.startsWith("- ")) {
      const items = [line.slice(2)];
      while (lines[index + 1]?.trim().startsWith("- ")) {
        index += 1;
        items.push(lines[index].trim().slice(2));
      }
      activeBlocks.push({ type: "list", items });
      continue;
    }

    const orderedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedListMatch) {
      const items = [orderedListMatch[2]];
      const start = Number(orderedListMatch[1]);
      while (/^\d+\.\s+/.test(lines[index + 1]?.trim() ?? "")) {
        index += 1;
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
      }
      activeBlocks.push({ type: "ordered-list", items, start });
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [line.replace(/^>\s?/, "")];
      while (lines[index + 1]?.trim().startsWith(">")) {
        index += 1;
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
      }
      activeBlocks.push({ type: "blockquote", text: quote.join(" ") });
      continue;
    }

    if (line.includes("|") && isTableDivider(lines[index + 1]?.trim() ?? "")) {
      const headers = tableCells(line);
      const rows: string[][] = [];
      index += 2;
      while (lines[index] && lines[index].includes("|")) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      index -= 1;
      activeBlocks.push({ type: "table", headers, rows });
      continue;
    }

    const paragraph = [line];
    while (
      lines[index + 1]?.trim() &&
      !isBlockStart(lines[index + 1].trim(), lines[index + 2]?.trim())
    ) {
      index += 1;
      paragraph.push(lines[index].trim());
    }
    const text = paragraph.join(" ");
    if (sections.length === 0 && !deck) {
      deck = asDeck(paragraph.join("\n"));
      if (deck) continue;
    }
    activeBlocks.push({ type: "paragraph", text });
  }

  return { deck, intro, sections, title };
}

function inlineContent(
  text: string,
  anchorPrefix = "",
  basePath = "",
  highlightExternalLinks = false,
): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].startsWith("#")
        ? `${anchorPrefix}${link[2]}`
        : link[2].startsWith("/")
          ? `${basePath}${link[2]}`
          : link[2];
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          className={highlightExternalLinks && isExternal ? "guide-resource-link" : undefined}
          href={href}
          key={`${href}-${index}`}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {link[1]}
          {highlightExternalLinks && isExternal ? <ExternalLinkIcon /> : null}
        </a>
      );
    }

    if (token.startsWith("*") && token.endsWith("*")) {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
      }
      return <em key={`${token}-${index}`}>{token.slice(1, -1)}</em>;
    }

    return token;
  });
}

export function publicAssetUrl(source: string, basePath: string) {
  const normalized = source.replace(/\\/g, "/");
  const publicMarker = "/public/";
  const markerIndex = normalized.lastIndexOf(publicMarker);

  if (markerIndex === -1) return source;
  return `${basePath}/${normalized.slice(markerIndex + publicMarker.length)}`;
}

export function GuideBlocks({
  anchorPrefix,
  basePath,
  blocks,
  highlightExternalLinks = false,
}: {
  anchorPrefix?: string;
  basePath: string;
  blocks: GuideBlock[];
  highlightExternalLinks?: boolean;
}) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      return (
        <h3 id={block.id} key={`${block.id}-${index}`}>
          {inlineContent(block.text, anchorPrefix, basePath, highlightExternalLinks)}
        </h3>
      );
    }

    if (block.type === "blockquote") {
      return <blockquote key={`blockquote-${index}`}>{inlineContent(block.text, anchorPrefix, basePath, highlightExternalLinks)}</blockquote>;
    }

    if (block.type === "code") {
      return (
        <pre className="prose-guide-code" key={`code-${index}`}>
          <code data-language={block.language}>{block.text}</code>
        </pre>
      );
    }

    if (block.type === "image") {
      return (
        // The guide image is a Markdown-authored static asset, served without an image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={block.alt}
          className="spectrum-image"
          key={`${block.source}-${index}`}
          src={publicAssetUrl(block.source, basePath)}
        />
      );
    }

    if (block.type === "list") {
      return (
        <ul className="spectrum-list" key={`list-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{inlineContent(item, anchorPrefix, basePath, highlightExternalLinks)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "ordered-list") {
      return (
        <ol className="spectrum-list spectrum-ordered-list" key={`ordered-list-${index}`} start={block.start}>
          {block.items.map((item) => (
            <li key={item}>{inlineContent(item, anchorPrefix, basePath, highlightExternalLinks)}</li>
          ))}
        </ol>
      );
    }

    if (block.type === "table") {
      return (
        <div className="spectrum-table-wrap" key={`table-${index}`}>
          <table className="spectrum-table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{inlineContent(header, anchorPrefix, basePath, highlightExternalLinks)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>
                      {inlineContent(cell, anchorPrefix, basePath, highlightExternalLinks)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <p key={`paragraph-${index}`}>{inlineContent(block.text, anchorPrefix, basePath, highlightExternalLinks)}</p>;
  });
}
