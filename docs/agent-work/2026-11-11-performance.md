# Performance, 11.11.2026

This run changed no code that affects what a page loads, so the report has no before-and-after
pair. It measures the build of `824bd21` (Astro 7.4.10, brand v2.15.0, scaffolding v5.17.2). The
later commits of the run change validation only, no rendered page. The previous report, of 09.11.,
is in git history.

The site is static (`output: "static"`), so it has no endpoints to time. Nothing is hosted. The
numbers come from `bun run build` served by `astro preview` on 127.0.0.1:4417.

## State now

Lighthouse 13.6.0, Chrome for Testing 157 headless, default mobile preset and `--preset=desktop`,
three runs per page, median. Page types: the overview `/` and the page of one `active` entry.

| Page       | Preset  | Perf | A11y | BP  | SEO | FCP ms | LCP ms | TBT | CLS    | Bytes   |
| ---------- | ------- | ---- | ---- | --- | --- | ------ | ------ | --- | ------ | ------- |
| `/`        | mobile  | 95   | 100  | 100 | 63  | 906    | 3007   | 0   | 0.0002 | 431,885 |
| `/`        | desktop | 100  | 100  | 100 | 63  | 255    | 605    | 0   | 0.0001 | 368,151 |
| `/<slug>/` | mobile  | 100  | 100  | 100 | 63  | 902    | 902    | 0   | 0      | 130,158 |
| `/<slug>/` | desktop | 100  | 100  | 100 | 63  | 243    | 245    | 0   | 0      | 128,554 |

The 1-minute load average (`sysctl -n vm.loadavg`) on 16 cores was 25.6 before the batch, 19.6
after the overview's runs and 14.9 after the entry's page. Other sessions shared the machine.

The overview's mobile LCP splits in two. Of six runs, four landed at 906, 907, 945 and 1001 ms and
two at 3007 and 3086 ms, with the same 28 requests and the same bytes in each. Three of the four
fast runs came in a second batch at a load average of 101 to 83, so load alone does not explain the
slow pair. In both slow runs the LCP element is text and the trace shows an element render delay of
349 ms against 62 to 117 ms in the fast ones.

The overview's mobile weight: 231,033 bytes of images in 22 requests, 174,688 bytes of fonts in 3,
one stylesheet of 14,938 bytes, one script of 4,244 bytes, the document 6,982 bytes.

Portrait sizes on the overview, measured in the same build: at every viewport the browser picks a
`srcset` candidate at least as wide as the portrait draws. 375 px at 3x needs 389 px and loads the
480w file; 390 at 2x needs 272 and loads 320w; 800 at 2x needs 398 and loads 480w; 900 at 1x needs
229 and loads 240w; 1280 at 2x needs 420 and loads 480w.

## Against 09.11.

- The overview's mobile weight rose from 287,592 to 431,885 bytes, desktop from 239,074 to
  368,151. The overview now shows 22 `active` entries against 16 at `8112867`, so it draws six more
  portraits. How much of the rise those account for, and how much the brand raises since v1.64.0,
  was not split this run.
- 09.11. measured another entry's page, so the two entry pages are not compared.

SEO stays at 63 because every page carries `noindex` (`is-crawlable` fails): no public host serves
a build yet (`items/work-practitioner-roster.md`, Before any public host).

Not measured this run: search and filter interaction, build and dev start times.
