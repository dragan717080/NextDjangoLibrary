"use client";

import React from "react";
import Link from "next/link";

import clsx from "clsx";
import { Github, HomeIcon } from "lucide-react";

import { useIsLoadingStore } from "@/app/store/zustandStore";

const Footer = () => {
  const { isLoading } = useIsLoadingStore();

  return (
    <footer className={clsx(`bg-black py-4 `, isLoading && "hidden")}>
      <div className="row-h space-x-4">
        <Link href="https://github.com/dragan717080">
          <Github className="text-primary pointer transition duration-500 hover:-mt-1" />
        </Link>
        <Link href="https://three-portfolio-seven.vercel.app/">
          <HomeIcon className="text-primary pointer transition duration-500 hover:-mt-1" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
