import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Reset password",
  path: "/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <PageContainer narrow className="py-20">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset password</h1>
        <p className="mt-2 text-sm text-muted">
          Choose a new password for your account.
        </p>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
