// What a practitioner's pull request may change, read from git objects alone, so it runs before
// anything checks the pull request out: `bun run pull-request origin/main...pr-<number>` on your
// own main (practitioner-bio, step 1), and in the pull request's CI as the base's copy. The gate
// runs files it finds in the tree (tests, lint configs) and a link reaches outside the folder, so
// any other file name, a link or an executable stops the review before it starts.
import { $ } from "bun";
import { offences } from "./pull-request-paths";

if (import.meta.main) {
  const range = process.argv.slice(2);
  if (!range.length) throw new Error("usage: bun run pull-request <base>...<head>");
  const raw = await $`git diff --raw -z --no-renames --end-of-options ${range}`.text();
  const found = offences(raw);
  for (const line of found) console.error(`[pull-request] ${line}`);
  if (found.length) process.exit(1);
  console.log("[pull-request] only the bios, entry.json and images of one folder");
}
