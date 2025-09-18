import { prisma } from "@bonusmax/lib/prisma";
type PageProps = { searchParams?: Promise<Record<string, string | undefined>> };

interface PageProps {
  searchParams?: Promise<Record<string, string>>;
}

function getParam(sp: any, k: string) { 
  return typeof sp?.[k] === "string" ? sp[k] : undefined; 
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams: Record<string, string | undefined> = searchParams ? await searchParams : {};
  const keyParam = resolvedSearchParams.key;
  const from = getParam(resolvedSearchParams, "from");
  const to = getParam(resolvedSearchParams, "to");

  return (
    <div className="p-6">
      <h1>ROAS</h1>
      <p>Key: {keyParam}</p>
      <p>From: {from}</p> 
      <p>To: {to}</p>
    </div>
  );
}