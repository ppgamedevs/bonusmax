"use client";

import { useEffect } from "react";

export default function ArticleAnalytics({
  category,
  slug,
  title,
}: {
  category: string;
  slug: string;
  title: string;
}) {
  useEffect(() => {
    const controller = new AbortController();
    try {
      localStorage.setItem(
        'help:last',
        JSON.stringify({ href: `/help/${category}/${slug}`, title })
      );
    } catch {}
    fetch("/api/ui/impression", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        component: "help_article_view",
        path: `/help/${category}/${slug}`,
        title,
      }),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {});
    return () => controller.abort();
  }, [category, slug, title]);

  return null;
}
