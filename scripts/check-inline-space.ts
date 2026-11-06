// An Astro build (compressHTML) drops whitespace that holds a line break where text or an
// {expression} meets an inline element, so "for\n<a>" renders as "for<a>". Write {" "} instead.
import { Glob } from "bun";

const inline = "a|strong|em|b|i|code|span|kbd|abbr|time|small|mark|cite|q|s|u|del|ins|sup|sub";
const text = `[\\p{L}\\p{N},.;:!?)"'’”}](?<!\\{" "\\})`;
const patterns = [
  new RegExp(`${text}[ \\t]*\\n[ \\t]*<(${inline})[\\s>]`, "gu"),
  new RegExp(`</(${inline})>[ \\t]*\\n[ \\t]*[\\p{L}\\p{N}{]`, "gu"),
  new RegExp(`</(${inline})\\n[ \\t]*>[ \\t]*\\n[ \\t]*[\\p{L}\\p{N}{]`, "gu"),
];

let hits = 0;
for (const file of new Glob("src/**/*.astro").scanSync()) {
  const source = await Bun.file(file).text();
  for (const pattern of patterns)
    for (const match of source.matchAll(pattern)) {
      hits++;
      console.error(
        `${file}:${source.slice(0, match.index).split("\n").length}: line break next to <${match[1] ?? "…"}>, write {" "}`,
      );
    }
}
process.exit(hits ? 1 : 0);
