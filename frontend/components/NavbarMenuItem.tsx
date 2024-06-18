"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import type { ComponentType, FC } from "react";

import { useNavbarPortalStore } from "@/app/store/zustandStore";

import NavbarPortal from "./NavbarPortal";

interface NavbarMenuItemProps {
  ComponentToRender: ComponentType;
  index: number;
}

const NavbarMenuItem: FC<NavbarMenuItemProps> = ({ ComponentToRender }) => {
  const { isNavbarPortalOpen, setIsNavbarPortalOpen } = useNavbarPortalStore();

  // Local state to manage the portal for this specific toolbar
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const navbarMenuItemRef = useRef<HTMLDivElement | null>(null);

  const getNavbarPortalStyling = () => {
    if (!navbarMenuItemRef.current) return;
    const rect = navbarMenuItemRef.current?.getBoundingClientRect();
    return rect.left + window.scrollX;
  };

  const navbarPortalStyling = getNavbarPortalStyling();
  if (!ComponentToRender.displayName)
    ComponentToRender.displayName = "Add display name to this component";

  const content = (
    <div className="row-v hover:text-primary group space-x-0.5">
      <h2 className="semibold">
        {ComponentToRender.displayName.split("Toolbar")[0]}
      </h2>
    </div>
  );

  return (
    <div ref={navbarMenuItemRef} className="relative">
      <div
        className={`parent-container p-4 md:px-1.5 xl:px-4 ${ComponentToRender.displayName === "GenresToolbar" ? "pointer" : ""}`}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsNavbarPortalOpen(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsNavbarPortalOpen(false);
        }}
      >
        {ComponentToRender.displayName === "GenresToolbar" ? (
          <Link href="/genres">{content}</Link>
        ) : (
          <>{content}</>
        )}
        <NavbarPortal>
          {isHovered && isNavbarPortalOpen && (
            <div
              className="navbar-portal-content"
              style={{ left: `${navbarPortalStyling}px` }}
            >
              <ComponentToRender />
            </div>
          )}
        </NavbarPortal>
      </div>
    </div>
  );
};

export default NavbarMenuItem;
