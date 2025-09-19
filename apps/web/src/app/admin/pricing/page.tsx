import { Suspense } from "react";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingClient />
    </Suspense>
  );
}
