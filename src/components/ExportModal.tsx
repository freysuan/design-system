import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { DesignTokens } from "@/types";
import { generateCssVariables, generateTailwindConfig } from "@/lib/utils";
import { Copy, Check, Download } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  tokens: DesignTokens;
}

export function ExportModal({ open, onClose, tokens }: ExportModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const cssVars = generateCssVariables(tokens);
  const tailwindCfg = generateTailwindConfig(tokens);
  const jsonOutput = JSON.stringify(tokens, null, 2);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Export Design Tokens
            <Badge variant="secondary">3 formats</Badge>
          </DialogTitle>
          <DialogDescription>
            Copy or download your design tokens in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="css">
          <TabsList className="w-full">
            <TabsTrigger value="css" className="flex-1">CSS Variables</TabsTrigger>
            <TabsTrigger value="tailwind" className="flex-1">Tailwind Config</TabsTrigger>
            <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="mt-3">
            <CodeBlock
              code={cssVars}
              language="css"
              onCopy={() => copy(cssVars, "css")}
              onDownload={() => download(cssVars, "tokens.css")}
              copied={copied === "css"}
            />
          </TabsContent>

          <TabsContent value="tailwind" className="mt-3">
            <CodeBlock
              code={tailwindCfg}
              language="javascript"
              onCopy={() => copy(tailwindCfg, "tailwind")}
              onDownload={() => download(tailwindCfg, "tailwind.config.js")}
              copied={copied === "tailwind"}
            />
          </TabsContent>

          <TabsContent value="json" className="mt-3">
            <CodeBlock
              code={jsonOutput}
              language="json"
              onCopy={() => copy(jsonOutput, "json")}
              onDownload={() => download(jsonOutput, "design-tokens.json")}
              copied={copied === "json"}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CodeBlock({
  code,
  language,
  onCopy,
  onDownload,
  copied,
}: {
  code: string;
  language: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}) {
  return (
    <div className="relative rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5" onClick={onDownload}>
            <Download className="h-3.5 w-3.5" />
            <span className="text-xs">Download</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5" onClick={onCopy}>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="h-64">
        <pre className="p-4 text-xs font-mono leading-relaxed text-foreground whitespace-pre-wrap">
          {code}
        </pre>
      </ScrollArea>
    </div>
  );
}
