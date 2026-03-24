import type { ReactNode } from "react";

function formatInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  let tokenCounter = 0;

  return parts.map((part) => {
    const tokenKey = `${part}-${tokenCounter++}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={tokenKey}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={tokenKey}
          className="rounded bg-slate-200/70 px-1 py-0.5 text-xs text-slate-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={tokenKey}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

type MarkdownFormatterProps = {
  content: string;
};

export default function MarkdownFormatter({ content }: MarkdownFormatterProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  const listBuffer: string[] = [];
  let codeBlockBuffer: string[] = [];
  let inCodeBlock = false;
  let keyCounter = 0;

  const nextKey = (prefix: string) => `${prefix}-${keyCounter++}`;

  const flushList = (keyPrefix: string) => {
    if (listBuffer.length === 0) {
      return;
    }
    let itemKeyCounter = 0;

    blocks.push(
      <ul
        key={`${keyPrefix}-${nextKey("ul")}`}
        className="list-disc space-y-1 pl-5"
      >
        {listBuffer.map((item) => (
          <li key={`${item}-${itemKeyCounter++}`}>
            {formatInlineMarkdown(item)}
          </li>
        ))}
      </ul>,
    );
    listBuffer.length = 0;
  };

  const flushCodeBlock = (keyPrefix: string) => {
    if (codeBlockBuffer.length === 0) {
      return;
    }

    blocks.push(
      <pre
        key={`${keyPrefix}-${nextKey("pre")}`}
        className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100"
      >
        <code>{codeBlockBuffer.join("\n")}</code>
      </pre>,
    );
    codeBlockBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      flushList(nextKey("line"));
      if (inCodeBlock) {
        flushCodeBlock(nextKey("line"));
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(rawLine);
      return;
    }

    const listMatch = /^[-*]\s+(.+)$/.exec(line);
    if (listMatch) {
      listBuffer.push(listMatch[1]);
      return;
    }

    flushList(nextKey("line"));

    if (!line) {
      blocks.push(<div key={nextKey("spacer")} className="h-2" />);
      return;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={nextKey("h3")} className="text-sm font-semibold">
          {formatInlineMarkdown(line.replace(/^###\s+/, ""))}
        </h3>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={nextKey("h2")} className="text-base font-semibold">
          {formatInlineMarkdown(line.replace(/^##\s+/, ""))}
        </h2>,
      );
      return;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={nextKey("h1")} className="text-lg font-semibold">
          {formatInlineMarkdown(line.replace(/^#\s+/, ""))}
        </h1>,
      );
      return;
    }

    blocks.push(
      <p key={nextKey("p")} className="leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>,
    );
  });

  flushList("final");
  flushCodeBlock("final");

  return <div className="space-y-1">{blocks}</div>;
}
