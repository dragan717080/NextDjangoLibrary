import React from "react";
import type { CustomButtonProps } from "@/app/interfaces";

const CustomButton = ({ title, onClick, isLoading }: CustomButtonProps) => {
  return (
    <button
      /* onClick={onClick} */
      disabled={isLoading}
      className={`bg-secondary row min-h-[62px] rounded-2xl px-6 py-3 text-2xl hover:scale-105 active:scale-95
        ${isLoading ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
