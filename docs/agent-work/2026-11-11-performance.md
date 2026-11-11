# Performance, 11.11.2026

This report covers two measurements of 11.11. Neither measures a fix, so neither has a
before-and-after pair. The evening run measures the build of `8a6a808`
(Astro 7.4.11, brand v2.21.0, scaffolding v5.19.3), and the morning run measured `824bd21` (Astro
7.4.10, brand v2.15.0, scaffolding v5.17.2). Between the two, four more entries became `active`,
several portraits were cropped again, and brand and Astro rose by the versions above. The report
of 09.11. is in git history.

The site is static (`output: "static"`), so it has no endpoints to time. Nothing is hosted. The
numbers come from `bun run build` served by `astro preview` on 127.0.0.1:4417.

## State now

Lighthouse 13.6.0, Chrome for Testing 157 headless, default mobile preset and `--preset=desktop`,
three runs per page, median. Page types: the overview `/` and the page of one `active` entry
(`/aaron-spring/` in the evening, an entry the morning run did not record).

| Page       | Preset  | Perf | A11y | BP  | SEO | FCP ms | LCP ms | TBT | CLS    | Bytes   |
| ---------- | ------- | ---- | ---- | --- | --- | ------ | ------ | --- | ------ | ------- |
| `/`        | mobile  | 100  | 100  | 100 | 63  | 905    | 905    | 0   | 0.0002 | 432,400 |
| `/`        | desktop | 100  | 100  | 100 | 63  | 244    | 626    | 0   | 0.0001 | 389,682 |
| `/<slug>/` | mobile  | 100  | 100  | 100 | 63  | 902    | 902    | 0   | 0      | 130,321 |
| `/<slug>/` | desktop | 100  | 100  | 100 | 63  | 244    | 244    | 0   | 0      | 128,717 |

The 1-minute load average on 16 cores was 56.5 before the batch, 48.5 after the overview's runs
and 38.0 after the entry's page. Other sessions shared the machine.

The overview's mobile weight: 231,011 bytes of images in 23 requests, 174,688 bytes of fonts in 3,
one stylesheet of 15,102 bytes, one script of 4,244 bytes, the document 7,355 bytes. On desktop
the overview loads 27 images of 188,293 bytes. The build holds 26 `active` entries.

## Against the morning run

| Page | Preset  | Perf     | LCP ms    | Bytes            |
| ---- | ------- | -------- | --------- | ---------------- |
| `/`  | mobile  | 95, 100  | 3007, 905 | 431,885, 432,400 |
| `/`  | desktop | 100, 100 | 605, 626  | 368,151, 389,682 |

Each cell gives the morning reading first. The morning run measured 22 `active` entries at a load
average of 25.6 to 14.9.

- The overview's mobile LCP split in two in the morning: of six runs, four landed at 906 to 1001
  ms and two at 3007 and 3086 ms, with the same requests and bytes. Three of the four fast runs
  came in a second batch at a load average of 101 to 83, so load alone does not explain the slow
  pair. The observed render delay does not separate them either: 348 and 56 ms in the slow pair,
  62 to 117 ms in the fast runs. In the evening all three runs landed at 905 to 907 ms, with render
  delays of 65 to 116 ms. In all nine runs the LCP element is the same intro paragraph. The cause
  of the slow pair is not explained (`items/work-overview-mobile-lcp.md`).
- The overview's desktop weight rose by 21,531 bytes while mobile rose by 515. The stylesheet grew
  from 14,938 to 15,102 bytes and the document from 6,982 to 7,355. The evening build shows four
  more entries and newer brand and Astro releases, and the morning run recorded no desktop image
  count, so how much of the rise each accounts for is not measured.
- On 09.11. the overview weighed 287,592 bytes on mobile and 239,074 on desktop, with 16 `active`
  entries at `8112867`. How much of the rise since comes from the added portraits and how much from
  the brand raises since v1.64.0 is not split (`items/work-overview-mobile-lcp.md`).
- The entry pages are left out of this comparison: the morning run did not record which entry it
  measured (130,158 bytes on mobile, 128,554 on desktop).

SEO stays at 63 because every page carries `noindex` (`is-crawlable` fails): no public host serves
a build yet (`items/work-practitioner-roster.md`, Before any public host).

Not measured: search and filter interaction, build and dev start times.
