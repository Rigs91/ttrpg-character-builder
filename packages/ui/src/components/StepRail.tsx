import type { ReactNode } from "react";

import { Button } from "./Button.js";
import { cx } from "../utils.js";

export type StepRailStep = {
  id: string;
  label: string;
  description?: string;
  status?: "complete" | "current" | "upcoming" | "blocked";
};

export type StepRailProps = {
  steps: StepRailStep[];
  activeStepId?: string;
  onStepSelect?: (stepId: string) => void;
  continueLabel?: ReactNode;
  onContinue?: () => void;
  helperText?: ReactNode;
  className?: string;
};

function stepStatus(step: StepRailStep, activeStepId?: string) {
  if (step.status) {
    return step.status;
  }
  return step.id === activeStepId ? "current" : "upcoming";
}

export function StepRail({
  steps,
  activeStepId,
  onStepSelect,
  continueLabel = "Continue",
  onContinue,
  helperText,
  className
}: StepRailProps) {
  return (
    <aside className={cx("forge-step-rail", className)}>
      <div className="forge-step-rail__list">
        {steps.map((step, index) => {
          const status = stepStatus(step, activeStepId);
          const interactive = Boolean(onStepSelect);
          const Tag = interactive ? "button" : "div";

          return (
            <Tag
              key={step.id}
              className={cx("forge-step-rail__step", `forge-step-rail__step--${status}`)}
              {...(interactive
                ? {
                    type: "button" as const,
                    onClick: () => onStepSelect?.(step.id)
                  }
                : {})}
            >
              <span className="forge-step-rail__index">{index + 1}</span>
              <span className="forge-step-rail__content">
                <strong className="forge-step-rail__label">{step.label}</strong>
                {step.description ? <span className="forge-step-rail__description">{step.description}</span> : null}
              </span>
            </Tag>
          );
        })}
      </div>
      {helperText ? <p className="forge-step-rail__helper">{helperText}</p> : null}
      {onContinue ? (
        <Button tone="primary" stretch onClick={onContinue}>
          {continueLabel}
        </Button>
      ) : null}
    </aside>
  );
}
