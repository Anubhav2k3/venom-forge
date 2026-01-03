import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  className?: string;
}

export function CodeBlock({ code, language = "bash", label, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={clsx("rounded-md border border-border bg-card overflow-hidden", className)}>
      {(label || true) && (
        <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {label || language}
          </span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            fontFamily: "var(--font-mono)",
          }}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
