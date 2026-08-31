import { PageContainer } from "@/components/layout/PageContainer";
import { Spinner } from "@/components/ui/Spinner";

export default function BlogLoading() {
  return (
    <PageContainer className="flex items-center justify-center py-24">
      <Spinner />
    </PageContainer>
  );
}
