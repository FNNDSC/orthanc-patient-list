import { expect, test } from "vitest";
import "@patternfly/react-core/dist/styles/base.css";
import { render } from "vitest-browser-preact";
import { STORAGE_KEY, ThemeSelect, themePreference } from "./ThemeSelect";

test("Can set dark theme", async () => {
	const screen = render(<ThemeSelect />);
	await screen.getByLabelText(/Theme selection/).click();
	await expect(screen.getByText("Always use dark theme")).toBeVisible();
	await screen.getByText("Always use dark theme").click();
	expect(themePreference.value).toBe("dark");
	expect([...document.documentElement.classList.values()]).contains(
		"pf-v6-theme-dark",
	);
	expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
});

test("Remembers dark theme preference", async () => {
	localStorage.setItem(STORAGE_KEY, "dark");
	render(<ThemeSelect />);
	expect([...document.documentElement.classList.values()]).contains(
		"pf-v6-theme-dark",
	);
});

test("Remembers light theme preference", async () => {
	localStorage.setItem(STORAGE_KEY, "light");
	render(<ThemeSelect />);
	expect([...document.documentElement.classList.values()]).not.contains(
		"pf-v6-theme-dark",
	);
});
