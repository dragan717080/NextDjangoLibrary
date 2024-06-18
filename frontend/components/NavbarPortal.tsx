"use client";

import { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import type { FC } from "react";
import type { RenderProp } from "@/app/interfaces";

const NavbarPortal: FC<RenderProp> = ({ children }) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    ref.current = document?.getElementById("navbar-portal-root");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(
        <div className="z-50 rounded-lg bg-white text-red-50">{children}</div>,
        ref.current
      )
    : null;
};

export default NavbarPortal;
