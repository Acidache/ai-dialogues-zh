# Inline Comments Design QA

- Source visual truth:
  - `/var/folders/s1/g1nnmdg14_qdg24250kzkkr40000gn/T/codex-clipboard-c98f0118-ad85-4f41-919e-e6512103af7c.png`
  - `/var/folders/s1/g1nnmdg14_qdg24250kzkkr40000gn/T/codex-clipboard-ee84de4a-f332-4e00-8431-f82d23dc845f.png`
- Implementation screenshots:
  - `/Users/mapf/个人/生活inAI/ai-dialogues-zh/qa-implementation-desktop.png`
  - `/Users/mapf/个人/生活inAI/ai-dialogues-zh/qa-implementation-mobile.png`
- Combined comparison: `/private/tmp/qa-comparison-rendered.png`
- Desktop viewport: 1280 × 720 CSS px, device scale factor 1.
- Mobile viewport: 390 × 844 CSS px, device scale factor 1.
- State: first dialogue bubble selected; giscus thread displayed in the inline review surface.

## Full-view comparison evidence

The source shows a page-level modal covering most of the article and a fixed narrow 420 px dialogue column. The implementation keeps the article visible, expands the reading column to 900 px when comments are closed, and switches to an approximately 2:1 article/comment grid when an inline thread is selected. At 390 px, the comment experience becomes a bottom drawer with no horizontal overflow.

## Focused-region comparison evidence

The comparison focuses on the two requested regions: the desktop reading/comment split and the mobile comment surface. Additional focused crops were unnecessary because the change preserves the existing message bubbles, metadata block, navigation, palette, and typography rather than restyling them.

## Findings

- No P0, P1, or P2 differences remain against the requested interaction.
- Fonts and typography: existing system font stack, bubble hierarchy, and giscus typography remain readable; panel labels use the same weight and green accent system.
- Spacing and layout rhythm: desktop uses a 2/3 + 1/3 split; closed reading width is 900 px; mobile uses a fixed bottom drawer and preserves a 390 px page width without overflow.
- Colors and visual tokens: charcoal header, warm gray canvas, white surfaces, and archive green are preserved.
- Image quality and asset fidelity: no new raster or decorative assets were required for this interaction.
- Copy and content: each message exposes a numbered accessible comment control; the selected bubble is quoted in the panel; the page-level section is labeled “整篇留言”.

## Primary interactions tested

- Open an inline comment from the first message.
- Switch the giscus thread to a message-specific term.
- Close the side panel and return the same giscus instance to the whole-article section.
- Use the header “参与讨论” control to scroll to “整篇留言” without opening a modal.
- Verify 18, 14, and 34 message comment controls on Issues 01, 02, and 03.
- Verify the mobile comment drawer at 390 × 844.
- Check browser logs; only the expected giscus “discussion not found” warning appears for new, not-yet-created threads.

## Comparison history

1. Initial implementation loaded a second giscus script in the side panel. The panel remained blank because only the existing page-level iframe initialized reliably.
2. Fixed by moving one giscus instance between the whole-article host and the selected inline thread, then switching its `specific` term through the supported message configuration.
3. Post-fix evidence shows the editor, replies surface, reaction count, and GitHub login control rendered in both desktop and mobile inline states.

## Follow-up polish

- P3: zero-count comment pills intentionally remain low contrast until hover or focus so they do not compete with the conversation.

final result: passed

---

# Unified Issue Header Design QA

- Source visual truth: `/var/folders/s1/g1nnmdg14_qdg24250kzkkr40000gn/T/codex-clipboard-822ce0de-8c71-440e-811e-ec716d21a772.png`
- Implementation screenshot: `/Users/mapf/个人/生活inAI/ai-dialogues-zh/qa-unified-header-desktop.png`
- Combined comparison: `/Users/mapf/个人/生活inAI/ai-dialogues-zh/qa-unified-header-comparison.png`
- Source pixels: 1830 × 270.
- Implementation pixels: 1280 × 720; desktop viewport 1280 × 720 CSS px, device scale factor 1.
- State: page top, comments closed.

## Full-view comparison evidence

The source and implementation use the same charcoal 52 px sticky header, three-part navigation structure, white text, centered issue/model label, and edge-aligned navigation actions. The implementation intentionally inherits the archive’s 900 px reading container, so its physical width is narrower than the cropped source screenshot while preserving the same internal proportions.

## Focused-region comparison evidence

The combined comparison isolates the header and the metadata region immediately below it. A further crop was unnecessary because all changed elements are fully readable in this region.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: all three pages share identical sizes, weights, truncation behavior, and Chinese system-font fallbacks.
- Spacing and layout rhythm: all three headers measure 900 × 52 CSS px at the desktop test viewport; their left, center, and right tracks align consistently.
- Colors and visual tokens: the reference charcoal `#2b2b2b` and white foreground are shared across all three pages.
- Image quality and asset fidelity: the header contains no raster image assets or non-standard icons.
- Copy and content: the three pages use “← 全部对话”, “第 01/02/03 期 · 腾讯元宝”, and “参与讨论”.

## Primary interactions tested

- Verified all three pages render the shared header without horizontal overflow.
- Verified “参与讨论” still routes to the bottom whole-article discussion and does not restore the legacy modal.
- Verified the existing inline comment and responsive reading layout remain loaded.

## Comparison history

1. Before the change, Issues 01 and 02 used different header class names, labels, positioning, and optional reading-progress markup.
2. Replaced all three with one shared header component and shared stylesheet rules.
3. Post-fix measurements show identical 52 px height, 900 px width, three-track alignment, and no overflow on all three pages.

final result: passed
