export const split = (text: string) => {
  const lf = text.replace(/\r\n/g, "\n");
  const [, frontmatter, body] = lf.match(/^(?:---\n(?:([\s\S]*?)\n)??---(?:\n|$))?([\s\S]*)$/)!;
  return { data: (frontmatter ? Bun.YAML.parse(frontmatter) : {}) as { photo?: string }, body };
};

/** Paragraphs joined by a blank line, each on one line: the files wrap at 100 columns. */
export const paragraphs = (body: string) =>
  body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " "))
    .join("\n\n");
