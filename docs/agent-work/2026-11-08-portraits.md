# Portraits: larger originals, retouch and head framing, 08.11. and 11.11.2026

State on 11.11.: one more portrait changed, re-cropped from the same upload so the head comes close
to the size and height of the two reference portraits. The other nine re-crops the review saw keep
their files, and so do the three portraits added on 11.11. from public pages: retouch and sharp-2
won for none of them. On 08.11. three portraits changed, each a larger copy of the same shot with the
retouch, without sharp-2; across 33 people, retouch alone tied with the current files (mean −0.02
on a 10-point scale) and retouch plus sharp-2 lost (mean −0.21). This repository is public, so the
per-person tables of 08.11. live in os (`docs/agent-work/2026-11-08-portraits.md`); those of 11.11.
are not filed there yet.
`bun run portrait` (`scripts/retouch-portrait.ts`) holds the treatment for the next portrait.

## Head framing, 11.11.

The request: every portrait cut to a head framing like the founders' two portraits (`stefan-munz`,
`benedikt-stemmildt`), so the grid looks more even.

**Measured** on all 60 portraits with Apple's Vision framework (face landmarks for the face box and
the pupils, person segmentation for the top of the hair). The OpenCV YuNet model of 08.11. is no
longer on the machine, so references and the rest share this detector instead. 59 portraits show a
face. Shares of the frame: face box height 22 to 58 % (median 44), eye line 26 to 53 % from the top
(median 37), centre between the pupils 37 to 59 % from the left (median 50). Control: a crop known
to cut the chin measures its chin outside the frame.

**Target**: face box 45 % of the frame height and eye line 36.5 % from the top, the midpoints of the
two references, and the centre of the frame, 50 %. The band is the references' own spread for face
and eye line and 3 points either side of the centre; three portraits already lie in it.

**What can move.** Each crop is a square from the largest source, never upscaled, with 3 % of its
side above the hair and 2 % below the chin. Where those margins or the frame's edge conflict with
the target, they win and the crop moves only toward it. A file of 918 px or more stays at 918 px or
more, or `src/lib/photo-size.test.ts` counts it below the minimum. Any other file keeps at least
480 px, the 240 CSS px profile slot at 2x, and a file below 480 px does not shrink. That floor
leaves out the three `/team/` cards at 302 CSS px, which ask for 604 px. Larger originals came from
the public pages of 08.11. and 11.11. and, for two uploads, from this repository's history; the
three seed originals rebuild their committed files byte for byte. Of the 54 portraits outside the
references and the band, 10 can move toward the target. For 25 no crop helps, since the frame
leaves no room on the side the move needs and no wider source exists; 18 would drop below their
size floor (16 of them at 480 px), and one gains too little. A person's own upload is cropped only.

## Retouch and sharp-2 for the portraits of 11.11.

Six portraits arrived on 11.11. and stayed. All went through `bun run portrait` without
`--retouch` or `--sharpen`. Three are the practitioners' own uploads, cropped only. The three
seeded from public pages were reviewed with retouch and with retouch plus sharp-2; neither won, so
all three keep their files. Three more draft entries took a portrait from a public page later that
day, crop only and unreviewed: each is below 918 px (600 to 852), stands in until the person sends
a larger original, and raises `AWAITING_ORIGINAL` to 49.

## Blind review, 11.11.

The same persona, devices, criteria and decision rule as on 08.11. below; the portrait prompt
differs only in its file list, the shape of the answer and, on the phone, the device sentence.
Claude Opus 5.5 at medium effort and Codex (gpt-6.1-sol, high), two runs each: 40 calls, 232 scored
portraits and 16 scored grids, none missing. Run-to-run gap over all portraits: 0.33 for Claude,
0.25 for Codex. Before and after went through the same request interception and encoder.

Pairs: each of the 10 re-crops against its current file on the profile page, and the three seeds
in three versions each. The re-crop won for 1, lost for 1 outside the noise, and tied for 8. Six
re-crops were cut from the committed WebP; on average they lost on fit (−0.31) and calm (−0.46) and
gained on sharpness (+0.13). Why is not yet explained: they carry one more q82 encode and a tighter
framing, and no control separated the two.

Grid: this repository's overview, before and after all ten re-crops, at 1440 px (4 sections of 6;
the two without a changed card were pixel-identical and left out) and at 390 px (5 strips of three
screen heights). Mean of the five criteria 7.30 before and 7.53 after, noise 0.20, smallest lead per
model and run 0.15: a tie. Consistency alone rose from 6.63 to 7.38, ahead in 7 of 8 cells.

The grid prompt, verbatim, folder path shortened:

> You are the CTO of a 300-person software company. You are checking the trainers of a training provider before you book a training for your engineering teams, on a phone with a 3x screen at a 390 CSS px wide window. You are looking at the page that lists all trainers as portrait cards.
>
> You see two versions of the same page, a and b, that differ only in some of the portrait photos. Each version is cut into sections in page order (a-1, a-2, ...); each section shows three consecutive screen heights side by side, left to right, scaled down to 1000 px wide. The files are in the folder …/g-phone-codex-r1: [file list]
>
> Read every image. Judge the portrait cards of each version as a whole, as you would see them while scrolling that page. Score each version from 1 to 10 on each criterion: 1. consistency: the heads appear at a similar size and position from card to card 2. calm: the grid reads calmly, no portrait jumps out 3. fit: the portraits fit with the page around them 4. trust: the trainers look credible and professional as people you would put in front of your engineers 5. sharpness: the faces look crisp at this display size
>
> Answer with only a JSON array, one object per version, nothing else

The live site on 11.11. (headless Chrome for Testing): at a 1440 px window 16 `/team/` cards render
at 210 CSS px and 3 at 302, the profile page at 240; at 390 px, 12 cards at 135, 7 at 208 and the
profile page at 160.

Review: medium, because the change is visible on every card of the team page and is easy to take
back.

## Scope, 08.11.

The 33 folders with a portrait below 960 px that hackersandwizards.dev shows. Left out: the 17
folders the website did not show on 08.11., which have no slot to improve.
Measured with `sips -g pixelWidth` on all 56 portraits: 50 below 960 px.

What the live site shows (headless Chrome for Testing, 08.11.): at a 1440 px window the first
`/team/` group renders at 302 CSS px and every profile page at 240 CSS px; on a 390 px phone, 208
and 160 CSS px. At 2x a 480 px file fills a 240 px slot exactly, so a larger file mainly helps the
first group and screens wider than these two. `src/lib/photo-size.test.ts` keeps the 918 px minimum
for the 459 CSS px slot at a 767 px window.

## Sources, 08.11.

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

## Blind review, 08.11.

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

Review on 08.11.: medium, because a CTO's first look at the team page decides whether the trainers
seem credible.
