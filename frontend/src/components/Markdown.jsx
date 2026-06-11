import React from "react";

/**
 * Minimal markdown renderer for AI insights.
 * Supports: # / ## / ### headings, **bold**, numbered lists, bullet lists, paragraphs.
 */
export function Markdown({ text }) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let buffer = [];
  let listType = null; // 'ul' | 'ol' | null
  let listItems = [];

  const flushParagraph = () => {
    if (buffer.length) {
      blocks.push({ type: "p", content: buffer.join(" ") });
      buffer = [];
    }
  };
  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: listType, items: listItems });
      listItems = [];
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const olItem = line.match(/^\d+[.)]\s+(.*)$/);
    const ulItem = line.match(/^[-*•]\s+(.*)$/);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: `h${heading[1].length}`, content: heading[2] });
    } else if (olItem) {
      flushParagraph();
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(olItem[1]);
    } else if (ulItem) {
      flushParagraph();
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(ulItem[1]);
    } else {
      flushList();
      buffer.push(line);
    }
  }
  flushParagraph();
  flushList();

  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i}>{p.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      )
    );
  };

  return (
    <div className="insight-prose text-[15px] text-neutral-800">
      {blocks.map((b, i) => {
        if (b.type === "h1" || b.type === "h2" || b.type === "h3") {
          const Tag = b.type;
          return <Tag key={i}>{renderInline(b.content)}</Tag>;
        }
        if (b.type === "p") {
          return <p key={i}>{renderInline(b.content)}</p>;
        }
        if (b.type === "ul") {
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
}
