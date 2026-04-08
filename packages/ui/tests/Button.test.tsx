import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "../src/components/Button.js";

describe("Button", () => {
  it("renders children and clicks", () => {
    const handleClick = vi.fn();

    render(
      <Button tone="primary" onClick={handleClick}>
        Create session
      </Button>
    );

    const button = screen.getByRole("button", { name: "Create session" });
    fireEvent.click(button);

    expect(button).toHaveClass("forge-button--primary");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
