import { AuthGuard } from "@/components/auth/AuthGuard";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { ProfilePictureForm } from "@/components/forms/ProfilePictureForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Account",
  path: "/account",
});

export default function AccountPage() {
  return (
    <AuthGuard>
      <PageContainer narrow className="py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account settings</h1>
        <p className="mt-2 text-muted">
          Manage your profile, password, and profile picture.
        </p>

        <section className="mt-10 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Profile picture</h2>
          <ProfilePictureForm />
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="mt-6">
            <ProfileForm />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Change password</h2>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </section>
      </PageContainer>
    </AuthGuard>
  );
}
