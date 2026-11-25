import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  description,
  viewAllHref,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
