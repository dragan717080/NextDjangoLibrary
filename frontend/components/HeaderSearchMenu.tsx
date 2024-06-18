import type { FC, MouseEvent } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import type { Book } from "@/app/interfaces";
import {
  useBooksMatchingInputStore,
  useSearchInputStore,
} from "@/app/store/zustandStore";
import useCustomRouter from "@/hooks/use-custom-router";

const HeaderSearchMenu: FC = () => {
  const { setSearchInput } = useSearchInputStore();

  const { booksMatchingInput, setBooksMatchingInput } =
    useBooksMatchingInputStore();

  const router = useCustomRouter();

  const handleSelectBook = (e: MouseEvent<HTMLElement>, book: Book) => {
    setBooksMatchingInput([] as Book[]);
    setSearchInput("");
    router.push(`/books/${book.id}`)
  };

  return (
    <div className={`${!booksMatchingInput.length ? "hidden" : ""} mt-4`}>
      <div className="row mx-auto w-fit space-x-4 space-y-5 md:space-y-0">
        {booksMatchingInput.map((book) => (
          <div
            className="md:row pointer m-0 mx-auto flex h-[105px] flex-col space-y-4 py-2 pl-2 text-zinc-300 transition duration-200 ease-out hover:scale-105 hover:bg-gray-200 hover:!text-black active:scale-95 md:space-x-0 md:space-y-1.5"
            onClick={(e) => handleSelectBook(e, book)}
            key={uuidv4()}
          >
            <div className="relative mx-auto h-16 w-24">
              <Image
                fill
                alt={`${book.title} Image`}
                src={book.image_url ?? ""}
                className="rounded-xl"
                sizes="6rem"
              />
            </div>
            <div className="ml-0 w-28 space-y-0 overflow-hidden text-ellipsis text-center md:w-40 md:whitespace-nowrap">
              {book.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSearchMenu;
