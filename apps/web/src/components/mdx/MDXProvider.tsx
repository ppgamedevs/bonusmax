import { MDXRemote } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";
import { WarningBox, InfoBox } from "./Boxes";

const CtaOffer = dynamic(() => import("./CtaOffer"), { ssr: true });

const components = { WarningBox, InfoBox, CtaOffer } as const;

export default function MDXProvider({ source }: { source: string }) {
  // Render MDX server-side with provided components
  // MDXRemote (RSC) handles compilation at runtime in the app router
  // Ensure next.config.ts has MDX enabled if importing .mdx pages; for raw strings this is fine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MDXRemote source={source} components={components as any} />;
}
