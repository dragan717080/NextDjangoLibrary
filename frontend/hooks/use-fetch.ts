import { useCallback, useEffect, useState } from "react";

import {
  useAllBooksStore,
  useIsLoadingStore,
  useTopBooksForLastYearStore,
  useTopGenresStore,
  useTopRatedBooksStore,
  useUsersStore,
} from "@/app/store/zustandStore";
import type { Book, CustomSession, Genre, User } from "@/app/interfaces";
import { useSession } from "next-auth/react";

const useFetch = () => {
  const [error, setError] = useState<string | null>(null);
  const { setTopRatedBooks } = useTopRatedBooksStore();
  const { setTopBooksForLastYear } = useTopBooksForLastYearStore();
  const { setTopGenres } = useTopGenresStore();
  const { setAllBooks } = useAllBooksStore();
  const { setUsers } = useUsersStore();

  const { setIsLoading } = useIsLoadingStore();

  const session = useSession();

  const fetchTopRatedBooks = useCallback(async () => {
    try {
      const topRatedBooksUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/books?sort_by=-rating`;
      const response = await fetch(topRatedBooksUrl);

      if (!response.ok) {
        throw new Error(
          "Network response for fetch top rated books was not ok"
        );
      }

      const data = await response.json() as Book[];
      setTopRatedBooks(data);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    }
  }, [setTopRatedBooks]);

  const fetchTopBooksLastYear = useCallback(async () => {
    try {
      const topBooksForLastYearUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/books?first_published=2023&sort_by=-rating`;
      const response = await fetch(topBooksForLastYearUrl);

      if (!response.ok) {
        throw new Error(
          "Network response for fetch top books last year was not ok"
        );
      }

      const data = await response.json() as Book[];
      setTopBooksForLastYear(data);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    }
  }, [setTopBooksForLastYear]);

  const fetchTopGenres = useCallback(async () => {
    try {
      const topGenresUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/genres`;
      const response = await fetch(topGenresUrl);

      if (!response.ok) {
        throw new Error("Network response for fetch top genres was not ok");
      }

      const data = await response.json() as Genre[];
      setTopGenres(data);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    }
  }, [setTopGenres]);

  const fetchAllBooks = useCallback(async () => {
    try {
      const allBooksUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/books`;
      const response = await fetch(allBooksUrl);

      if (!response.ok) {
        throw new Error("Network response for fetch all books was not ok");
      }

      const data = await response.json() as Book[];
      setAllBooks(data);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    }
  }, [setAllBooks]);

  const fetchUsers = useCallback(async () => {
    try {
      const usersUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;
      const response = await fetch(usersUrl);

      if (!response.ok) {
        throw new Error("Network response for fetch users was not ok");
      }

      const data = await response.json() as User[];
      setUsers(data);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    }
  }, [setUsers]);

  /**
   * Calls the 'users' endpoint on backend to get avatar_url for signed in user and update for session.
   * 
   * This function is not important so doesn't have to be awaited.
   */
  const getAvatarForUser = useCallback(async () => {
    const sessionUser = (session.data as CustomSession).session?.user
    const username = sessionUser?.name

    const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?username=${username}`;
    const response = await fetch(userUrl);

    const userData = await response.json() as User[];

    if (!userData.length || !sessionUser) {
      return;
    }

    sessionUser.avatar_url = userData[0].avatar_url;

  }, [session.data])

  /**
   * Don't have to await setting avatar since it's not very important.
   */
  useEffect(() => {
    const sessionUser = (session.data as CustomSession)?.session?.user
    if (!sessionUser || session.status !== 'authenticated' || Object.keys(sessionUser).includes('avatar_url')) {
      return;
    }

    getAvatarForUser();
  }, [session.data, session.status, getAvatarForUser])

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          fetchAllBooks(),
          fetchTopRatedBooks(),
          fetchTopBooksLastYear(),
          fetchTopGenres(),
          fetchUsers(),
        ]);
        // const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      } catch (error) {
        // Error handling is already managed in each function
      }
      setIsLoading(false);
    })();
  }, [
    fetchTopGenres,
    fetchTopRatedBooks,
    fetchTopBooksLastYear,
    fetchUsers,
    fetchAllBooks,
    setIsLoading,
  ]);

  if (error) {
    console.log('Error fetching data:', error)
  }

  return { error };
};

export default useFetch;
