"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { FC } from "react";
import type { Book } from "@/app/interfaces";

import { useTopRatedBooksStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";

const TopBooksLastYear: FC = () => {
  // Currently active books in the carousel
  const { topRatedBooks: allBooks } = useTopRatedBooksStore();
  const [activeBooks, setActiveBooks] = useState<Book[]>([] as Book[]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);

  const router = useRouter();

  /**
   * Handle click on the left button on the carousel.
   */
  const goLeft = () => {
    if (startIndex === 0) {
      return;
    }

    const newStartIndex = startIndex - 1;
    const newEndIndex = endIndex - 1;

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
    setActiveBooks(allBooks.slice(newStartIndex, newEndIndex));
  };

  /**
   * Handle click on the right button on the carousel.
   */
  const goRight = () => {
    const newStartIndex = startIndex + 1;
    const newEndIndex = endIndex + 1;

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
    setActiveBooks(allBooks.slice(newStartIndex, newEndIndex));
  };

  useEffect(() => {
    if (typeof (document) === "undefined") {
      return;
    }

    // For checking how many elements in grid to render
    const bodyElement = document.getElementsByTagName("body")[0];
    const screenWidth = bodyElement.offsetWidth;
    // Books Grid will contain elements depending of its width
    const elementsInBooksGrid =
      screenWidth < 640
        ? 2
        : screenWidth < 768
          ? 4
          : screenWidth < 1024
            ? 5
            : screenWidth < 1280
              ? 6
              : screenWidth < 1536
                ? 7
                : 9;
    const medianIndex = Math.floor(allBooks.length / 2);
    const startIndex = Math.floor(medianIndex - elementsInBooksGrid / 2);
    const endIndex = Math.floor(medianIndex + elementsInBooksGrid / 2);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setActiveBooks(allBooks.slice(startIndex, endIndex));
  }, [allBooks]);

  return (
    <section className="col-h bg-primary-foreground py-8">
      <h3 className="font-nsc pb-7 pt-4 text-6xl">Great Reads</h3>
      <h6 className="pb-7 text-xl">The highest rated books on LibraLink</h6>
      <div className="row-v mx-2 mb-10 md:mx-5">
        <div className="size-10">
          <ChevronLeft
            className={`pointer z-10 size-10 ${startIndex > 0 ? "block" : "hidden"}`}
            onClick={goLeft}
          />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9">
          {activeBooks.length > 0 &&
            activeBooks.map((book, index) => (
              <div
                className="top-book-card overlay-container relative"
                key={index}
              >
                <div className="flex" onClick={() => router.push(`/books/${book.id}`)}>
                  <div className="pointer relative">
                    <Image
                      className="md:left-[34px]"
                      src={book.image_url}
                      height={185}
                      width={127}
                      alt={book.title}
                      priority={true}
                    />
                  </div>
                  <div className="overlay pointer !w-[127px]">
                    <div className="overlay-content px-3 py-4">
                      <p className="text-three-dots-wrapper my-4 h-[160px] max-h-[185px] w-[110px] text-wrap">{book.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="z-10 size-10">
          <ChevronRight
            className={`pointer size-10 ${endIndex < allBooks.length ? "block" : "hidden"}`}
            onClick={goRight}
          />
        </div>
      </div>
    </section>
  );
};

export default TopBooksLastYear;
