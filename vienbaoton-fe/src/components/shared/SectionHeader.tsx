import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  title,
  viewAllLink,
  viewAllText,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {viewAllLink && (
        <Link href={viewAllLink} className="view-all">
          {viewAllText} &rarr;
        </Link>
      )}
    </div>
  );
}
