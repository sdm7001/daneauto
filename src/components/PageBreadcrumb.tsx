import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

const PageBreadcrumb = ({ segments, className }: PageBreadcrumbProps) => (
  <Breadcrumb className={className}>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/" className="flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={segment.label} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast || !segment.href ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export default PageBreadcrumb;
