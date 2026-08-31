import Link from "next/link";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { LoginForm } from "@/components/forms/LoginForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Alert } from "@/components/ui/Alert";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Log in",
  path: "/login",
});

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <GuestGuard>
      <PageContainer narrow className="py-20">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Log in</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in with your email and password.
          </p>

          {params.registered ? (
            <Alert variant="success" className="mt-6">
              Account created successfully. You can log in now.
            </Alert>
          ) : null}

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brand-500 transition-colors hover:text-brand-400">
              Sign up
            </Link>
          </p>
        </div>
      </PageContainer>
    </GuestGuard>
  );
}
