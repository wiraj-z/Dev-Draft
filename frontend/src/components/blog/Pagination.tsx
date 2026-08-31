import Link from "next/link";
import { Button } from "@/components/ui/Button";

type PaginationProps = {
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
  basePath?: string;
};

export function Pagination({
  skip,
  limit,
  total,
  hasMore,
  basePath = "/blog",
}: PaginationProps) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const prevSkip = Math.max(0, skip - limit);
  const nextSkip = skip + limit;

  if (total <= limit) {
    return null;
  }

  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
      <p className="text-sm font-medium text-muted">
        Page {currentPage} of {totalPages} <span className="mx-2 text-border">|</span> {total} posts
      </p>

      <div className="flex gap-3">
        {skip > 0 ? (
          <Link href={`${basePath}?skip=${prevSkip}&limit=${limit}`}>
            <Button variant="secondary" size="sm">
              Previous
            </Button>
          </Link>
        ) : null}

        {hasMore ? (
          <Link href={`${basePath}?skip=${nextSkip}&limit=${limit}`}>
            <Button variant="secondary" size="sm">
              Next
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
