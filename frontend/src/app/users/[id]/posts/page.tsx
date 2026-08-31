import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog/BlogList";
import { PageContainer } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { createPageMetadata } from "@/config/seo";
import { getUser, getUserPosts } from "@/lib/api/users";
import { ApiError } from "@/lib/utils/errors";
import type { Post } from "@/types/blog";
import type { UserPublic } from "@/types/user";

type UserPostsPageProps = {
  params: Promise<{ id: string }>;
};

async function loadUserPosts(userId: number): Promise<{
  user: UserPublic | null;
  posts: Post[] | null;
  error: string | null;
  notFound: boolean;
}> {
  try {
    const [user, posts] = await Promise.all([
      getUser(userId),
      getUserPosts(userId),
    ]);
    return { user, posts, error: null, notFound: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { user: null, posts: null, error: null, notFound: true };
    }

    const message =
      error instanceof ApiError ? error.message : "Unable to load user posts.";
    return { user: null, posts: null, error: message, notFound: false };
  }
}

export async function generateMetadata({ params }: UserPostsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return { title: "User not found" };
  }

  const { user } = await loadUserPosts(userId);

  if (!user) {
    return { title: "User not found" };
  }

  return createPageMetadata({
    title: `${user.username}'s posts`,
    path: `/users/${userId}/posts`,
  });
}

export default async function UserPostsPage({ params }: UserPostsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    notFound();
  }

  const { user, posts, error, notFound: isNotFound } = await loadUserPosts(userId);

  if (isNotFound) {
    notFound();
  }

  if (error || !user || !posts) {
    return (
      <PageContainer>
        <ErrorState message={error ?? "Unable to load user posts."} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <header className="mb-10 flex items-center gap-5">
        <Avatar
          imagePath={user.image_path}
          username={user.username}
          size="lg"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user.username}&apos;s posts
          </h1>
          <p className="mt-1 text-muted">{posts.length} published articles</p>
        </div>
      </header>

      {posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <EmptyState
          title="No posts yet"
          description={`${user.username} hasn't published any posts.`}
          action={
            <Link href="/blog" className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-400">
              Browse the blog
            </Link>
          }
        />
      )}
    </PageContainer>
  );
}
