import type { FC } from "react";

import { FriendsToolbar, GenresToolbar, NewsToolbar } from "./navbar-toolbars";
import NavbarMenuItem from "./NavbarMenuItem";

const Navbar: FC = () => {
  const toolbarComponents = [GenresToolbar, FriendsToolbar, NewsToolbar];

  return (
    <nav className="2xl:text-md h-30 hidden px-14 text-sm md:flex md:pl-1 md:pr-0 lg:px-14">
      {toolbarComponents.map((toolbarComponent, index: number) => (
        <NavbarMenuItem
          ComponentToRender={toolbarComponent}
          index={index}
          key={index}
        />
      ))}
    </nav>
  );
};

export default Navbar;
