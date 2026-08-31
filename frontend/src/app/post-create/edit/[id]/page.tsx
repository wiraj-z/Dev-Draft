import { AuthGuard } from "@/components/auth/AuthGuard";
import { EditorWorkspace } from "@/components/blog/EditorWorkspace";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Edit Post",
  path: "/edit",
});

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return <div className="p-8 text-center text-muted">Invalid post ID</div>;
  }

  return (
    <AuthGuard>
      <main className="flex h-screen w-full flex-col bg-background">
        <EditorWorkspace postId={postId} />
      </main>
    </AuthGuard>
  );
}
