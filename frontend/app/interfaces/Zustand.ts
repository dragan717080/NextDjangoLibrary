import type Book from "./Book";
import type Genre from "./Genre";
import type User from "./User";

export interface AuthStore {
  authToken: string | null;
  error: string | null;
  setAuthToken: (authToken: string | null) => void;
  setError: (error: string | null) => void;
}

export interface HeaderBurgerMenuStore {
  isHeaderBurgerMenuOpen: boolean;
  toggleIsHeaderBurgerMenuOpen: () => void;
}

export interface NavbarPortalStore {
  isNavbarPortalOpen: boolean;
  setIsNavbarPortalOpen: (value: boolean) => void;
}

export interface SearchInputStore {
  searchInput: string;
  setSearchInput: (value: string) => void;
}

export interface AllBooksStore {
  allBooks: Book[];
  setAllBooks: (value: Book[]) => void;
}

export interface BooksMatchingInputStore {
  booksMatchingInput: Book[];
  setBooksMatchingInput: (value: Book[]) => void;
}

export interface TopRatedBooksStore {
  topRatedBooks: Book[],
  setTopRatedBooks: (value: Book[]) => void;
}

export interface TopBooksForLastYearStore {
  topBooksForLastYear: Book[],
  setTopBooksForLastYear: (value: Book[]) => void;
}

export interface UsersStore {
  users: User[];
  setUsers: (value: User[]) => void;
}

export interface IsLoadingStore {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export interface TopGenresStore {
  topGenres: Partial<Genre>[];
  setTopGenres: (value: Partial<Genre>[]) => void;
}
