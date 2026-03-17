
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TypesPage() {
  const types = ["TV", "Movie", "OVA", "ONA", "Special", "Music"];
  return (
    <div className="container py-8">
      <SectionTitle>
        Types
      </SectionTitle>
      <p className="text-muted-foreground mb-4">Filter anime by type.</p>
       <div className="flex flex-wrap gap-2">
            {types.map(type => (
                 <Button key={type} variant="secondary" size="sm" asChild>
                    <Link href={`/category/${type.toLowerCase()}`}>{type}</Link>
                </Button>
            ))}
        </div>
    </div>
  );
}
