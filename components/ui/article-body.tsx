import type { ReactNode } from "react";

/**
 * Minimal Markdown renderer for blog article bodies.
 *
 * The article page previously split the body on blank lines and dropped
 * every block into a `<p>`, which meant a draft's `## headings` and
 * `- bullets` rendered as literal punctuation in a wall of text.
 *
 * The R&D drafts use a small, closed set of constructs — H2, unordered
 * lists, ordered lists, paragraphs, `**bold**` and `*italic*` — with no
 * tables, links, images, code fences, blockquotes or H3. This renderer
 * covers exactly that set and nothing more, which is why it earns its
 * place over pulling in a full Markdown pipeline.
 *
 * Output is built as React elements, never `dangerouslySetInnerHTML`, so
 * article text cannot inject markup even if a draft is pasted in from an
 * untrusted source.
 */

/** Split a line into `**bold**` / `*italic*` runs and plain text. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Bold first: `**` would otherwise be consumed as two italic markers.
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
    i += 1;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

/**
 * Group the source into blocks. Lists are accumulated across consecutive
 * bullet lines so a run of `- ` items becomes one `<ul>`, not one per item.
 */
function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push(
      list.ordered
        ? { kind: "ol", items: list.items }
        : { kind: "ul", items: list.items },
    );
    list = null;
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushAll();
      continue;
    }

    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      blocks.push({ kind: "heading", text: heading[1].trim() });
      continue;
    }

    // A stray `# ` title inside the body is treated as a heading too, so a
    // draft pasted in whole never renders a bare hash.
    const h1 = /^#\s+(.*)$/.exec(line);
    if (h1) {
      flushAll();
      blocks.push({ kind: "heading", text: h1[1].trim() });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1].trim());
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      flushParagraph();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(numbered[1].trim());
      continue;
    }

    // Plain text: a list is interrupted, a paragraph continues.
    flushList();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

/** Strip emphasis markers, collapse whitespace, drop a trailing ellipsis. */
function normalizeForCompare(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/[….]+$/, "")
    .trim()
    .toLowerCase();
}

/**
 * True when the body already opens with the excerpt.
 *
 * Imported drafts derive their excerpt from the first paragraph, so an
 * article page that renders the excerpt as a lead *and* the full body
 * shows the same sentences twice. Posts written in the admin UI usually
 * have a genuinely separate summary, which must still be shown — hence a
 * content check rather than dropping the lead outright.
 */
export function bodyLeadsWithExcerpt(body: string, excerpt: string): boolean {
  if (!excerpt.trim()) return false;
  const head = normalizeForCompare(body).slice(0, 400);
  const lead = normalizeForCompare(excerpt);
  return lead.length > 0 && head.startsWith(lead);
}

export function ArticleBody({ source }: { source: string }) {
  const blocks = parseBlocks(source);

  return (
    <div className="mt-12 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2
                key={i}
                className="mt-12 text-xl font-semibold tracking-tight text-foreground first:mt-0 md:mt-14 md:text-2xl"
              >
                {renderInline(block.text, `h${i}`)}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="mt-6 list-disc space-y-3 pl-5 marker:text-brand-burgundy">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `u${i}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-6 list-decimal space-y-3 pl-5 marker:text-brand-burgundy">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `o${i}-${j}`)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className="mt-6 first:mt-0">
                {renderInline(block.text, `p${i}`)}
              </p>
            );
        }
      })}
    </div>
  );
}
