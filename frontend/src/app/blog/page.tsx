import { BlogList } from "@/components/blog/BlogList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { Pagination } from "@/components/blog/Pagination";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { paginationConfig } from "@/config/pagination";
import { createPageMetadata } from "@/config/seo";
import { getPosts } from "@/lib/api/posts";
import { ApiError } from "@/lib/utils/errors";
import type { PaginatedPosts } from "@/types/blog";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Browse all blog posts.",
  path: "/blog",
});

type BlogPageProps = {
  searchParams: Promise<{
    skip?: string;
    limit?: string;
  }>;
};

async function loadBlogPosts(
  skip: number,
  limit: number,
): Promise<{ data: PaginatedPosts | null; error: string | null }> {
  try {
    const data = await getPosts({ skip, limit });
    return { data, error: null };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load blog posts.";
    return { data: null, error: message };
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const skip = Number(params.skip ?? 0);
  const limit = Number(params.limit ?? paginationConfig.defaultPageSize);

  if (Number.isNaN(skip) || skip < 0 || Number.isNaN(limit) || limit < 1) {
    return (
      <PageContainer>
        <ErrorState message="Invalid pagination parameters." />
      </PageContainer>
    );
  }

  const { data, error } = await loadBlogPosts(skip, limit);

  if (error || !data) {
    return (
      <PageContainer>
        <ErrorState message={error ?? "Unable to load blog posts."} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between max-w-7xl">
      <div className="flex-1 w-full min-w-0 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Blog</h1>
          <p className="mt-2 text-muted">Explore all published articles.</p>
        </header>

        {data.posts.length > 0 ? (
          <>
            <BlogList posts={data.posts} />
            <Pagination
              skip={data.skip}
              limit={data.limit}
              total={data.total}
              hasMore={data.has_more}
            />
          </>
        ) : (
          <EmptyState
            title="No posts found"
            description="There are no published posts yet."
          />
        )}
      </div>
      <BlogSidebar />
    </PageContainer>
  );
}
