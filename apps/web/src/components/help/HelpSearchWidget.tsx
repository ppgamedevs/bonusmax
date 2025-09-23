"use client";

import { useMemo, useState } from "react";
import HelpSearch from "./HelpSearch";
import type { HelpArticle, HelpCategory } from "@/lib/help-data";

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function HelpSearchWidget({
  articles,
  categories,
}: {
  articles: HelpArticle[];
  categories: HelpCategory[];
}) {
  const [q, setQ] = useState("");

  const { filteredArticles, filteredCategories } = useMemo(() => {
    if (!q) return { filteredArticles: [], filteredCategories: [] };
    const nq = norm(q);
    const filteredCategories = categories.filter(
      (c) => norm(c.title).includes(nq) || norm(c.description).includes(nq)
    );
    const filteredArticles = articles.filter(
      (a) => norm(a.title).includes(nq) || norm(a.excerpt).includes(nq)
    );
    return { filteredArticles, filteredCategories };
  }, [q, articles, categories]);

  return (
    <div className="mt-6">
      <HelpSearch
        query={q}
        onQueryChange={setQ}
        filteredArticles={filteredArticles}
        filteredCategories={filteredCategories}
      />
    </div>
  );
}
