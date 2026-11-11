// What a practitioner's pull request may change, read from git objects alone, so it runs before
// anything checks the pull request out: `bun run pull-request origin/main...FETCH_HEAD` on your own
// main (practitioner-bio, step 1), and in the pull request's CI as the base's copy. The gate runs
// files it finds in the tree (tests, lint configs) and a link reaches outside the folder, so any
// other file name, a link or an executable stops the review before it starts.
import { $ } from "bun";

// Case-sensitive but for an image's extension: `Bio.md` beside `bio.md` would collide on a
// case-insensitive checkout, where the local checks read one file and the merge keeps both.
const allowed =
  /^src\/content\/practitioners\/[^/]+\/(bio\.md|bio\.de\.md|bio\.short\.md|entry\.json|[^/]+\.(jpe?g|png|webp|heic|avif|JPE?G|PNG|WEBP|HEIC|AVIF))$/;

/** The paths of `git diff --raw -z` output that a pull request may not change, each with why. */
export function offences(raw: string): string[] {
  const fields = raw.split("\0").filter(Boolean);
  const found: string[] = [];
  const folders = new Set<string>();
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const mode = fields[i]!.split(" ")[1]!;
    const path = fields[i + 1]!;
    if (!allowed.test(path)) {
      found.push(`${path}: not a bio, entry.json or image in a practitioner's folder`);
      continue;
    }
    if (mode !== "100644" && mode !== "000000") found.push(`${path}: mode ${mode}`);
    folders.add(path.split("/").slice(0, 4).join("/"));
  }
  if (folders.size > 1) found.push(`more than one folder: ${[...folders].join(", ")}`);
  return found;
}

if (import.meta.main) {
  const range = process.argv.slice(2);
  if (!range.length) throw new Error("usage: bun run pull-request <base>...<head>");
  const raw = await $`git diff --raw -z --no-renames --end-of-options ${range}`.text();
  const found = offences(raw);
  for (const line of found) console.error(`[pull-request] ${line}`);
  if (found.length) process.exit(1);
  console.log("[pull-request] only the bios, entry.json and images of one folder");
}
