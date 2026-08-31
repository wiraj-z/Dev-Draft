import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Forgot password",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <PageContainer narrow className="py-20">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&apos;ll send reset instructions if an account exists.
        </p>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/login" className="font-medium text-brand-500 transition-colors hover:text-brand-400">
            Back to login
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
