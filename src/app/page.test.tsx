import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("home page", () => {
  it("identifies the product and its construction status", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Biosaúde Analytics 2.0" })).toBeVisible();
    expect(screen.getByText("A plataforma está em construção.")).toBeVisible();
  });
});
