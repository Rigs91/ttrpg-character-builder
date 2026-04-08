import type { ReactNode } from "react";

import { cx } from "../utils.js";

export type WorkspaceShellProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  rail?: ReactNode;
  sidebar?: ReactNode;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function WorkspaceShell({
  eyebrow,
  title,
  subtitle,
  headerActions,
  rail,
  sidebar,
  status,
  children,
  className
}: WorkspaceShellProps) {
  return (
    <div className={cx("forge-shell", className)}>
      <header className="forge-shell__header">
        <div className="forge-shell__headline">
          {eyebrow ? <p className="forge-shell__eyebrow">{eyebrow}</p> : null}
          <h1 className="forge-shell__title">{title}</h1>
          {subtitle ? <p className="forge-shell__subtitle">{subtitle}</p> : null}
        </div>
        {headerActions ? <div className="forge-shell__actions">{headerActions}</div> : null}
      </header>
      {status ? <div className="forge-shell__status">{status}</div> : null}
      <div
        className={cx(
          "forge-shell__body",
          rail ? "forge-shell__body--with-rail" : undefined,
          sidebar ? "forge-shell__body--with-sidebar" : undefined
        )}
      >
        {rail ? <div className="forge-shell__rail">{rail}</div> : null}
        <main className="forge-shell__main">{children}</main>
        {sidebar ? <aside className="forge-shell__sidebar">{sidebar}</aside> : null}
      </div>
    </div>
  );
}
