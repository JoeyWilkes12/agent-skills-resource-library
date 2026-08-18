import type { ReactNode } from "react";

type GuideBlock =
  | { type: "image"; alt: string; source: string }
  | { type: "list"; items: string[] }
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
    /^#{1,2}\s+/.test(line) ||
    /^!\[[^\]]*\]\([^)]+\)$/.test(line) ||
    /^-\s+/.test(line) ||
    (line.includes("|") && Boolean(nextLine && isTableDivider(nextLine)))
  );
}

function parseFrontmatter(source: string) {
  if (!source.startsWith("---\n")) return source;

  const end = source.indexOf("\n---\n", 4);
  return end === -1 ? source : source.slice(end + 5);
}

function asDeck(text: string) {
  const match = text.match(/^\*(.+)\*$/);
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
      deck = asDeck(text);
      if (deck) continue;
    }
    activeBlocks.push({ type: "paragraph", text });
  }

  return { deck, intro, sections, title };
}

function inlineContent(text: string, anchorPrefix = ""): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].startsWith("#") ? `${anchorPrefix}${link[2]}` : link[2];
      return (
        <a href={href} key={`${href}-${index}`}>
          {link[1]}
        </a>
      );
    }

    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={`${token}-${index}`}>{token.slice(1, -1)}</em>;
    }

    return token;
  });
}

function publicAssetUrl(source: string, basePath: string) {
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
}: {
  anchorPrefix?: string;
  basePath: string;
  blocks: GuideBlock[];
}) {
  return blocks.map((block, index) => {
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
            <li key={item}>{inlineContent(item, anchorPrefix)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "table") {
      return (
        <div className="spectrum-table-wrap" key={`table-${index}`}>
          <table className="spectrum-table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{inlineContent(header, anchorPrefix)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>
                      {inlineContent(cell, anchorPrefix)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <p key={`paragraph-${index}`}>{inlineContent(block.text, anchorPrefix)}</p>;
  });
}
