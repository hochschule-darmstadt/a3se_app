# Customer Portal Home Imagery

- Status: accepted for the proof of concept
- Owner: UX and Implementation
- Last reviewed: 2026-09-16

## Scope and authority

This is the authoritative provenance and review record for issue #25's four
synthetic presentation images in VIEW-C-001: one header and the Brazil, Peru,
and Chile quick links. The local files are static portal assets, not catalogue
or seed-data properties. The home route is the only current consumer. This
record does not claim that an image depicts an offered product, accommodation,
supplier, or a specific real place.

The shared presentation contract is [DS-CMP-013](../design-system/design-system.md).
The visible home composition remains governed by VIEW-C-001's
[wireframe](../wireframes/wireframes.md). Requirements terminology is unchanged:
no product-image metadata term is introduced.

## Accepted sources and provenance

All four source images were generated on 2026-09-16 with the Codex built-in
Image Generation service. The service did not expose a model-version identifier;
the tool/service identifier is therefore the recorded provenance rather than an
invented model name. The generated masters are retained as project-controlled
JPEG files under `frontend/apps/customer/public/assets/home/`; responsive files
are deterministic crops and JPEG re-encodes of those masters, not additional
generations.

| Asset ID | Accepted master | Purpose and reviewed alternative text | Prompt reference and selection decision |
|---|---|---|---|
| IMG-C-001 | `hero-master.jpg`, 1792×1024 | Header background; **“Mountain lake and sunlit ridges at dawn.”** | `P-25-H`: wide original South-American/Andean lake scene; dark, low-detail left space for copy; no people, text, brands, landmark claim, or supplier claim. Selected because the left-side copy region and mountain/lake subject survive the three reviewed crops. |
| IMG-C-002 | `brazil-master.jpg`, 1792×1024 | Brazil quick-link; decorative (`alt=""`) because the adjacent button label supplies its accessible name. | `P-25-B`: original Brazilian coastal landscape, rounded granite hills, vegetation and water; no recognizable landmark, people, text, brands, flags, or stereotypes. Selected for a recognisable but non-specific natural scene. |
| IMG-C-003 | `peru-master.jpg`, 1792×1024 | Peru quick-link; decorative (`alt=""`). | `P-25-P`: original Peruvian highland valley, terraced slopes and distant peaks; no famous site, people, text, brands, flags, or stereotyped costume. Selected for legible valley depth at wide and square crops. |
| IMG-C-004 | `chile-master.jpg`, 1792×1024 | Chile quick-link; decorative (`alt=""`). | `P-25-C`: original southern Chilean lake, grasses, granite peaks and distant ice; no real-place claim, people, text, brands, flags, or stereotyped props. Selected for a calm lower label region in both crops. |

The prompt references above are complete constraint summaries. The exact
generation prompts are retained in the issue-work execution history; they used
the `photorealistic-natural` use case, premium natural editorial photography,
and expressly prohibited logos, watermarks, readable text, celebrity likeness,
identifiable people, copyrighted characters, and a claim about a real supplier
or offered location. No input image, inspiration-site content, or third-party
brand was supplied to the generator.

At generation time, use of the output was reviewed against the
[OpenAI Terms of Use](https://openai.com/policies/terms-of-use/), including its
ownership-of-output and user-responsibility provisions. This is a project
provenance record, not legal advice: later publication requires a current terms
review and any required human legal/brand approval.

## Responsive assets and presentation

The local asset directory contains the four masters plus the following browser
renditions. They are JPEGs at quality 82 after a high-quality bicubic crop;
the masters are quality 88 and are not requested by the portal.

| Source | Desktop/tablet/mobile rendition | Runtime selection |
|---|---|---|
| IMG-C-001 | `hero-desktop.jpg` 1728×720; `hero-tablet.jpg` 1280×720; `hero-mobile.jpg` 768×960 | `picture` source at ≤479px, then ≤1023px, otherwise desktop; eager/high priority |
| IMG-C-002 | `brazil-wide.jpg` 960×480; `brazil-square.jpg` 640×640 | square at ≤767px; otherwise wide; lazy |
| IMG-C-003 | `peru-wide.jpg` 960×480; `peru-square.jpg` 640×640 | square at ≤767px; otherwise wide; lazy |
| IMG-C-004 | `chile-wide.jpg` 960×480; `chile-square.jpg` 640×640 | square at ≤767px; otherwise wide; lazy |

`ResponsiveImage` reserves each declared aspect ratio and provides the previous
token-based gradient as a deterministic fallback if an image is missing,
corrupt, or slow. The overlay gradient is separate from the image, preserving
white text and labels without destructively modifying source artwork. The hero
has meaningful alternative text; quick-link images are decorative because the
button's visible country heading remains its accessible name.

## Critical review and evidence

Engineering visual review covered the 1440px desktop source, 768px tablet
source, and 375px mobile source selections. The selected output has no readable
text, watermark, brand, logo, recognizable person, obvious anatomy artifact,
or claim about a real supplier/property. It uses landscapes rather than people
or cultural dress, reducing stereotype risk. The country associations remain
inspirational rather than geographic assertions; imagery must not be used as
factual destination guidance.

Automated route evidence verifies the informative hero alternative, the three
decorative quick-link alternatives, and priority semantics. Static dimensions,
reserved aspect ratios, responsive `picture` selection, lazy quick links, and
the fallback layer are implementation-reviewed. Payload evidence is in
[performance evidence](../../../test/performance-evidence.md). Manual assistive-
technology, browser contrast-ratio, zoom, LCP, and degraded-network checks are
still required before any production accessibility or performance claim.

## Residual risks

- AI-output rights and platform terms can change; publication needs a current
  terms review and human legal/brand approval.
- The generated landscapes are plausible but not authoritative geographic
  representations; accompanying portal content must avoid asserting locations
  or supplier relationships.
- The review is an engineering visual review, not a cultural expert review.
- Browser-based accessibility, contrast, LCP, and network-failure validation
  remain open; the fallback and static checks do not prove those outcomes.

## Links

- [UX overview](../README.md)
- [Design system](../design-system/design-system.md)
- [VIEW-C-001 wireframes](../wireframes/wireframes.md)
- [Non-functional requirements](../../non-functional-requirements.md)
- [Performance evidence](../../../test/performance-evidence.md)
- [Customer asset directory](../../../../frontend/apps/customer/public/assets/home/README.md)
