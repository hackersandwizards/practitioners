import Profile from "../../../src/components/Profile.astro";
import { entry, frame } from "../entries";

export default { component: Profile };

// Each profile holds only what the person's own bio already says; the rest stays empty until they
// fill it in.
const christian = {
  ...(await entry("christian-tietze")).data,
  topics: ["context-engineering"],
  formats: ["workshop", "training"],
  roles: ["founder", "engineer"],
  domains: ["software", "telecom", "manufacturing"],
  stack: [
    { name: "SwiftUI", depth: "shipped" },
    { name: "AppKit", depth: "shipped" },
  ],
  public_work: [
    { kind: "product", title: "The Archive" },
    { kind: "article", title: "zettelkasten.de", url: "https://zettelkasten.de" },
    { kind: "community", title: "Claude Code Anonymous, Bielefeld" },
  ],
} as const;

const stefan = {
  ...(await entry("stefan-munz")).data,
  formats: ["assessment"],
  roles: ["engineer", "engineering-manager"],
  stack: [
    { name: "macOS", depth: "shipped" },
    { name: "iOS", depth: "leads" },
  ],
  public_work: [
    { kind: "community", title: "Agentic Hamburg", year: 2025, url: "https://agentic.hamburg" },
  ],
} as const;

export const Filled = { args: { data: christian }, decorators: [frame()] };
export const Sparse = { args: { data: stefan }, decorators: [frame()] };
export const Empty = { args: { data: (await entry("stefan-munz")).data }, decorators: [frame()] };
