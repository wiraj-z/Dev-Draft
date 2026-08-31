import { AuthGuard } from "@/components/auth/AuthGuard";
import { EditorWorkspace } from "@/components/blog/EditorWorkspace";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Create Post",
  path: "/create",
});

export default function CreatePostPage() {
  return (
    <AuthGuard>
      <main className="flex h-screen w-full flex-col bg-background">
        <EditorWorkspace />
      </main>
    </AuthGuard>
  );
}
