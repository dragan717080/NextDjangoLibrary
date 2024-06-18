import React from "react";

import type { GenreCardProps } from "@/app/interfaces";

const genreCard = ({ genre }: GenreCardProps) => {
  const { book_count, description, name } = genre;

  return (
    <div className="card group relative h-48 w-full rounded-xl bg-zinc-700 shadow-md shadow-black outline-none before:absolute before:left-0 before:top-0 before:size-full before:rounded-xl before:opacity-0 before:transition-opacity before:duration-500 after:absolute after:left-0 after:top-0 after:size-full after:rounded-xl after:opacity-0 after:transition-opacity after:duration-500 hover:shadow-xl hover:shadow-black hover:before:opacity-100">
      <div className="absolute inset-px z-[2] flex flex-col gap-2.5 rounded-xl bg-[#141414] p-2.5">
        <div className="relative flex size-full flex-col overflow-hidden rounded-md p-4">
          <div className="mb-3.5">{name}</div>

          <h3 className="text-xl">
            <div className="flex size-full items-center after:absolute after:inset-0">
              {book_count} books
            </div>
          </h3>

          <p className="mt-auto text-sm text-gray-300 group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default genreCard;
