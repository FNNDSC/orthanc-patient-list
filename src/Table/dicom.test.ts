import { expect, test } from "vitest";
import { prettyDa } from "./dicom";

test.each([
	["20200101", "2020 Jan 01"],
	["19991230", "1999 Dec 30"],
	["invalid", "invalid"],
	["3290", "3290"],
])('prettyDa("%s") -> "%s"', (dicomDa, expected) => {
	expect(prettyDa(dicomDa)).toBe(expected);
});
