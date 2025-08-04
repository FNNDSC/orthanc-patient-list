import { test, expect } from "bun:test";
import { h } from "preact";
import "preact/compat";
import { screen, render } from "@testing-library/preact";
// import { ThemeSelect } from "./ThemeSelect";
import { Title } from "@patternfly/react-core";

test("Can test Patternfly tuff", () => {
	render(<Title headingLevel="h1">Hello, world</Title>);
	// const myComponent = screen.getByTestId("my-component");
	// expect(myComponent).toBeInTheDocument();
});
test("Can test other stuff", () => {
	render(<button>hello, world</button>);
	// const myComponent = screen.getByTestId("my-component");
	// expect(myComponent).toBeInTheDocument();
});
