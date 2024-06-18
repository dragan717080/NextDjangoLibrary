import type { ReactNode } from "react";
import AuthContext from "@/app/context/AuthContext";
import ToasterContext from "@/app/context/ToasterContext";
import { Footer, Header, Providers, TailwindIndicator } from "@/components";
import { poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Main from "./main";

import "@/app/globals.css";
import "@/app/animations.css";

export const metadata = {
  title: "LibraLink",
  description:
    "Library app made with Next.js, TypeScript, Tailwind, Zustand, ESLint, Prettier, NextAuth and Husky",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          poppins.variable,
          "font-poppins min-h-screen scroll-smooth antialiased"
        )}
      >
        <Providers>
          <div>
            <section className="col-h min-w-full justify-between">
              <div className="relative">
                <div id="navbar-portal-root" className="mt-[-6px]"></div>
                <div id="__next"></div>
              </div>
            </section>
          </div>
          <AuthContext>
            <ToasterContext />
            <Main>{children}</Main>
          </AuthContext>
        </Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
};

export default RootLayout;
