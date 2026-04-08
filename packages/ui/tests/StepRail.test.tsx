import { fireEvent, render, screen } from "@testing-library/react";

import { StepRail } from "../src/components/StepRail.js";

describe("StepRail", () => {
  it("renders steps and continue affordance", () => {
    const handleStepSelect = vi.fn();
    const handleContinue = vi.fn();

    render(
      <StepRail
        activeStepId="abilities"
        continueLabel="Continue build"
        helperText="Non-blocking checks stay visible while you keep moving."
        onContinue={handleContinue}
        onStepSelect={handleStepSelect}
        steps={[
          { id: "setup", label: "Setup", status: "complete" },
          { id: "abilities", label: "Abilities", description: "Assign and validate scores." },
          { id: "spells", label: "Spells", status: "upcoming" }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /abilities/i }));
    fireEvent.click(screen.getByRole("button", { name: "Continue build" }));

    expect(handleStepSelect).toHaveBeenCalledWith("abilities");
    expect(handleContinue).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/non-blocking checks/i)).toBeInTheDocument();
  });
});
