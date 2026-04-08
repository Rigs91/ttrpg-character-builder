import { cx } from "../utils.js";

export type StatusStripItem = {
  id: string;
  label: string;
  state?: "idle" | "ready" | "warning" | "danger";
  value?: string;
  description?: string;
};

export type StatusStripProps = {
  items: StatusStripItem[];
  className?: string;
};

export function StatusStrip({ items, className }: StatusStripProps) {
  return (
    <div className={cx("forge-status-strip", className)}>
      {items.map((item) => (
        <div key={item.id} className={cx("forge-status-strip__item", item.state && `forge-status-strip__item--${item.state}`)}>
          <span className="forge-status-strip__label">{item.label}</span>
          {item.value ? <strong className="forge-status-strip__value">{item.value}</strong> : null}
          {item.description ? <span className="forge-status-strip__description">{item.description}</span> : null}
        </div>
      ))}
    </div>
  );
}
