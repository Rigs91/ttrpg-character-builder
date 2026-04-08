import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../utils.js";

type CardTone = "default" | "highlight" | "subtle";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  title?: ReactNode;
  eyebrow?: ReactNode;
  detail?: ReactNode;
  footer?: ReactNode;
};

export function Card({
  tone = "default",
  title,
  eyebrow,
  detail,
  footer,
  children,
  className,
  ...rest
}: CardProps) {
  const hasHeader = eyebrow || title || detail;

  return (
    <article className={cx("forge-card", `forge-card--${tone}`, className)} {...rest}>
      {hasHeader ? (
        <header className="forge-card__header">
          {eyebrow ? <div className="forge-card__eyebrow">{eyebrow}</div> : null}
          {title ? <h3 className="forge-card__title">{title}</h3> : null}
          {detail ? <p className="forge-card__detail">{detail}</p> : null}
        </header>
      ) : null}
      <div className="forge-card__body">{children}</div>
      {footer ? <footer className="forge-card__footer">{footer}</footer> : null}
    </article>
  );
}
