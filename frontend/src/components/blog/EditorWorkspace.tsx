"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/providers/AuthProvider";
import { createPost } from "@/lib/api/posts";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getErrorMessage } from "@/lib/utils/errors";

export function EditorWorkspace() {
  const { token } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, content]);

  async function handlePublish() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (!token) return;

    setIsSaving(true);
    setError(null);
    try {
      const post = await createPost({ title: title.trim(), content: content.trim() }, token);
      router.push(`/blog/${post.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to publish post."));
      setIsSaving(false);
    }
  }

  const insertText = (before: string, after: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
        <Link href="/account" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
          ← Posts
        </Link>
        <div className="text-sm font-medium text-foreground">Create Post</div>
        <Button onClick={handlePublish} isLoading={isSaving} size="sm">
          Publish
        </Button>
      </header>

      {error && (
        <div className="mx-auto mt-4 w-full max-w-4xl px-4 sm:px-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {/* Title Area */}
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-12 sm:px-6">
        <textarea
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            autoResize(e);
          }}
          placeholder="Write your title..."
          className="w-full resize-none bg-transparent text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted/40 sm:text-5xl"
          rows={1}
        />
      </div>

      {/* Unified Editor Workspace */}
      <div className="mx-auto mt-10 flex w-full max-w-4xl flex-1 flex-col px-4 pb-8 sm:px-6">
        <div className="flex min-h-[400px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface/10 shadow-sm">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-surface/40 px-3 py-2">
            {!isPreview ? (
              <div className="flex items-center gap-1">
                <ToolbarButton onClick={() => insertText("**", "**")} label="Bold (B)" icon="B" />
                <ToolbarButton onClick={() => insertText("_", "_")} label="Italic (I)" icon="I" />
                <div className="mx-1 h-4 w-px bg-border/80" />
                <ToolbarButton onClick={() => insertText("# ", "")} label="Heading 1" icon="H1" />
                <ToolbarButton onClick={() => insertText("## ", "")} label="Heading 2" icon="H2" />
                <div className="mx-1 h-4 w-px bg-border/80" />
                <ToolbarButton onClick={() => insertText("- ", "")} label="Bullet List" icon="•" />
                <ToolbarButton onClick={() => insertText("1. ", "")} label="Numbered List" icon="1." />
                <div className="mx-1 h-4 w-px bg-border/80" />
                <ToolbarButton onClick={() => insertText('"', '"')} label="Quote" icon='"' />
                <ToolbarButton onClick={() => insertText("```\n", "\n```")} label="Code Block" icon="<>" />
                <ToolbarButton onClick={() => insertText("[", "](url)")} label="Link" icon="🔗" />
              </div>
            ) : (
              <div className="px-2 text-sm font-medium text-muted">Preview Mode</div>
            )}

            <div className="flex items-center rounded-lg border border-border/50 bg-background/50 p-0.5 shadow-sm">
              <button
                onClick={() => setIsPreview(false)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!isPreview ? "bg-brand-500 text-white shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                Write
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${isPreview ? "bg-brand-500 text-white shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Textarea / Preview Content */}
          <div className="flex-1 overflow-y-auto bg-transparent p-6">
            {!isPreview ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your post..."
                className="h-full min-h-[300px] w-full resize-none bg-transparent text-lg leading-relaxed text-foreground outline-none placeholder:text-muted/40"
              />
            ) : (
              <div className="prose prose-invert prose-brand max-w-none text-lg leading-relaxed text-muted prose-headings:text-foreground prose-a:text-brand-500 hover:prose-a:text-brand-400 prose-strong:text-foreground prose-pre:bg-surface prose-pre:border-border prose-pre:border">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "Nothing to preview yet."}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Editor Footer / Word Count */}
          <div className="flex items-center justify-between border-t border-border bg-surface/30 px-4 py-2 text-xs font-medium text-muted/60">
            <div>Markdown supported</div>
            <div className="flex gap-4">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, label, icon }: { onClick: () => void; label: string; icon: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      {icon}
    </button>
  );
}
