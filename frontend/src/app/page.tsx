import Link from "next/link";
import { BlogList } from "@/components/blog/BlogList";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { paginationConfig } from "@/config/pagination";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/api/posts";
import { ApiError } from "@/lib/utils/errors";

export const metadata = createPageMetadata({
  title: "Home",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  let posts = null;
  let errorMessage: string | null = null;

  try {
    const response = await getPosts({
      skip: 0,
      limit: paginationConfig.homeRecentPosts,
    });
    posts = response.posts;
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load recent posts.";
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[100px]" />
        
        <PageContainer className="py-20 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 mb-4">
              Developer Blog
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl sm:leading-tight">
              Build. Learn. <br className="hidden sm:block" />
              Experiment. Share.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted max-w-2xl">
              {siteConfig.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/blog">
                <Button size="lg">Explore Articles</Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Recent Articles</h2>
            <p className="mt-2 text-sm text-muted">
              The latest thoughts and tutorials from the community.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-400 flex items-center gap-1">
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {errorMessage ? (
          <EmptyState
            title="Could not load posts"
            description={errorMessage}
          />
        ) : posts && posts.length > 0 ? (
          <BlogList posts={posts} />
        ) : (
          <EmptyState
            title="No articles yet"
            description="Be the first to publish something on the blog."
            action={
              <Link href="/post-create/create">
                <Button>Create a post</Button>
              </Link>
            }
          />
        )}

        <section className="mt-20 rounded-2xl border border-border bg-surface/50 p-8 sm:p-10 transition-colors hover:bg-surface/80">
          <h2 className="text-xl font-semibold text-foreground">About the author</h2>
          <p className="mt-4 text-muted leading-relaxed max-w-3xl">{siteConfig.author.bio}</p>
          <p className="mt-6 text-sm font-medium text-foreground flex items-center gap-2">
            <span className="h-px w-6 bg-brand-500"></span>
            {siteConfig.author.name}
          </p>
        </section>
      </PageContainer>
    </>
  );
}
