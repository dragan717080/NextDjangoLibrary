"use client";

import {
  GreatReads,
  Hero,
  NewestUsers,
  TopBooksLastYear,
  TopGenres,
} from "@/components/index-page";

import useFetch from "@/hooks/use-fetch";

import "@/app/index.css";
import "@/app/layout.css";

export default function Home() {
  useFetch();

  return (
    <main className="min-h-screen w-full text-white">
      <>
        <Hero />

        <GreatReads />

        <NewestUsers />

        <TopBooksLastYear />

        <TopGenres />
      </>
    </main>
  );
}
