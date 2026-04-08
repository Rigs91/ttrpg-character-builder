import type { HTMLAttributes } from "react";

import { cx } from "../utils.js";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ children, className, tone = "neutral", ...rest }: BadgeProps) {
  return (
    <span className={cx("forge-badge", `forge-badge--${tone}`, className)} {...rest}>
      {children}
    </span>
  );
}
