import { getTopTodayOffers } from "@bonusmax/lib";
import TopBonusesSectionClient from "./home/TopBonusesSectionClient";

export default async function TopToday() {
  const top = await getTopTodayOffers(6, 72);
  const offers = top.map((t: any) => t.offer);
  return (
    <section id="topul-de-azi" className="mx-auto mt-6 md:mt-8 max-w-6xl px-4">
      <TopBonusesSectionClient offers={offers} />
    </section>
  );
}
