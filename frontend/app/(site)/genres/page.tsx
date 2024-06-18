"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components";
import { useTopGenresStore } from "@/app/store/zustandStore";
import { v4 as uuidv4 } from "uuid";

const GenresPage = () => {
  const [clickedSeeMore, setClickedSeeMore] = useState(false);
  const { topGenres } = useTopGenresStore();

  useEffect(() => {
    console.log('New top genres:', topGenres)
  }, [topGenres])

  return (
    topGenres.length === 0
      ? <Loader />
      :
      <div className="px-7 py-10 md:px-12 lg:px-28 xl:px-32">
        <h1 className="from-primary w-fit bg-gradient-to-r to-[#819EA7] bg-clip-text pb-2 text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl">
          Genres
        </h1>
        <div className="grid-row grid gap-1.5 pb-4 pl-1 pt-10">
          {topGenres.slice(0, 10).map((genre) => (
            <div key={uuidv4()}>
              <div className="semibold">
                <h4>{genre.name}</h4>
              </div>
            </div>
          ))}
          {clickedSeeMore && (
            <div>
              {topGenres.slice(10).map((genre) => (
                <div key={uuidv4()}>
                  <div className="semibold">
                    <h4>{genre.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {!clickedSeeMore
          ? <span className="pointer text-primary py-3" onClick={() => setClickedSeeMore(true)}>
            See All
          </span>
          : <span className="pointer text-primary translate-y-1" onClick={() => setClickedSeeMore(false)}>
            See Less
          </span>
        }
      </div>
  )
};

export default GenresPage;
