import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("GoVibeMix workspace", () => {
  it("renders the project and track controls", () => {
    render(<App />);
    expect(screen.getByDisplayValue("Midnight Session")).toBeInTheDocument();
    expect(screen.getAllByText("Drum Machine")).toHaveLength(2);
    expect(screen.getByLabelText("Arm Lead Vocal")).toHaveClass("active");
  });

  it("toggles transport playback", () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText("Play"));
    expect(screen.getByLabelText("Pause")).toBeInTheDocument();
  });
});

