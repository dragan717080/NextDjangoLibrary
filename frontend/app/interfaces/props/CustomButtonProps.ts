import type { MouseEvent } from "react";

export default interface CustomButtonProps {
  title: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
}
