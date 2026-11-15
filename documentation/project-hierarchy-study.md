# Project entry hierarchy study

Reviewed November 12, 2026. The initial image-and-text-column preview was rejected because Tyler wants the project title to come first. The current preview follows his direction: title, description, designed outcomes, then a single web image or a three-screen app group. The source observations below are research context, not a rule overriding that preference. This is not a production release. Reference screenshots are in ignored `outputs/tokens-gallery-review/hierarchy-study/`.

## Finding

The problem is the composition of the whole entry. The current title, full-width description, separate result treatments and much smaller, differently shaped screenshots read as successive fragments. Increasing the figures' size made them compete with the project title. Shrinking them into coloured boxes made them resemble tags or controls, while the fragmented alignment remained.

The earlier recommendation was an aligned preview-and-text row. A stable preview group provided the visual anchor; the adjacent text contained the name, purpose and impact in one tight reading sequence. Tyler preferred a title-first stack, implemented below. The research does not establish a universal winning layout.

## References and useful patterns

| Reference | Observed treatment | Application here |
| --- | --- | --- |
| [Brittany Chiang, selected projects](https://brittanychiang.com/#projects) | A preview column sits beside the title and description. Adoption figures sit within the text group; technology tags have a separate role. | The closest structural fit for a dense personal portfolio. Keep an outcome near its explanation and do not style it like a filter chip. |
| [Linear customer stories](https://linear.app/customers) | Consistent image blocks anchor cards. Several headlines integrate a concrete customer outcome. A separate, larger statistics section is used at page level. | Use imagery for visual weight and the result for meaning. A list entry need not contain its own dashboard-style statistic panel. |
| [Plaid story library](https://plaid.com/customer-stories/library/) | Repeated image-and-copy cards share dimensions and alignment; some story titles state the result directly. | Consistent grouping and image treatment are useful. Its large commercial card grid is heavier than this portfolio needs. |
| [NN/g: visual design principles](https://www.nngroup.com/articles/principles-visual-design/) and [proximity](https://www.nngroup.com/articles/gestalt-proximity/) | Relative scale establishes importance. Nearby related elements form perceptual groups; larger gaps separate groups. | Fix alignment, proximity and hierarchy before applying more backgrounds or borders. |

These observations do not establish that a visitor's hiring or purchase decision improves with one exact layout. They support the hierarchy and grouping recommendation. Neither the source sites' copy nor their implementation code should be copied.

## Earlier proposed component

- Desktop: a consistent preview column, approximately 240–280px wide, beside a text column. The title is the first text anchor, followed by a concise purpose statement and one compact impact line. Use the existing typeface and navy/sage tokens.
- Put one lead preview and up to two supporting thumbnails in the same bounded visual group. Preserve the requested range of app states; full images and galleries remain inside the reader. Keep screenshots legible, preserve their content and avoid adding white padding.
- Keep the title around 18px, purpose around 14px and impact around 13–14px. Use semibold values and restrained accent colour. No pill backgrounds, separate large number tiles, ornamental icons or extra result buttons.
- Example hierarchy: **GradSimple**; a concise explanation of the career newsletter; then **43,860 website users/year · 7,259 newsletter subscribers**. These are existing project figures, not newly measured outcomes.
- Give the project entry more space from the next entry than any gap between its own description and impact. This makes the row a coherent unit without a box around every part.
- A numeric metric and a specific nonnumeric result occupy the same impact role. Do not force an award, live event use or prototype into a fake numeric KPI. Do not repeat a count that is already doing the work in the description.
- On phones, stack the preview group and the same text hierarchy, with the impact visible before opening the project. Preserve the existing title button, keyboard access and reader navigation.

## Why the earlier versions missed

The large panel created a separate visual destination and disproportionate importance. The small callouts reduced bulk but retained the idea of results as independent UI objects. The original inline markers had too little distinction inside a loosely grouped, full-width stack. Changing that stack's structure is what makes an unboxed impact line a materially different recommendation from simply returning to the first styling.

Work-page highlights still make sense inside long-form achievement bullets. The project list has a scanning and previewing role, so it can share colour and type tokens while using a different composition.

## Current preview after Tyler’s feedback

All 15 entries now begin with the project title in both document and visual order. Description and supported outcomes follow, then the preview. One web screenshot is shown per project, while HuddleDex keeps its three phone screens. Both groups have a 360px maximum width, shrinking together on phones. The original project data retains every screenshot for expanded readers.

The outcomes form a compact definition-style group: 18px semibold values with the Work page’s sage marker, 12px labels beneath, and a slim divider between multiple stats. There is no enclosing panel. Multiple stats stack with a horizontal separator at 480px and below. A single recognition or savings figure uses the same value/label treatment. Existing wording and values are preserved.

Responsive sizes match 360px web previews and approximately 115px phone columns, with candidates up to 320, 640 and 960px where the original permits. Only the first web preview is eager; later images remain lazy. Extra web thumbnails have been removed from the list and its preview generator, reducing the list’s image requests. Expanded galleries retain their existing responsive delivery and full range of states.

The previous keyboard-focus spacing correction remains: 44px title targets and an inset focus outline. The title and preview anchors, metadata and copy are preserved. No production deployment is part of the preview.

Validation: production build and all 31 automated checks pass. Browser review in dark and light themes confirmed title-first order on all 15 entries, one list image per web project, three phone images for HuddleDex, and a shared 360px desktop preview width. At a 319px viewport both previews shrink to 271.5px, multiple stats stack with a horizontal separator, and neither the document nor any entry overflows horizontally. GradSimple and HuddleDex readers open and close correctly; HuddleDex still advances through its eight app screenshots. No browser errors or warnings were captured. Review images are saved under ignored `outputs/tokens-gallery-review/title-first/`.
