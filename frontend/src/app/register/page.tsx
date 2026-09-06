import Link from "next/link";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Sign up",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <GuestGuard>
      <PageContainer narrow className="py-20">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join the blog and start publishing your writing.
          </p>

          <div className="mt-8">
            <RegisterForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-500 transition-colors hover:text-brand-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </PageContainer>
    </GuestGuard>
  );
}
