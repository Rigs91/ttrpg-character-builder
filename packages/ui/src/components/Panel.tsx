import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cx } from "../utils.js";

type PanelTone = "default" | "elevated" | "muted";
type PanelPadding = "sm" | "md" | "lg";

export type PanelProps<T extends ElementType = "section"> = {
  as?: T;
  tone?: PanelTone;
  padding?: PanelPadding;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export function Panel<T extends ElementType = "section">({
  as,
  tone = "default",
  padding = "md",
  header,
  footer,
  children,
  className,
  ...rest
}: PanelProps<T>) {
  const Tag = (as ?? "section") as ElementType;

  return (
    <Tag className={cx("forge-panel", `forge-panel--${tone}`, `forge-panel--${padding}`, className)} {...rest}>
      {header ? <div className="forge-panel__header">{header}</div> : null}
      <div className="forge-panel__body">{children}</div>
      {footer ? <div className="forge-panel__footer">{footer}</div> : null}
    </Tag>
  );
}
