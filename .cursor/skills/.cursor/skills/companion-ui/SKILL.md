---
name: companion-ui
description: Use when building or restyling any UI. Defines the kawaii visual system and the swappable character-state pattern so screens stay on-brand and decoupled from the art assets.
paths:
  - "**/*.tsx"
  - "**/*.css"
---

# Companion UI system

## Aesthetic
- Soft, kawaii, calming. Rounded-2xl/3xl, generous padding, big friendly buttons.
- Pastel palette: warm cream background, soft lavender/mint/peach accents, one cozy accent for CTAs.
- The character is big, centered, and the emotional focus of every screen. Gentle motion only (fade/scale/bob).

## Character-state pattern (IMPORTANT — protects the art handoff)
- Render the creature through ONE component: `<CharacterSprite state={state} />`.
- `state` is one of: idle | happy | content | sleepy | sad | celebrating | activity.
- Each state maps to `/public/pet/<state>.png`. Until real art lands, fall back to a big emoji per state so the app works NOW.
- Never hardcode the creature anywhere else — always go through CharacterSprite.

## Mood faces
- 5 moods, rough→great, as large tappable emoji buttons: 🥺 😕 😐 🙂 🤩 → rough | low | okay | good | great