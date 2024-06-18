"use client";

import type { ReactNode } from "react";
import { Footer, Header, Loader } from "@/components";
import { useIsLoadingStore } from "./store/zustandStore";
import useFetch from "@/hooks/use-fetch";

const Main = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useIsLoadingStore();
  useFetch();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {isLoading
        ? <Loader />
        : <>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </>
      }
    </div>
  )
}

export default Main;
