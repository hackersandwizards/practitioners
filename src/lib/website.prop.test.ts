import { fc, test, unicodeString } from "@hackersandwizards/scaffolding/property";
import { expect } from "vitest";
import { listing } from "./website";

test.prop([unicodeString, unicodeString, fc.option(unicodeString, { nil: undefined })], {
  examples: [
    ["", "", undefined],
    ["constructor", "Analyst", undefined],
    ["__proto__", "Équipe", ""],
    ["toString", "Rolle".repeat(256), "説明"],
    ["α/β", "", ""],
  ],
})(
  "looks up roster details by exact slug and distinguishes missing and unknown rosters",
  (slug, role, description) => {
    const url = "https://example.com/team/";
    const web = new Map([[slug, { slug, role, description, url }]]);
    const absent = { job: undefined, description: undefined, url: undefined };
    expect(listing(web, slug)).toEqual({ job: role, description, url, listed: true });
    expect(listing(web, `${slug}/absent`)).toEqual({ ...absent, listed: false });
    expect(listing(undefined, slug)).toEqual({ ...absent, listed: true });
  },
);
