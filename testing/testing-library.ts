import { afterEach, expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/preact";

expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
	cleanup();
});
