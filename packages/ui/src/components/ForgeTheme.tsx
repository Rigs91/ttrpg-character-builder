import type { HTMLAttributes, PropsWithChildren } from "react";

import { cx } from "../utils.js";

export type ForgeThemeProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    density?: "comfortable" | "compact";
  }
>;

export function ForgeTheme({
  children,
  className,
  density = "comfortable",
  ...rest
}: ForgeThemeProps) {
  return (
    <div
      className={cx("forge-theme", density === "compact" && "forge-theme--compact", className)}
      data-density={density}
      {...rest}
    >
      {children}
    </div>
  );
}
