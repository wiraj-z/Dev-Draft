import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreatePostForm } from "@/components/forms/CreatePostForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Create Post",
  path: "/create",
});

export default function CreatePostPage() {
  return (
    <AuthGuard>
      <PageContainer narrow className="py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create a new post</h1>
        <p className="mt-2 text-muted">
          Write and publish a new article to the blog.
        </p>

        <section className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <CreatePostForm />
        </section>
      </PageContainer>
    </AuthGuard>
  );
}
