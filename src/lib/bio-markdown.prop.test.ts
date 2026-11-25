import { fc, test, unicodeString } from "@hackersandwizards/scaffolding/property";
import { expect } from "vitest";
import { markdownOutside } from "../../scripts/export";
import { paragraphs, split } from "./bio-text";

const emptyHeader = { text: "---\n---\n", data: {} };
const header = fc.oneof(
  fc.constant(emptyHeader),
  unicodeString.map((name) => ({
    text: `---\nname: ${JSON.stringify(name)}\n---\n`,
    data: { name },
  })),
);

test.prop([header, unicodeString, fc.constantFrom("\n", "\r\n")], {
  examples: [
    [emptyHeader, "", "\n"],
    [
      { text: '---\nname: "constructor"\n---\n', data: { name: "constructor" } },
      "Écrit.\nBeitrag.",
      "\r\n",
    ],
    [
      { text: '---\nname: "__proto__"\n---\n', data: { name: "__proto__" } },
      "李".repeat(1024),
      "\n",
    ],
    [emptyHeader, "before\n---\nafter", "\n"],
  ],
})(
  "splits delimited YAML from the body and normalizes Windows newlines",
  ({ text, data }, body, newline) => {
    const normalized = body.replaceAll("\r\n", "\n");
    expect(split(`${text}${normalized}`.replaceAll("\n", newline))).toEqual({
      data,
      body: normalized,
    });
    expect(split(text.trimEnd().replaceAll("\n", newline))).toEqual({
      data,
      body: "",
    });
    expect(split(`Bio\n${normalized}`.replaceAll("\n", newline))).toEqual({
      data: {},
      body: `Bio\n${normalized}`,
    });
  },
);

const letters = fc.string({ unit: fc.constantFrom("a", "b", "é", "界"), maxLength: 1024 });

test.prop(
  [
    fc.array(
      fc.array(
        letters.map((value) => `x${value}`),
        { minLength: 1, maxLength: 5 },
      ),
    ),
    fc.constantFrom(" ", "\t", "\u2003", ""),
  ],
  {
    examples: [
      [[], " "],
      [[["É".repeat(1024), "界"], ["constructor"], ["toString", "__proto__"]], "\t"],
      [
        [
          ["un", "deux"],
          ["drei", "vier"],
        ],
        "",
      ],
    ],
  },
)("joins wrapped lines with a space and keeps paragraph breaks", (blocks, gap) => {
  const raw = blocks.map((lines) => lines.join(`${gap}\n${gap}`)).join(`\n${gap}\n`);
  const normalized = blocks.map((lines) => lines.join(" ")).join("\n\n");
  expect(paragraphs(`${gap}\n${raw}\n${gap}`)).toBe(normalized);
});

test.prop([letters], { examples: [["é".repeat(1024)]] })(
  "a YAML value ending in dashes does not close frontmatter",
  (value) => {
    expect(split(`---\nname: X${value}---\n---\nBio.`)).toEqual({
      data: { name: `X${value}---` },
      body: "Bio.",
    });
  },
);

test.prop([letters], { examples: [[""], ["é界".repeat(512)]] })(
  "reports original Markdown spans outside the website subset in order",
  (letters) => {
    const label = `x${letters}`;
    const supported = [
      "https://example.com/a",
      "www.example.com",
      "a@example.com",
      `[${label}](https://example.com/a)`,
      `[${label}](mailto:a@example.com)`,
    ];
    const unsupported = [
      "<https://example.com/a>",
      `[${label}](http://example.com)`,
      `*${label}*`,
      "&amp;",
      "\\*",
    ];
    expect(markdownOutside("")).toEqual([]);
    expect(markdownOutside(supported.join(" "))).toEqual([]);
    expect(markdownOutside(`# ${label}\n\n${unsupported.join("\n\n")}`)).toEqual([
      `# ${label}`,
      ...unsupported,
    ]);
  },
);
