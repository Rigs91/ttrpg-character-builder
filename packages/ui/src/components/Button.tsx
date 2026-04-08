import type { ButtonHTMLAttributes } from "react";

import { cx } from "../utils.js";

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  stretch?: boolean;
};

export function Button({
  children,
  className,
  tone = "secondary",
  size = "md",
  stretch = false,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "forge-button",
        `forge-button--${tone}`,
        `forge-button--${size}`,
        stretch && "forge-button--stretch",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
