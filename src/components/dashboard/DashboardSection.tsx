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
    <section className="animate-in fade-in space-y-4 duration-500 motion-reduce:animate-none">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="heading text-lg">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
