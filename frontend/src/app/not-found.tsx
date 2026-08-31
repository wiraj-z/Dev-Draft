import { PageContainer } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/ui/ErrorState";

export default function NotFound() {
  return (
    <PageContainer>
      <ErrorState
        title="Page not found"
        message="The page you are looking for does not exist."
      />
    </PageContainer>
  );
}
