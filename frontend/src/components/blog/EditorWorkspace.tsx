"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { createPost, getUserPosts, getPost, updatePost } from "@/lib/api/posts";
import type { Post } from "@/types/blog";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getErrorMessage } from "@/lib/utils/errors";
import { formatDate } from "@/lib/utils/dates";

type EditorWorkspaceProps = {
  postId?: number;
};

export function EditorWorkspace({ postId }: EditorWorkspaceProps = {}) {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(!!postId);
  const [error, setError] = useState<string | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user?.id) {
      getUserPosts(user.id).then(setMyPosts).catch(console.error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (postId) {
      setIsLoadingPost(true);
      getPost(postId)
        .then((post) => {
          setTitle(post.title);
          setContent(post.content);
          setIsLoadingPost(false);
        })
        .catch((err) => {
          setError(getErrorMessage(err, "Unable to load post."));
          setIsLoadingPost(false);
        });
    }
  }, [postId]);

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
      let post;
      if (postId) {
        post = await updatePost(postId, { title: title.trim(), content: content.trim() }, token);
      } else {
        post = await createPost({ title: title.trim(), content: content.trim() }, token);
      }
      router.push(`/blog/${post.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to publish post."));
      setIsSaving(false);
    }
  }

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (isLoadingPost) {
    return (
      <div className="flex h-full flex-col bg-background items-center justify-center">
        <p className="text-muted">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Global Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/30 px-4 sm:px-6">
        <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
          ← Back to Home
        </Link>
        <div className="text-sm font-medium text-foreground">{postId ? "Edit Post" : "Write Post"}</div>
        <Button onClick={handlePublish} isLoading={isSaving} size="sm">
          {postId ? "Update" : "Publish"}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-border bg-surface/10 flex-col hidden md:flex">
          <div className="p-4 border-b border-border font-semibold text-sm tracking-tight text-foreground flex items-center justify-between">
            <span>My Posts</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {myPosts.length > 0 ? (
              <ul className="space-y-1">
                {myPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.id}`}
                      className="block p-5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-border-hover transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
                      target="_blank"
                    >
                      <div className="font-medium truncate text-foreground">{post.title}</div>
                      <div className="text-xs mt-1 text-muted/80">{formatDate(post.date_posted)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-xs text-muted text-center">No posts yet.</div>
            )}
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-background">
          {error && (
            <div className="w-full max-w-4xl mx-auto px-6 pt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <div className="mx-auto flex w-full max-w-4xl flex-col px-6 pt-10 sm:pt-16 pb-8 flex-1">
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

            <div className="mt-10 flex-1 flex flex-col min-h-[400px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your post..."
                className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-foreground outline-none placeholder:text-muted/40"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-border bg-surface/10 px-6 py-2 text-xs font-medium text-muted/60 sticky bottom-0">
            <div>Plain text supported</div>
            <div className="flex gap-4">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
