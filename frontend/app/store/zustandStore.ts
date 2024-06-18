import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AllBooksStore,
  AuthStore,
  BooksMatchingInputStore,
  HeaderBurgerMenuStore,
  IsLoadingStore,
  NavbarPortalStore,
  SearchInputStore,
  UsersStore,
  TopBooksForLastYearStore,
  TopGenresStore,
  TopRatedBooksStore,
} from "@/app/interfaces/Zustand";

import type { Book, Genre, User } from "@/app/interfaces";

export const useHeaderBurgerMenuStore = create<HeaderBurgerMenuStore>(
  (set) => ({
    isHeaderBurgerMenuOpen: false,
    toggleIsHeaderBurgerMenuOpen: () =>
      set((state) => ({
        isHeaderBurgerMenuOpen: !state.isHeaderBurgerMenuOpen,
      })),
  })
);

export const useNavbarPortalStore = create<NavbarPortalStore>((set) => ({
  isNavbarPortalOpen: false,
  setIsNavbarPortalOpen: (value) =>
    set((_) => ({ isNavbarPortalOpen: value })),
}));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _) => ({
      authToken: null,
      error: null,
      setAuthToken: (authToken) => set({ authToken, error: null }),
      setError: (error) => set({ error }),
    }),
    {
      name: "zustand-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useSearchInputStore = create<SearchInputStore>((set) => ({
  searchInput: "",
  setSearchInput: (value) => set((_) => ({ searchInput: value })),
}));

export const useTopGenresStore = create<TopGenresStore>((set) => ({
  topGenres: [] as Partial<Genre>[],
  setTopGenres: (value: Partial<Genre>[]) => set((_: TopGenresStore) => ({ topGenres: value })),
}));

export const useAllBooksStore = create<AllBooksStore>((set) => ({
  allBooks: [] as Book[],
  setAllBooks: (value: Book[]) => set((_: AllBooksStore) => ({ allBooks: value })),
}));

export const useTopRatedBooksStore = create<TopRatedBooksStore>((set) => ({
  topRatedBooks: [] as Book[],
  setTopRatedBooks: (value: Book[]) => set((_: TopRatedBooksStore) => ({ topRatedBooks: value })),
}));

export const useTopBooksForLastYearStore = create<TopBooksForLastYearStore>((set) => ({
  topBooksForLastYear: [] as Book[],
  setTopBooksForLastYear: (value: Book[]) =>
    set((_: TopBooksForLastYearStore) => ({ topBooksForLastYear: value })),
}));

export const useBooksMatchingInputStore = create<BooksMatchingInputStore>(
  (set) => ({
    booksMatchingInput: [] as Book[],
    setBooksMatchingInput: (value: Book[]) =>
      set((_: BooksMatchingInputStore) => ({ booksMatchingInput: value })),
  })
);

export const useUsersStore = create<UsersStore>((set) => ({
  users: [] as User[],
  setUsers: (value: User[]) => set((_: UsersStore) => ({ users: value })),
}));

export const useIsLoadingStore = create<IsLoadingStore>((set) => ({
  isLoading: true,
  setIsLoading: (value: boolean) => set((_: IsLoadingStore) => ({ isLoading: value })),
}));
