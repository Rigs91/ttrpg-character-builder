import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../utils.js";

export type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...rest
}: SectionHeadingProps) {
  return (
    <div className={cx("forge-section-heading", className)} {...rest}>
      <div className="forge-section-heading__copy">
        {eyebrow ? <p className="forge-section-heading__eyebrow">{eyebrow}</p> : null}
        <h2 className="forge-section-heading__title">{title}</h2>
        {description ? <p className="forge-section-heading__description">{description}</p> : null}
      </div>
      {actions ? <div className="forge-section-heading__actions">{actions}</div> : null}
    </div>
  );
}
