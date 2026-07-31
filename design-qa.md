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
