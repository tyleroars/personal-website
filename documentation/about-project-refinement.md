# About art and project figures

Local preview refinement, November 12, 2026. No release or production deployment.

## Design audit

This is a targeted evolution of a personal portfolio for readers and potential collaborators. Preserve the charcoal canvas `#11151a`, raised navy `#1b2129`, sage accent `#a4d4bc`, existing sans typography and small corner radii. Light mode uses the existing white/sage counterparts. Keep all page slugs, titles, project figures, narrative copy, mascot asset, navigation behaviour and metadata intact. Add only the requested Token Usage entry to About’s exploration links.

The preceding project values were inline sage markers on the same baseline and scale as their descriptions. They had too little hierarchy to read as featured figures. The arch used equal arc pitch and colour by row, which emphasised spokes and separate rainbow bands. Before screenshots are in ignored `outputs/tokens-gallery-review/design-update/`.

`DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 4`: keep the reading layout restrained, allow playful art in its existing position between paragraphs, and keep cursor motion purposeful. This is native CSS/canvas, not an imported design system. The multicolour art is explicitly requested; interface accents remain sage.

## Changes

- The current project layout follows Tyler’s title-first preference. Description and compact, marked value/label pairs follow; multiple stats have a slim separator. One web preview or HuddleDex’s three-screen group sits below, each up to 360px wide. Existing claims and full reader galleries remain. See [project hierarchy study and implementation](project-hierarchy-study.md).
- About includes a working Token Usage row with the same description as the destination page. Its Markdown alternative includes all five exploration links. The first link column accommodates the longer name on small screens.
- The arch now uses ten courses in five staggered pairs, with 115 tiles. The desired line length remains 20 base units. Nearby cell boundaries limit only the length needed to preserve a 1.5-unit gap as lines rotate, allowing closer rows without collisions. Neighbour boundaries are cached on resize. The desktop scene is 400px by 225px; existing smaller scene bounds are retained at mobile breakpoints. Tiles have fixed centres and a continuous left-to-right lavender, blue, mint, gold and coral gradient. Light mode has a darker decorative palette. It is an original renderer, not copied source or assets from the reference.
- The mascot and scene bounds remain fixed during pointer interaction. Cursor tracking now covers the page while the scene is visible, with strength based on distance to the tile field. Influence is full within 28 base units of a tile, fades with a smoothstep curve, and reaches zero at 100 base units. Moving farther away restores the arch through the same springs. Each tile springs independently toward the cursor with a shortest-axis rotation; the old shared, smoothed cursor point is removed. The reference was reviewed visually on [Josh W. Comeau’s homepage](https://www.joshwcomeau.com/), including cursor positions inside and outside the canvas. No claim is made to have reproduced his source code or exact spring constants.
- Existing reduced-motion support, fine-pointer checks and offscreen/hidden-page pausing remain. Animation stops when tile springs settle. Window blur or leaving the document restores the resting arch. Gradients are cached on resize; there are no new dependencies or image downloads.

## Verification

Build, all 31 tests and whitespace validation pass. The current geometry check verifies scene bounds and capsule clearance against every shared cell boundary across 180 line-axis angles at four viewport sizes. Complete capsules remain on their own side of each boundary with half the required gap, so neighbouring lines remain separated even when their rotations differ. A range test checks full, half and zero cursor influence. A separate spring test checks the equivalent 180-degree line axis, the shortest rotation across an axis boundary, and settling without perpetual animation.

Browser QA checked desktop dark/light project panels and 319px layouts. All eight project result groups fit their containers without overflow, including the longer award and currency values. About fits at 319px; the Token Usage row navigates to `/tokens` and the correct heading. Scene and mascot bounding boxes are identical before and after cursor interaction. Art was observed responding to cursor positions inside the canvas and on the heading outside it. The 319px project figures were reviewed in both themes, with no overflowing callouts. Temporary viewport overrides were reset and dark mode restored. No browser warnings/errors were reported.

This change adds no runtime fetching and preserves the static HTML, source text, metadata and existing URL structure. No production performance claim is made from the local preview.

The latest project hierarchy research is separate from the implemented callouts: see [project entry hierarchy study](project-hierarchy-study.md). Tyler subsequently asked to see the recommended component; its preview implementation is described there.

Latest density/reset QA: the denser 400px by 225px scene was reviewed in the real browser, including 319px mobile and both themes. The mascot bounds remained identical for near/far cursor positions. Moving to the heading outside the influence radius restored the arch: the settled screenshot differed from a fresh static rest capture by about 0.123 average channel units on a 0–255 scale over the scene crop, versus a visibly changed near-cursor pose. The initial capture was affected by the first-visit intro, so it was not used as the resting reference. Viewport overrides were reset and dark mode restored. No browser warnings/errors were reported.
