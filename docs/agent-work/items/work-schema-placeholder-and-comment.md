---
kind: work
status: open
priority: 3
order: 2101
area: software-engineering
owner: Ada
evidence: "Run prac-next, 11.11. 18:41: an unfilled your-name handle in a link line passes the gate with 0 errors and points at a real account; Ada decided the schema refuses it, with a patch release. Run fix-web-expertise, 12.11. 01:50: the website test now imports expertiseProblem from practitioners/schema (website f5bf879b), so the comment at src/lib/schema.ts lines 141-142 ('the same rule here') is stale."
---

# Schema: refuse placeholder link handles, and correct the stale expertise comment

Ada briefs one practitioners session for both changes to src/lib/schema.ts, then a patch release.

1. **Placeholder handles pass.** CONTRIBUTING's example shows the link lines as comments with
   your-name handles. A contributor who uncomments one and leaves the handle unfilled passes the
   gate, and the entry links a real account. The schema refuses your-name (and the old example
   handle) in every link field, with a test whose control is the unfilled example line.
2. **Stale comment.** The comment above jobTitle says the website holds the same rule in its own
   test. Since website f5bf879b the website imports this rule from practitioners/schema; the
   comment says so instead.

schema.ts is exported, so the change ships as a patch release, and the website and os raise
their pin afterwards.

Done when the release is tagged and the refusal's test goes red on the unfilled example line.
