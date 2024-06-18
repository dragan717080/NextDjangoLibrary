"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useCustomRouter from "@/hooks/use-custom-router";

import clsx from "clsx";
import { Search as MagnifyingGlassIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import type { FC } from "react";
import type { Book, CustomSession } from "@/app/interfaces";

import {
  useAllBooksStore,
  useBooksMatchingInputStore,
  useIsLoadingStore,
  useSearchInputStore,
} from "@/app/store/zustandStore";
import { Navbar } from "@/components";
import useSearchPlaceholder from "@/hooks/use-search-placeholder";
import { logo, UserCircleIcon } from "@/public";

import HeaderSearchMenu from "./HeaderSearchMenu";

const Header: FC = () => {
  const session = useSession();
  const searchPlaceholder = useSearchPlaceholder();
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { allBooks } = useAllBooksStore();
  const { setBooksMatchingInput } = useBooksMatchingInputStore();
  const { isLoading } = useIsLoadingStore();

  const searchRef = useRef<HTMLInputElement | null>(null);
  const router = useCustomRouter();
  const user = (session.data as CustomSession)?.session?.user;
  const avatar = user?.avatar_url
    ? user?.avatar_url
    : user?.image
      ? user?.image
      : UserCircleIcon;

  const setBooksThatMatch = () => {
    const inputLimit: number = 10;

    const input = searchRef.current!.value;

    if (!input) {
      setBooksMatchingInput([]);
      return;
    }

    const booksThatMatch = allBooks.reduce((result, book) => {
      if (result.length >= inputLimit) {
        return result;
      }

      if (book.title.toLowerCase().includes(input!.toLowerCase())) {
        result.push(book);
      }

      return result;
    }, [] as Book[]);

    setBooksMatchingInput(booksThatMatch);
  };

  const handleInputChange = () => {
    setBooksThatMatch();
    setSearchInput(searchRef.current!.value);
  };

  // When the Enter key is in input or search icon is clicked, go to search page
  const redirectToSearchPage = () => {
    if (!searchRef.current!.value) {
      return;
    }

    router.push(`/search?input=${searchRef.current!.value}`)
  }

  return (
    <header
      className={clsx(
        `sticky top-0 z-40 bg-black px-4 py-3 text-zinc-200 shadow-md shadow-gray-400`,
        isLoading && "hidden"
      )}
    >
      <div className="row-v justify-around">
        <div
          className="row-v pointer 2xl:max-w-auto relative h-12 w-60 max-w-36 md:min-w-32"
          onClick={() => router.push("/")}
        >
          <Image
            fill
            src={logo}
            className="object-contain object-left"
            alt="logo"
            sizes="100vw"
          />
        </div>
        <Navbar />
        <div className="row-v xs:py-1 xs:border-2 xs:mx-2 min-w-[30%] rounded-full border-gray-300 pb-2 pt-2.5 md:min-w-fit md:shadow-sm lg:mx-6 xl:min-w-[17rem] 2xl:min-w-80">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onKeyDown={(e) => e.key === 'Enter' && redirectToSearchPage()}
            className="ml-1 grow border-none bg-transparent pl-4 text-sm outline-none placeholder:text-gray-300"
            onChange={handleInputChange}
            ref={searchRef}
            value={searchInput}
          />
          <MagnifyingGlassIcon
            onClick={redirectToSearchPage}
            className="bg-primary pointer xs:inline-flex xs:mx-2 mr-2 hidden size-8 rounded-full p-2 text-white"
          />
        </div>
        <div className="row-v semibold 2xl:text-md mx-0 ml-16 space-x-4 pr-2 text-sm text-gray-600 sm:ml-0 md:ml-3 lg:ml-10 2xl:mx-2">
          {session.status === "authenticated" ? (
            <div className="inline-flex items-center">
              <div className="relative mr-2 hidden size-7 md:block">
                <Image
                  src={avatar}
                  height={28}
                  width={28}
                  className="absolute size-full rounded-full"
                  alt="User Icon"
                />
              </div>
              <div className="text-three-dots-wrapper pointer hidden max-w-36 text-ellipsis text-red-500 md:block md:pr-1 2xl:pr-9">
                {(session.data as CustomSession).session?.user?.name}
              </div>
              <button
                className="text-cornflowerblue hover:text-primary ml-3"
                onClick={async () => await signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hover:text-primary pr-2 text-zinc-50 md:pl-3 md:pr-16 lg:pl-6 2xl:pr-4">
              <div className="pointer" onClick={() => router.push("/auth")}>
                Login
              </div>
            </div>
          )}
        </div>
      </div>
      {searchInput && <HeaderSearchMenu />}
    </header>
  );
};

export default Header;
