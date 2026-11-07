// Astro's default compressHTML ('jsx') drops whitespace that holds a line break, so "for\n<a>"
// renders as "for<a>". Write {" "} instead. Not seen here: a break between two {expression}s or
// two inline tags; write {" "} there by hand where a space must render.
import { Glob } from "bun";

const inline =
  "a|strong|em|b|i|code|span|kbd|abbr|time|small|mark|cite|q|s|u|del|ins|sup|sub|img|button|label|svg";
const text = `[\\p{L}\\p{N},.;:!?)\\]%*"'’”}—–-](?<!\\{" "\\})`;
const next = `[\\p{L}\\p{N}{("'“‘—–-]`;
const br = `[ \\t]*\\r?\\n[ \\t]*`;
const patterns = [
  new RegExp(`${text}${br}<(${inline})[\\s>/]`, "gu"),
  new RegExp(`</(${inline})>${br}${next}`, "gu"),
  new RegExp(`</(${inline})${br}>${br}${next}`, "gu"),
];

let hits = 0;
for (const file of new Glob("src/**/*.astro").scanSync()) {
  const source = await Bun.file(file).text();
  for (const pattern of patterns)
    for (const match of source.matchAll(pattern)) {
      hits++;
      console.error(
        `${file}:${source.slice(0, match.index).split("\n").length}: line break next to <${match[1]}>, write {" "}`,
      );
    }
}
process.exit(hits ? 1 : 0);
