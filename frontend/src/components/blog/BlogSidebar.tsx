"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { deletePost } from "@/lib/api/posts";
import type { Post } from "@/types/blog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type BlogSidebarProps = {
  currentPost?: Post;
};

export function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isOwner =
    isAuthenticated &&
    user &&
    currentPost &&
    currentPost.author.id === user.id;

  const handleDelete = async () => {
    if (!token || !currentPost) return;
    
    try {
      setIsDeleting(true);
      await deletePost(currentPost.id, token);
      setIsConfirmOpen(false);
      router.push("/blog");
      router.refresh();
    } catch (error) {
      alert("Failed to delete the post. Please try again.");
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Welcome</h3>
          <p className="text-sm text-muted mb-4">Log in to create and manage your own posts.</p>
          <Link
            href="/login"
            className="block w-full rounded-md bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-500 transition-colors"
          >
            Log in
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Dashboard</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href={`/users/${user.id}/posts`}
                className="text-sm font-medium text-muted hover:text-brand-400 transition-colors"
              >
                View all my posts
              </Link>
              <Link
                href="/post-create/create"
                className="text-sm font-medium text-muted hover:text-brand-400 transition-colors"
              >
                Create new post
              </Link>
            </nav>
          </div>

          {isOwner && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Manage Post</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/post-create/edit/${currentPost.id}`}
                  className="w-full rounded-md bg-surface px-4 py-2 text-center text-sm font-medium text-foreground border border-border hover:bg-border transition-colors"
                >
                  Edit Post
                </Link>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isDeleting}
                  className="w-full rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {isOwner && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </>
  );
}
