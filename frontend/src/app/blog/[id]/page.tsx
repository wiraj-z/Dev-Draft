import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/blog/PostContent";
import { PageContainer } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/ui/ErrorState";
import { siteConfig } from "@/config/site";
import { getPost } from "@/lib/api/posts";
import { ApiError } from "@/lib/utils/errors";
import type { Post } from "@/types/blog";

type BlogPostPageProps = {
  params: Promise<{ id: string }>;
};

async function loadPost(
  postId: number,
): Promise<{ post: Post | null; error: string | null; notFound: boolean }> {
  try {
    const post = await getPost(postId);
    return { post, error: null, notFound: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { post: null, error: null, notFound: true };
    }

    const message =
      error instanceof ApiError ? error.message : "Unable to load this post.";
    return { post: null, error: message, notFound: false };
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return { title: "Post not found" };
  }

  const { post } = await loadPost(postId);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    notFound();
  }

  const { post, error, notFound: isNotFound } = await loadPost(postId);

  if (isNotFound) {
    notFound();
  }

  if (error || !post) {
    return (
      <PageContainer>
        <ErrorState message={error ?? "Unable to load this post."} />
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <PostContent post={post} />
    </PageContainer>
  );
}
