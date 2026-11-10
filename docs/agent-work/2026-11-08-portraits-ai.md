# AI-regenerated portraits, 08.11.2026: nothing swapped

No portrait changed, and 12 candidates for three people all failed the identity gate. Because the
repository is public, this report names nobody: people appear as A, B and C, and the mapping is in
os (`docs/agent-work/2026-11-08-portraits.md`).

## Scope

The bar is a current score of at most 7.05 in the blind review of `2026-11-08-portraits.md`: below
7 of 10, or 7 within the 0.1 run noise those rows carry. Retouch and sharp-2 won for none of the
three. The review's median of 7.78 would take in 16 of the 33 people, which does not fit a photo
that is really bad. A row's own noise is not subtracted from the score, since one row's noise of
0.6 would take in a score of 7.45.

## Sources and references

Public pages, fetched 08.11.: speaker and trainer pages, a company team page, personal sites and
GitHub avatars. Three references per person, each checked by eye. LinkedIn was out of reach for
this run. Gmail, read-only: 30 messages naming one of the three carry an attachment, four of those
an image above 15 KB, and none of the four shows a face. A control query for any `.jpg` attachment
returned its limit of 50 messages (estimate 201), so the search works.

| Person | Reference 1          | Reference 2          | Reference 3          |
| ------ | -------------------- | -------------------- | -------------------- |
| A      | another shoot, 0.678 | another shoot, 0.520 | another shoot, 0.629 |
| B      | same shot, 0.965     | another shoot, 0.626 | another shoot, 0.654 |
| C      | same shot, 0.964     | another shoot, 0.517 | another shoot, 0.529 |

The numbers are the SFace cosine between the real current portrait and the real reference, with
both faces scaled to the same width (OpenCV 5.0). Controls: two other people against A's portrait
score 0.218 and 0.018. C's second reference scored 0.54 in
this morning's report at another scale; the difference is not yet explained, and both readings sit
below the 0.62 that matters below.

## Method

Codex image generation (`codex exec`, gpt-6.1-terra) from the current portrait plus the references.
Method 1 edits the current portrait. Method 2 creates a new photo with the current portrait as the
main identity source. Each ran twice with the same prompt, with no re-rolls and no prompt changed
after a measurement. Every prompt asked for the same person and age, the same expression and head
pose, the repository's framing, a calm background, and no invented pores, wrinkles, stubble or
skin texture.

## The identity gate, fixed before the first measurement

- A: cosine against the current portrait at least 0.90.
- B: landmark residual at most 6.9 %, the largest value among the earlier run's four candidates
  (website item `review-portraits-ai`).
- C: cosine against each reference at least 0.90, as the brief states it.
- D, reported beside C: against each reference from another shoot, the candidate's cosine is at
  least the real current portrait's cosine to that reference.

## Results

| Candidate | Current | Landmarks % | Ref 1 | Ref 2 | Ref 3 | Gate A | Gate D |
| --------- | ------- | ----------- | ----- | ----- | ----- | ------ | ------ |
| A m1-1    | 0.896   | 1.5         | 0.645 | 0.433 | 0.623 | no     | no     |
| A m1-2    | 0.890   | 2.3         | 0.629 | 0.440 | 0.588 | no     | no     |
| A m2-1    | 0.906   | 1.0         | 0.669 | 0.520 | 0.586 | yes    | no     |
| A m2-2    | 0.925   | 2.3         | 0.609 | 0.496 | 0.593 | yes    | no     |
| B m1-1    | 0.884   | 1.1         | 0.879 | 0.666 | 0.698 | no     | yes    |
| B m1-2    | 0.814   | 1.2         | 0.821 | 0.619 | 0.640 | no     | no     |
| B m2-1    | 0.771   | 0.9         | 0.790 | 0.643 | 0.681 | no     | yes    |
| B m2-2    | 0.812   | 1.7         | 0.804 | 0.667 | 0.668 | no     | yes    |
| C m1-1    | 0.893   | 1.0         | 0.883 | 0.524 | 0.536 | no     | yes    |
| C m1-2    | 0.852   | 1.4         | 0.855 | 0.472 | 0.488 | no     | no     |
| C m2-1    | 0.832   | 2.3         | 0.810 | 0.532 | 0.526 | no     | no     |
| C m2-2    | 0.810   | 1.5         | 0.824 | 0.557 | 0.561 | no     | yes    |

All 12 pass gate B and fail gate C. Gate A and gate D never pass together: the two candidates at
0.90 or more against the current portrait drift from its other photos, and the five that stay as
close to those photos as the real portrait does sit below 0.90. Why a candidate lands where it does
is not yet explained; no control separated colour, pose or prompt.

## Gate C cannot be met as written

Two photos of one person from different shoots score 0.52 to 0.68 here. A portrait within 0.90 of
both the current file and such a reference has to sit between them: two angles of at most 25.8°
add up to at most 51.7°, which is a cosine of 0.62 between the two photos. C's two references from
other shoots and A's second reference lie below that, so no image can pass there; the others leave
only a narrow midpoint. The bar holds for a same-shot reference, as in the earlier run's controls
at 0.91 to 0.93 (website item `review-portraits-ai`), and says nothing about a photo from another
day. Rejecting on it changes no outcome here, because gates A and D already reject all 12.

Review: none, because no candidate survived the identity gate.
