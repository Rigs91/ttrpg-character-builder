import type { ButtonHTMLAttributes } from "react";

import { cx } from "../utils.js";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  quiet?: boolean;
};

export function Chip({ active = false, quiet = false, className, children, type = "button", ...rest }: ChipProps) {
  return (
    <button
      type={type}
      className={cx("forge-chip", active && "forge-chip--active", quiet && "forge-chip--quiet", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
