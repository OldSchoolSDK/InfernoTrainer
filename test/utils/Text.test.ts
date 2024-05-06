import { parseText } from "../../src/sdk/utils/Text";

describe("text tests", () => {
  describe("parseText tests", () => {
    test("handles untagged text", () => {
      expect(parseText("something something")).toEqual([{ text: "something something" }]);
    });

    test("handles simple tagged text", () => {
      expect(parseText("<col=ffffff>something something</col>")).toEqual([
        { text: "something something", color: "ffffff" },
      ]);
    });

    test("handles text that changes color", () => {
      expect(parseText("<col=ffffff>Give me your</col> <col=ff0000>something</col>")).toEqual([
        { text: "Give me your", color: "ffffff" },
        { text: " " },
        { text: "something", color: "ff0000" },
      ]);
    });

    test("handles unterminated tag", () => {
      expect(parseText("<col=ffffff>Give me your")).toEqual([
        { text: "Give me your", color: "ffffff" },
      ]);
    });
  });
});
