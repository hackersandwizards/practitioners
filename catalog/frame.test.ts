import { assert, expect, test, vi } from "vitest";
import { runInNewContext } from "node:vm";

const frame = await Bun.file(new URL("./stories/Frame.astro", import.meta.url)).text();
const script = frame.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script, "Frame.astro must provide a hover preview script");
const previewScript = new Bun.Transpiler({ loader: "ts" }).transformSync(script);

class HoverRule {
  style = { cssText: "color: red" };

  constructor(readonly selectorText: string) {}
}

const hoverScriptGlobals = {
  document: { querySelectorAll: () => [] },
  DOMException,
  CSSStyleRule: HoverRule,
};

test("a mirrored hover rule goes immediately after its original", () => {
  const rule = new HoverRule("a:hover");
  const insertRule = vi.fn();
  runInNewContext(`${previewScript}\nmirrorHoverRule(rule, sheet, 2);`, {
    ...hoverScriptGlobals,
    rule,
    sheet: { insertRule },
  });
  expect(insertRule).toHaveBeenCalledExactlyOnceWith('a[data-force="hover"]{color: red}', 3);
});

test("a stylesheet mirrors hover rules from last to first to preserve insertion indices", () => {
  const insertRule = vi.fn();
  const sheet = { cssRules: [new HoverRule("a:hover"), new HoverRule("button:hover")], insertRule };
  runInNewContext(`${previewScript}\nmirrorHoverSheet(sheet);`, { ...hoverScriptGlobals, sheet });
  expect(insertRule.mock.calls).toEqual([
    ['button[data-force="hover"]{color: red}', 2],
    ['a[data-force="hover"]{color: red}', 1],
  ]);
});

function runHoverPreview(
  operation: "cssRules" | "insertRule",
  error: DOMException,
  markHover = vi.fn(),
) {
  const fail = () => {
    throw error;
  };
  const rules = [new HoverRule("a::part(tab):hover")];
  const sheet = Object.defineProperty({ cssRules: rules, insertRule: vi.fn() }, operation, {
    get: operation === "cssRules" ? fail : () => fail,
  });
  const insertRule = vi.fn();
  const box = {
    querySelector: () => ({ setAttribute: markHover, parentElement: undefined }),
  };
  const document = {
    querySelectorAll: (selector: string) => (selector.includes('"hover"') ? [box] : []),
    styleSheets: [sheet, { cssRules: [new HoverRule("a:hover")], insertRule }],
  };
  runInNewContext(previewScript, { document, DOMException, CSSStyleRule: HoverRule });
  return insertRule;
}

test.each([
  ["cssRules", "SecurityError"],
  ["insertRule", "SyntaxError"],
] as const)("hover preview continues after %s throws %s", (operation, name) => {
  const insertRule = runHoverPreview(operation, new DOMException("CSS preview refused", name));
  expect(insertRule).toHaveBeenCalledExactlyOnceWith('a[data-force="hover"]{color: red}', 1);
});

test.each([
  ["cssRules", "SyntaxError"],
  ["insertRule", "InvalidStateError"],
] as const)("hover preview propagates %s throwing %s", (operation, name) => {
  const error = new DOMException(`${operation} failed unexpectedly`, name);
  expect(() => runHoverPreview(operation, error)).toThrow(error);
});

test("hover preview marks the link before an unexpected stylesheet error escapes", () => {
  const markHover = vi.fn();
  expect(() =>
    runHoverPreview(
      "cssRules",
      new DOMException("stylesheet failed", "InvalidStateError"),
      markHover,
    ),
  ).toThrow("stylesheet failed");
  expect(markHover).toHaveBeenCalledExactlyOnceWith("data-force", "hover");
});
