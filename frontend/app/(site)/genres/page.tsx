import React from "react";

import { useTopGenresStore } from "@/app/store/zustandStore";

const GenresPage = () => {
  return (
    <div className="py-10 px-7 md:px-12 xl:px-20">
      <h1 className="from-primary to-[#819EA7] w-fit bg-gradient-to-r bg-clip-text pb-2 text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl">
        Genres
      </h1>
    </div>
  );
};

export default GenresPage;
