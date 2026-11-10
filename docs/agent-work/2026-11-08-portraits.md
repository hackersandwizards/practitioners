# Portraits: larger originals and the retouch, 08.11.2026

Three portraits changed, each a larger copy of the same shot, and each got the retouch, without
sharp-2. Every other portrait keeps its file. Across 33 people, retouch alone tied with the current
files (mean −0.02 on a 10-point scale) and retouch plus sharp-2 lost (mean −0.21). This repository
is public, so the per-person tables of this report live in os (`docs/agent-work/2026-11-08-portraits.md`).
`bun run portrait` (`scripts/retouch-portrait.ts`) holds the treatment for the next portrait.

## Scope

The 33 folders with a portrait below 960 px that hackersandwizards.dev shows. Left out: the 15
folders whose names stay off the website, which have no slot to improve and may not be named
outside their own folder, plus `reachy` and `robert-glaser`, which the site does not show either.
Measured with `sips -g pixelWidth` on all 56 portraits: 50 below 960 px.

What the live site shows (headless Chrome for Testing, 08.11.): at a 1440 px window the first
`/team/` group renders at 302 CSS px and every profile page at 240 CSS px; on a 390 px phone, 208
and 160 CSS px. At 2x a 480 px file fills a 240 px slot exactly, so a larger file mainly helps the
first group and screens wider than these two. `src/lib/photo-size.test.ts` keeps the 918 px minimum
for the 459 CSS px slot at a 767 px window.

## Sources

Searched per person: the websites and profiles named in the entry, speaker and company team pages,
web search, and Benedikt's Gmail (171 messages with an image attachment and a photo word,
read-only). GitHub serves avatars at 460 px at most and Sessionize at 400 px, below every current
file. Gmail held no usable portrait. A candidate counted only at an OpenCV SFace cosine of at least
0.90 against the current portrait, measured at matched scale, and after a side-by-side check.
Controls: one portrait against itself at 300 px 0.93, against two other people 0.14 and 0.28.

16 people had a candidate: 3 swapped, 2 tied and kept, 1 lost, 1 rejected as the same frame with
the background replaced, 1 the same size as the current file, 8 below 0.90. Below 0.90 is often the
same person in another picture; the bar only lets a copy of the current shot through. For the 24
people without a candidate, a larger original needs a signed-in LinkedIn browser or the person.

## Treatment

`scripts/retouch-portrait.ts`, after the recipe in Company OS (`profile-photos.md` and the event
photos report of 29.10.): square crop and, with `--retouch`, white balance by channel gain (gray-world at half strength,
each gain within 5 %), a tone curve that lowers highlights above 0.75 by up to 4 grey levels and
keeps white, a Lanczos resize to the master size, and with `--sharpen` sharp-2, an unsharp mask on
luminance only at radius 1.2 px, amount 70 %, threshold 2. WebP q82, effort 6, smart subsampling,
as the website's `optimize-media.mjs`.

Three departures from the transcripts. The event-photo script's roll-off formula raised the values
just above its knee (slope 1.33) instead of lowering them, so the script uses a shoulder that only
lowers. Denoise is left out: the Immerkær estimate put 54 of 56 portraits at 1.9 to 2.9 grey levels.
The two above, at 4.3 (sharpened once already) and 7.8, are texture and earlier sharpening, not sensor noise. Masters stop at 1024 px, the cap in the
`practitioner-bio` skill, rather than 1760 px: the largest practitioner slot needs 972 px.

## Blind review

Medium: one persona on two devices, the CTO of a 300-person software company checking trainers
before booking, on a 14-inch 2x laptop at 1440 px and on a 390 px 3x phone. Claude Opus and Codex
(gpt-6.1-sol, high), two runs each: 72 calls, 888 scored images, none missing. Each reviewer saw
four trainers per call, each in every version, as a screenshot of the live page at device pixels
with the portrait requests answered from the version file. That is the first `/team/` group's
card for the five people in it, and the profile page portrait for everyone else. Names were neutral (`t1-a.png`) and shuffled per call;
the key stayed outside the folders. The criteria were fixed before the first call.

The laptop prompt, verbatim, folder path shortened:

> You are the CTO of a 300-person software company. You are checking the trainers of a training provider's website before you book a training for your engineering teams, on a 14-inch laptop with a 2x (Retina) screen at a 1440 CSS px wide window; each image is a screenshot at device pixels, so 2 image pixels make 1 CSS pixel on that screen. The website shows trainers as portrait cards on its team page and a portrait at the top of each trainer's own page.
>
> You see screenshots of 4 trainers. For each trainer you see the same place on the page in several versions that differ only in the portrait photo. The files are in the folder …/b1-laptop-claude-r1: [file list]
>
> Read every image. Judge only the portrait photo as you would see it on that screen. Score each image from 1 to 10 on each criterion: 1. sharpness: the face looks crisp at this display size, no blur, no blockiness 2. natural: the photo looks like a real, untouched photograph, no halos, crunchy edges or plastic skin 3. trust: the person looks credible and professional as a trainer you would put in front of your engineers 4. fit: the portrait fits with the page around it 5. calm: the image reads calmly, nothing distracting
>
> Answer with only a JSON array, one object per image, nothing else

Score is the mean of the five criteria over all eight cells (two devices, two models, two runs).
Noise is the largest gap between the run-1 and run-2 means of one version of that person. Across
all images the run-to-run gap averages 0.33 for Claude and 0.21 for Codex. A version replaces the
current file only where its lead exceeds the noise with each model and in each run.

A larger original won for 3 of the 5 people who had one in the review; of the other two, one tied
inside the noise and one lost on natural. Retouch alone tied for one more person. sharp-2 beat its
unsharpened twin for 3 of 33 people and won nowhere against the current file; reviewers marked it
down on natural.

Review: medium, because a CTO's first look at the team page decides whether the trainers seem
credible.
