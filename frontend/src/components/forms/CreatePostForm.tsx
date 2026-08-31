"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostForm } from "@/components/forms/PostForm";
import { createPost } from "@/lib/api/posts";
import { useAuth } from "@/providers/AuthProvider";
import { Alert } from "@/components/ui/Alert";
import { getErrorMessage } from "@/lib/utils/errors";
import type { PostCreateData } from "@/types/blog";

export function CreatePostForm() {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: PostCreateData) {
    if (!token) return;
    setError(null);
    setIsLoading(true);

    try {
      const post = await createPost(data, token);
      router.push(`/blog/${post.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create post"));
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <PostForm submitLabel="Publish Post" isLoading={isLoading} onSubmit={handleSubmit} />
    </div>
  );
}
