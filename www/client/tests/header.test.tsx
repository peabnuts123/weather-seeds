import { h } from "preact";
import { render } from '@testing-library/preact'

import Header from "@app/components/header";

describe("Header component", () => {
  it("Renders consistently", () => {
    const { baseElement } = render(<Header />);
    expect(baseElement).toMatchSnapshot();
  });

  it("Header renders 3 nav items", () => {
    // Setup
    const { container } = render(<Header />);

    // Test
    const links = container.querySelectorAll('a');

    // Assert
    expect(links.length).toBe(3);
  });
});
