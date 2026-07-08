'use client'
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPayment() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card/90 p-6 shadow-lg backdrop-blur">
        <Skeleton className="h-10 w-10 rounded-full" />
        <p className="text-sm text-muted-foreground">Procesando pago...</p>
      </div>
    </div>
  );
}
