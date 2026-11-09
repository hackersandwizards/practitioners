# Performance, 09.11.2026

This run changed no code that affects performance, so the report has no before-and-after pair. It
measures the state of `origin/main` at `a0329db`, after the overview moved onto brand's
`ListFilter` (`cd97855`) and the brand and scaffolding raises up to brand v1.64.0 and scaffolding
v5.5.1. The previous report, of 08.11., is in git history.

The site is static (Astro 7.4.7, `output: "static"`), so it has no endpoints to time. Nothing is
hosted. The numbers come from `bun run build` served by `astro preview` on 127.0.0.1:4397.

## State now

Lighthouse 13.6.0, Chrome for Testing 156 headless, default mobile preset and `--preset=desktop`,
three runs per page, median. Page types: the overview `/` and one person's page (`/stefan-munz/`,
an `active` entry).

| Page       | Preset  | Perf | A11y | BP  | SEO | FCP ms | LCP ms | TBT | CLS   | Bytes   |
| ---------- | ------- | ---- | ---- | --- | --- | ------ | ------ | --- | ----- | ------- |
| `/`        | mobile  | 100  | 100  | 100 | 63  | 757    | 757    | 0   | 0.001 | 287,592 |
| `/`        | desktop | 100  | 100  | 100 | 63  | 207    | 467    | 0   | 0     | 239,074 |
| `/<slug>/` | mobile  | 100  | 100  | 100 | 63  | 760    | 760    | 0   | 0     | 137,745 |
| `/<slug>/` | desktop | 100  | 100  | 100 | 63  | 204    | 204    | 0   | 0     | 133,077 |

The 1-minute load average (`sysctl -n vm.loadavg`) on 16 cores was 21.4 before the batch, 24.6
after the overview's runs and 16.7 after the person's page. Other sessions shared the machine, so
the runs were not under the core count. The three runs of each pair stayed within 10 ms of each
other.

Against 08.11.: the overview carries 2.7 KB more on mobile, the ListFilter script (3.5 KB transfer)
included. Desktop dropped 8 KB and the person's page 18 KB. The header now fetches one lockup
instead of both, which settles the brand proposal of 08.11.; whether it accounts for the whole drop
was not measured.

SEO stays at 63 because every page carries `noindex` (`is-crawlable` fails): no public host serves
a build yet (`items/work-practitioner-roster.md`, Before any public host). The two other audits
below 0.9, `render-blocking-insight` and `network-dependency-tree-insight`, are the one stylesheet.
Inlining it was measured and left out on 08.11.

Not measured this run: route changes, search and filter interaction, build and dev start times.
None of the code those depend on changed in this run.
