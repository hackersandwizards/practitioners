// Lower case but for an uploaded image's name and extension: `Bio.md` beside `bio.md`, `Ada/`
// beside `ada/` or `Photo.webp` beside `photo.webp` would collide on a case-insensitive checkout,
// where the local checks read one file and the merge keeps both.
const allowed =
  /^src\/content\/practitioners\/[a-z0-9-]+\/(bio\.md|bio\.de\.md|bio\.short\.md|entry\.json|[^/]+\.(jpe?g|png|webp|heic|avif))$/;
const image = /\.(jpe?g|png|webp|heic|avif)$/i;

/** The paths of `git diff --raw -z` output that a pull request may not change, each with why. */
export function offences(raw: string): string[] {
  const fields = raw.split("\0").filter(Boolean);
  const found: string[] = [];
  const folders = new Set<string>();
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const mode = fields[i]!.split(" ")[1]!;
    const path = fields[i + 1]!;
    if (!allowed.test(path.replace(image, (ext) => ext.toLowerCase()))) {
      found.push(`${path}: not a bio, entry.json or image in a practitioner's folder`);
      continue;
    }
    const name = path.slice(path.lastIndexOf("/") + 1);
    if (name !== "photo.webp" && name.toLowerCase() === "photo.webp")
      found.push(`${path}: photo.webp in another case`);
    if (mode !== "100644" && mode !== "000000") found.push(`${path}: mode ${mode}`);
    folders.add(path.split("/").slice(0, 4).join("/"));
  }
  if (folders.size > 1) found.push(`more than one folder: ${[...folders].join(", ")}`);
  return found;
}
