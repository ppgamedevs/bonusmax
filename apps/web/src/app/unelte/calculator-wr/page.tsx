export const dynamic = "force-dynamic";
export const revalidate = 60;
export const metadata = { title: "Calculator WR (Wagering Requirement)" };
import CalculatorWRClient from "./CalculatorWRClient";

export default function Page() {
  return <CalculatorWRClient />;
}
