'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components';
import type { SearchResult } from '@/app/interfaces';
import { v4 as uuidv4 } from "uuid";

const Search = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState<SearchResult>({} as SearchResult)

  const router = useRouter()

  // Get the input value from header search params
  const searchParams = useSearchParams()
  const input = searchParams.get('input')

  useEffect(() => {
    (async () => {
      const searchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search`
      const response = await fetch(
        searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input })
      }

      )
      if (!response.ok) {
        console.log('There was an error fetching search');
        return;
      }

      const data = await response.json() as SearchResult;
      setSearchResult(data);
      setIsLoading(false);
    })()
  }, [input, setIsLoading]);

  return
  {
    isLoading
      ? <Loader />
      : <div className='lg:px-22 px-7 py-12 text-black sm:px-10 md:px-14 2xl:px-28'>
        <h1 className='bold mb-12 text-center text-5xl tracking-tight md:text-left'>Search results for {input}</h1>
        {searchResult?.books?.length && (
          <>
            <h3 className='bold mb-7 text-center text-3xl md:text-left'>Books</h3>
            {searchResult.books.map((book) => (
              <div
                className="pointer col-v min-h-[200] w-32 py-2 pl-2 transition duration-200 ease-out hover:scale-105 hover:bg-gray-200 active:scale-95 md:w-56"
                onClick={(_) => router.push(`/books/${book.id}`)}
                key={uuidv4()}
              >
                <div className="h-22 relative mx-auto w-16 max-w-fit">
                  <Image
                    alt={`${book.title} Image`}
                    src={book.image_url ?? ""}
                    height={140}
                    width={140}
                    className='object-contain'
                  />
                </div>
                <div className="semibold mb-1.5 ml-0 mt-2.5 overflow-hidden text-ellipsis text-center md:whitespace-nowrap">
                  {book.title}
                </div>
                <div className="ml-0 overflow-hidden text-ellipsis text-center md:whitespace-nowrap">
                  {book.author}
                </div>
              </div>
            ))}
          </>
        )}
        {searchResult?.users?.length > 0 && (
          <>
            <h3 className='bold mb-7 mt-12 text-center text-3xl md:text-left'>Users</h3>
            {searchResult.users.map((user) => (
              <div
                className="pointer col-v w-32 py-6 pl-2 transition duration-200 ease-out hover:scale-105 hover:bg-gray-200 active:scale-95 md:w-56"
                onClick={(_) => router.push(`/users/${user.username}`)}
                key={uuidv4()}
              >
                <div className="relative mx-auto size-16 max-w-fit">
                  <Image
                    alt={`${user.username.slice(0, 15)} Image`}
                    src={user.avatar_url ?? "/user.png"}
                    height={140}
                    width={140}
                    className='h-full object-cover'
                  />
                </div>
                <div className="semibold mb-1.5 ml-0 mt-2.5 overflow-hidden text-ellipsis text-center md:whitespace-nowrap">
                  {user.username}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
  }
}

export default Search;
