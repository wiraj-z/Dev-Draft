import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/utils/dates";
import type { Post } from "@/types/blog";

type PostContentProps = {
  post: Post;
};

export function PostContent({ post }: PostContentProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 mb-4">
          Article
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl leading-tight">
          {post.title}
        </h1>

        <div className="mt-8 flex items-center gap-4">
          <Avatar
            imagePath={post.author.image_path}
            username={post.author.username}
            size="md"
          />
          <div>
            <Link
              href={`/users/${post.author.id}/posts`}
              className="font-medium text-foreground transition-colors hover:text-brand-400"
            >
              {post.author.username}
            </Link>
            <p className="text-sm text-muted mt-0.5">
              Published {formatDateTime(post.date_posted)}
            </p>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-brand mt-10 max-w-none text-lg leading-relaxed text-muted prose-headings:text-foreground prose-a:text-brand-500 hover:prose-a:text-brand-400 prose-strong:text-foreground prose-pre:bg-surface prose-pre:border-border prose-pre:border">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
