# Larger journal labels and independent reading

Date: 2026-10-22

The letter buttons in the journal used 14 px text on desktop and 12 px under
the touch layout. They now use 24 px on desktop and 22 px below 700 px, with
darker text and wrapping. Completed scene titles use 22 / 20 px, the objective
28 / 24 px, and the return button 22 / 20 px. The journal uses the existing
640 px wide dialog, retaining its height limit and vertical scrolling.
Opening focuses its heading so a long journal starts at the current objective.

Removed all built-in text narration: dialogue, document and journal buttons,
speech synthesis module, sound icon, lifecycle hooks and reading action.
R and pad X retain only furniture rotation through an explicitly named
`rotate` action; pad Y still opens the journal. Updated the controls guide,
architecture, brief and acceptance criteria to require independent reading.

`npm run check` passed all 56 tests, content validation, TypeScript, production
build and production module startup. The reading flow tests check dialogue,
journal and letter controls and verify that rotation shortcuts do not change
the displayed reading text. The existing housing test verifies rotation and
placement still work. Source search found no remaining speech synthesis,
listening handlers or sound buttons in `src`.
