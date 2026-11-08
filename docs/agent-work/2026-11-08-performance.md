# Performance, 08.11.2026

First baseline for this repo: no earlier performance report exists. The site is static (Astro 7.4.7,
`output: "static"`), so it has no backend endpoints to time. Nothing is hosted; the numbers below
come from the production build served by `astro preview` on 127.0.0.1:4391.

The machine was shared with other runs. Each line carries the load average
(`sysctl -n vm.loadavg`, 1/5/15 min) read before it. Lighthouse batches waited until the 1-minute
load was 4 or less.

## State now

Lighthouse 13.6.0, Chrome 156 headless, default mobile preset and `--preset=desktop`, three runs
per page, median. Page types: the overview `/` and one person's page (`/stefan-munz/`, an
`active` entry; a public build renders no drafts).

| Page       | Preset  | Perf | A11y | BP  | SEO | FCP ms | LCP ms | TBT | CLS   | Bytes   |
| ---------- | ------- | ---- | ---- | --- | --- | ------ | ------ | --- | ----- | ------- |
| `/`        | mobile  | 100  | 100  | 100 | 63  | 753    | 753    | 0   | 0.001 | 284,900 |
| `/`        | desktop | 100  | 100  | 100 | 63  | 203    | 483    | 0   | 0.001 | 247,264 |
| `/<slug>/` | mobile  | 100  | 100  | 100 | 63  | 753    | 753    | 0   | 0     | 155,798 |
| `/<slug>/` | desktop | 100  | 100  | 100 | 63  | 202    | 202    | 0   | 0     | 152,798 |

Load before the batch: mobile 3.85/4.41/4.43, desktop 3.94/4.39/4.42.

SEO stays at 63 because every page carries `noindex` (`is-crawlable` fails). That is the
publication rule in `items/practitioner-pages.md`, not a defect.

Route changes and interactions, headless Chrome, 412×823 viewport, median of five (load
3.86/4.35/4.41):

| Measure                                    | CPU 1× | CPU 4× |
| ------------------------------------------ | ------ | ------ |
| Click a card to the person's page, `load`  | 63 ms  | 92 ms  |
| Breadcrumb back to the overview, `load`    | 48 ms  | 97 ms  |
| Typing "stef" in the search, longest event | ≤16 ms | ≤16 ms |
| Clicking a filter, longest event           | ≤16 ms | ≤16 ms |

Event durations come from `PerformanceObserver` type `event` with a 16 ms threshold, so ≤16 ms
means no event reached it.

Start times, median of three:

| Command                       | Time                                                             | Load           |
| ----------------------------- | ---------------------------------------------------------------- | -------------- |
| `bun run build`, warm cache   | 1.28 s                                                           | 4.14/4.38/4.41 |
| `bun run build`, cold cache   | 2.19 s (one run, `.astro` and `node_modules/.astro` moved aside) | 4.14/4.38/4.41 |
| `astro dev`, port listening   | 1.0 s                                                            | 4.07/4.13/4.44 |
| `astro dev`, first `/` answer | 1.8 s, of which the website's `/team/` fetch is 0.3–1.1 s        | 3.65/4.26/4.37 |
| `astro preview`, first answer | 0.87 s                                                           | 3.97/4.33/4.40 |

Each dev or preview request after the first answers in 1–25 ms.

## What changed in this run

**Portraits sized to their slot.** Every portrait was served at 480 px, while cards render at 122
to 253 CSS px and the person's portrait at 160 or 240 px. `PersonCard.astro` now gives
`widths={[240, 320, 480]}` and `[slug].astro` `widths={[160, 240, 320, 480]}`, each with a
`sizes` that matches the measured slot. Measured with only this change:

| Page       | Preset  | Bytes before | Bytes after | LCP before | LCP after |
| ---------- | ------- | ------------ | ----------- | ---------- | --------- |
| `/`        | mobile  | 408,667      | 284,869     | 754 ms     | 752 ms    |
| `/`        | desktop | 408,667      | 247,233     | 544 ms     | 485 ms    |
| `/<slug>/` | mobile  | 164,822      | 155,756     | 752 ms     | 752 ms    |
| `/<slug>/` | desktop | 164,822      | 152,756     | 203 ms     | 204 ms    |

Lighthouse's `image-delivery-insight` went from "Est savings of 180 KiB" (mobile) and 204 KiB
(desktop) to passing. Loads: before 3.65/4.03/4.39 and 3.92/4.25/4.44, after 3.89/4.31/4.42 and
3.21/4.07/4.32. A repeat batch of the same build matched within 2 ms. Cost: the build output grew
from 80 files and 1.4 MB to 111 files and 1.7 MB; warm build time stayed at 1.2–1.3 s.

**A meta description on every page.** SEO 54 to 63 on both pages and presets; the only change
between the two batches.

## Tried and left out

**Inlining the stylesheet** (`build.inlineStylesheets: "always"`, 44 KB raw, 9.6 KB gzip).
Lighthouse's simulated FCP on the person's page fell from 752 to 601 ms (mobile) and 203 to 173 ms
(desktop); on the overview it stayed at 752 ms. The FCP Chrome actually observed in the same runs
stayed between 37 and 80 ms in every batch, inline or not. Inlining makes every navigation download
the whole stylesheet again instead of reading it from cache, so it was reverted. Worth revisiting
once the site is hosted and visitors mostly open a single page from a mail link.

**Preloading the fonts.** Both faces load with `font-display: swap` and start right after the
stylesheet; FCP does not wait on them in the traces. Not tried.

The overview's mobile FCP of 753 ms did not move under any change; why the simulated value stays
there is not yet explained.

## For brand

`expert/components/AppHeader.astro` renders both `lockup-screen.svg` (17.0 KB) and
`lockup-screen-night.svg` (24.5 KB) as `<img>`, and `header.css` hides one by theme. Chrome fetches
both on every page (Lighthouse network requests, every run above), so each page loads one lockup it
never shows. A proposal not yet measured: `loading="lazy"` on the two images, since Chrome defers a
lazy image while it has `display: none`. Check that the visible lockup still paints with the first
frame, then measure transfer per page before and after.
