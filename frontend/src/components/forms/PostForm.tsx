"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { PostCreateData } from "@/types/blog";

type PostFormProps = {
  initialValues?: PostCreateData;
  submitLabel: string;
  isLoading?: boolean;
  onSubmit: (data: PostCreateData) => Promise<void>;
};

export function PostForm({
  initialValues = { title: "", content: "" },
  submitLabel,
  isLoading = false,
  onSubmit,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    await onSubmit({ title: title.trim(), content: content.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Input
        label="Title"
        name="title"
        required
        maxLength={100}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <Textarea
        label="Content"
        name="content"
        required
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <Button type="submit" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
