import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
}

export default function SectionHeader({ title, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {viewAllLink && (
        <Link href={viewAllLink} className="view-all">
          Xem tất cả &rarr;
        </Link>
      )}
    </div>
  );
}
