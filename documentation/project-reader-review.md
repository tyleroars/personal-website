# Project reader review, November 11, 2026

## Scope and direction

Refine the existing personal site, preserving its navy surfaces, sage accent, system sans-serif type, title-only project controls, voice, project evidence and URLs. Design variance 6, motion 2, density 3: a quiet editorial reader with wide supporting images. No new animation, dependencies, routes, case studies or production deployment.

## Findings and changes

- Desktop story lines reached 109 characters in a measured Tone Lab paragraph. The centered 35rem reading column now produces 75–77 characters per full line in the measured GradSimple opening. Narrative text keeps 16px type and 1.75 line height.
- Outcomes used smaller type than the story. Outcome text and section headings now use the same 16px scale; links use 14px and secondary captions use 13px. Sage bullets and controls identify structure and action without coloring the narrative.
- Long stories and secondary sections buried the visual evidence. The reader now opens with the problem and build, followed by supported outcomes, images, then remaining technical detail/reflections and related work. Two lead paragraphs are the default. The hackathon uses three so its actual prototype is introduced before its award. Existing wording and evidence are unchanged.
- Estimate details are nested inside their associated outcomes. Gallery groups have visible headings, with distinct app and event labels for HuddleDex. Arrow buttons no longer force a scroll on each selection; thumbnail selection still brings its gallery heading into view.
- Gallery images fit their natural size and aspect ratio, capped to the viewport, rather than enlarging small images to the full reader width. Screenshots stay passive on the list and there is no fullscreen image zoom.
- Mobile readers use the full viewport, with a persistent close bar and one scrolling content surface. This recovers the space previously lost to outer margins. HuddleDex build controls stack at the narrowest width to avoid overflow.
- Opening focus moves to the project heading, following long-dialog guidance. Escape, focus return and the existing keyboard trap remain intact. A noninteractive heading does not display an input-like focus outline; interactive controls retain their focus indication.

## Verification

- Opened all 15 public project readers on desktop. Every first gallery image loaded, reading columns stayed within 560 CSS pixels, and initial focus reached the project heading.
- Checked all 15 at 319px in light mode and 390px in dark mode. No horizontal reader overflow remained after fixing HuddleDex’s narrow build controls. Long titles wrap. Outcomes and story text remain 16px.
- Expanded GradSimple career tools and HuddleDex’s full prompt. At the narrow width the prompt stays within the reader and uses 16px text. Verified forward and backward Tab wrapping with the textarea expanded, Escape and focus returning to the originating project title.
- Checked Slides → Video’s second image: it fits the available width without enlarging beyond its 404px source. Gallery navigation reaches the distinct export result.
- Contrast on the reader surface: dark body 10.32:1, secondary text 6.87:1, sage 9.82:1; light body 7.18:1, secondary text 4.96:1, sage 7.82:1. These exceed WCAG AA’s 4.5:1 normal-text threshold.
- Lighthouse 13.6.0, local mobile simulation, Projects with Tone Lab open: performance 98, automated accessibility 100, FCP/LCP 2.0s, CLS 0, total blocking time 0ms. This is a local automated check, not a manual screen-reader or real iPhone/Safari certification.
- All 17 existing build/launch/navigation checks pass. Public narrative and agent text remain synchronized. No push or deployment.

## Primary design references

- [W3C visual presentation guidance](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html): line length, spacing, alignment and resizable text. This is AAA guidance used as a readability reference, not a claim of full AAA conformance.
- [W3C modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): appropriate opening focus for long content, contained Tab navigation, Escape and focus return.
- [W3C minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): normal-text contrast threshold.

## Follow-up: outcomes-first opening

Tyler approved a revised opening after the initial review: title, one-sentence project description, supported outcomes, problem/build narrative, images, then further details. This supersedes the story-first order described above. The existing list description provides context for direct project links. Projects without meaningful outcomes go directly from their summary and access links into the story. All 15 readers were checked on desktop and at 319px × 844px, with no horizontal overflow and outcome lists visible before the narrative. No project wording or evidence was changed.


## Follow-up: panel finish and visual grouping

The title, summary, access links and supported outcomes now share a softly tinted overview surface. A static gradient and inset edge highlight give it depth without backdrop blur, moving content or a decorative hover state. Body paragraphs remain on the solid reader surface. Leading figures use the existing sage accent at the same 16px text size. Reduced-transparency and forced-colour fallbacks remove decorative effects.

Overview text, story text and gallery headings share the 35rem reading column. The overview border extends into the side gutter, so its internal padding does not indent its text relative to later sections. Images retain their wider available area and natural sizing.

Gallery navigation is one compact capsule with 44px direction targets and an announced “1 of 8” count. Previous is hidden on the first image and Next on the last. Navigation is bounded rather than circular. If an activated arrow becomes hidden, focus moves to the available direction without scrolling. Keyboard arrows follow the same boundaries; thumbnails remain available.

Repeated row rules were removed from Projects, Writing, Work and Interviews, as well as routine reader subsections/workflow disclosures. Spacing, headings and portraits/images group repeated entries. Main introduction, footer and genuine CV-section boundaries remain. No whole-card hover/click interaction was added.

Validation on November 11, 2026:

- All 15 project readers opened at 319px × 844px without horizontal overflow. Summaries remain 16px and focus begins on the title. Where both headings exist, Outcomes and gallery heading left edges differ by less than 0.3 CSS pixels due to zoom rounding.
- HuddleDex's eight-image gallery checked in both directions. No Previous at image 1, no Next at image 8, no keyboard wraparound, and focus stays on the available control at each endpoint. Its second gallery also starts with only Next.
- Dark desktop and 390px phone overview inspected; light 390px Tone Lab cost comparison expanded without overflow. Writing, Work and Interviews were visually reviewed after divider removal.
- Conservative contrast against the most tinted overview area: dark body 7.60:1 and sage 7.23:1; light body 6.33:1 and sage 6.90:1. Normal-text AA contrast threshold is 4.5:1.
- Local Lighthouse 13.6.0 mobile simulation, Projects with HuddleDex open: performance 98, automated accessibility 100, FCP/LCP 2.0s, CLS 0, total blocking time 0ms. These are local automated results, not a real-device or manual screen-reader certification.
- Build and all 17 launch/navigation checks pass. No browser console warnings or errors recorded. Temporary viewport reset, dark mode restored. No copy, metric, image, prompt or public agent-text changes. Local preview only.

Additional design references: [Carbon static-container guidance](https://www.carbondesignsystem.com/building-blocks/core/components/tile/guidelines) for distinguishing presentation surfaces from actions; [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) for the transparency/blur distinction. The finish deliberately uses a solid surface rather than a live blur layer.


## Revision: product sheet and stable gallery controls

Tyler rejected the inset sage surface and combined navigation capsule. This revision supersedes the panel finish above while preserving the outcomes-first order, text/gallery heading alignment and spacing-based section grouping.

### Direction and references

- [Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials.md) distinguishes navigation/control materials from content surfaces and advises restrained use. The web implementation uses a solid reading surface; translucent material is limited to small controls, with blur behind the modal to establish depth. It is a CSS interpretation, not Apple's native Liquid Glass framework or optical refraction.
- The public [Plaid](https://plaid.com/) and [Navan](https://navan.com/) homepages were visually inspected as references for rounded surfaces, controlled depth and readable foreground content. Their brand colours, assets and page layouts were not copied.
- The [W3C carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) informs native labelled buttons, manual navigation and announced position. This is a design choice for this portfolio, not a universal best carousel style. An older WAI tutorial URL exposed an unapproved draft and was not used as authority.

### Resulting design

The project overview is unboxed and aligned exactly with the story. The reader uses a neutral surface, 24px outer corners, a fine edge, layered shadow and a 7px blurred backdrop on desktop. Mobile remains full-width. It retains solid fallbacks for reduced transparency and forced colours.

Each gallery has a plain position count beside its heading. Below the image and caption, a horizontally scrollable thumbnail strip sits beside two independent 44px circular chevron buttons. The direction buttons occupy fixed grid columns, so showing Previous never moves Next. Previous is absent initially; Next is absent at the end. No autoplay, wraparound, image zoom or full-screen viewer was introduced. Intentional horizontal touch swipes also navigate; vertical gestures, small movements and secondary pointers do not initiate navigation. Native buttons remain the alternative. Selected thumbnails automatically scroll into view.

### Validation, November 11, 2026

- All 15 project readers opened in a 319px × 844px dark viewport. No reader or gallery-footer horizontal overflow; all relevant headings align exactly. Title focus preserved.
- HuddleDex navigated through all eight images and back at 319px. Next retained the same x position, the last selected thumbnail stayed inside its rail, unavailable directions were hidden and focus transferred at the endpoints. Escape returned focus to the project title.
- Tone Lab's cost comparison expanded in 390px light mode without overflow. Its second gallery image, caption, thumbnails and Previous-only state were visually checked. Desktop dark reader and gallery reviewed; temporary viewport reset and dark mode restored. No browser console warnings/errors recorded.
- Three new controller tests cover boundaries/focus, synchronized image/caption/current-thumbnail state and rail visibility, and intentional horizontal versus vertical/small/non-primary gestures. These validate event handling, not a physical iPhone/Safari touch session.
- Build and all 20 launch/navigation/gallery checks pass. Local Lighthouse 13.6.0 mobile simulation: performance 98, automated accessibility 100, LCP 1.8s, CLS 0, total blocking time 10ms. These are local results, not full accessibility certification.
- No project copy, figures, source images, public links, prompts or agent text changed. Preview only; no push or deployment.
