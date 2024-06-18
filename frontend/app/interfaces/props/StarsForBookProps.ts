import type { MouseEvent } from "react";

export default interface StarsForBookProps {
  rating: number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}
