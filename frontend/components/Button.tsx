"use client";

import clsx from "clsx";

import type { FC } from "react";
import type ButtonProps from "@/app/interfaces/props/ButtonProps";

const Button: FC<ButtonProps> = (props) => {
  const { type, isFullWidth, children, onClick, secondary, danger, disabled } =
    props;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
        row-h
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold 
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        `,
        disabled && "opacity-50 cursor-default",
        isFullWidth && "w-full",
        secondary ? "text-gray-900" : "text-white",
        danger &&
          "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
