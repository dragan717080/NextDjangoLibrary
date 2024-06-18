import type { LucideIcon } from "lucide-react";
import type { FC } from "react";

export default interface AuthSocialButtonProps {
  icon: LucideIcon | FC;
  onClick: () => void;
}
