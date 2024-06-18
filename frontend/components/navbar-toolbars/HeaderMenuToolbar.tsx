import { type FC } from "react";

interface HeaderMenuToolbarProps {
  isOpen: boolean;
}

const HeaderMenuToolbar: FC<HeaderMenuToolbarProps> = ({ isOpen }) => {
  return (
    <div
      className={`text-primary absolute left-[-8.125rem] z-40 rounded-lg bg-white px-7 py-4 transition-transform
      ${isOpen ? "top-12" : "translate-down-gradually"}`}
    >
      <ul className="gradient-title-alt">
        {["Genres", "Friends", "News"].map((item, index) => (
          <li key={index} className="gradient-title-alt">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderMenuToolbar;
