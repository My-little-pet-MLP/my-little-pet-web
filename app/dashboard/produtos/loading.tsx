import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoadingPageProduct() {
  return (
    <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
      <section>
        <Card className="w-full p-6">
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-1/2 h-6" />
        </Card>
      </section>
    </main>
  );
}
