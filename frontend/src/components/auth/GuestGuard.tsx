"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/providers/AuthProvider";

type GuestGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function GuestGuard({
  children,
  redirectTo = "/account",
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <Spinner />
      </PageContainer>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
