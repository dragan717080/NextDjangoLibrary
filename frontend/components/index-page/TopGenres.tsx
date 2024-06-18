import React from "react";

import { useTopGenresStore } from "@/app/store/zustandStore";

import GenreCard from "./GenreCard";

const TopGenres = () => {
  const { topGenres } = useTopGenresStore();

  return (
    <section className="bg-q-foreground pt-10">
      <div className="container pb-12">
        <h2 className="from-[#819EA7] mx-auto w-fit bg-gradient-to-r to-[#5C6CbC] bg-clip-text pb-12 text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl">
          Top genres
        </h2>
        <div className="cards grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {topGenres.slice(0, 9).map((genre, index) => (
            <GenreCard genre={genre} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopGenres;
