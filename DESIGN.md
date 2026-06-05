---
name: Pulse Soft Kawaii
colors:
  surface: '#fdf7ff'
  surface-dim: '#dfd6ef'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f1ff'
  surface-container: '#f3eaff'
  surface-container-high: '#eee4fd'
  surface-container-highest: '#e8def8'
  on-surface: '#1e192b'
  on-surface-variant: '#56423d'
  inverse-surface: '#332d40'
  inverse-on-surface: '#f6eeff'
  outline: '#89726b'
  outline-variant: '#dcc0b9'
  surface-tint: '#9e4225'
  primary: '#9e4225'
  on-primary: '#ffffff'
  primary-container: '#ff8c69'
  on-primary-container: '#752409'
  inverse-primary: '#ffb59f'
  secondary: '#645591'
  on-secondary: '#ffffff'
  secondary-container: '#cbbafd'
  on-secondary-container: '#564782'
  tertiary: '#416656'
  on-tertiary: '#ffffff'
  tertiary-container: '#8db4a2'
  on-tertiary-container: '#214638'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb59f'
  on-primary-fixed: '#3a0a00'
  on-primary-fixed-variant: '#7e2b10'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#200f49'
  on-secondary-fixed-variant: '#4c3d77'
  tertiary-fixed: '#c3ecd8'
  tertiary-fixed-dim: '#a7cfbc'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#294e3f'
  background: '#fdf7ff'
  on-background: '#1e192b'
  surface-variant: '#e8def8'
typography:
  display:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 24px
  margin-desktop: 64px
  gutter: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for this wellness companion is built on the principles of emotional safety and gentle encouragement. The brand personality is "hand-warmed"—avoiding the cold precision of typical health apps in favor of a playful, tactile, and nurturing aesthetic. The goal is to evoke a sense of calm and accessibility, making the daily habit of wellness tracking feel like a moment of self-care rather than a chore.

The visual style is a blend of **Soft Minimalism** and **Tactile Playfulness**. It utilizes generous whitespace (breathing room), ultra-rounded geometry, and a color palette that feels organic and soothing. Every interaction should feel soft and low-friction, reducing cognitive load for users who may be feeling stressed or overwhelmed.

## Colors
The palette is rooted in a warm, inviting cream base to avoid the sterile "clinical white" of traditional medical apps. 

- **Primary (Warm Coral):** Reserved for the most important calls to action and active states. It provides a burst of energy without being aggressive.
- **Accents (Lavender, Mint, Peach):** Used for categorization, mood indicators, and secondary UI elements to keep the interface feeling diverse and cheerful.
- **Text (Soft Charcoal):** A high-contrast but softened dark tone that ensures legibility while maintaining the "hand-warmed" feel of the system.

## Typography
The typography utilizes rounded geometric sans-serifs to reinforce the friendly brand personality. 

**Quicksand** is used for headings and labels to provide a distinctive, approachable character with its noticeably rounded terminals. **Nunito Sans** is employed for body text to ensure high readability and a clean look while maintaining the overall soft aesthetic. All type should be set with generous line heights to contribute to the "breathing room" required by the design narrative.

## Layout & Spacing
This design system follows a **Fluid Grid** model with significantly larger-than-standard margins to create a sense of focus and calm. 

- **Breathing Room:** Internal card padding should never drop below 24px. 
- **Vertical Rhythm:** Use a 8px baseline grid, but prefer larger jumps (24px, 48px) between sections to prevent the UI from feeling cluttered.
- **Mobile First:** On mobile, content should be contained within a single column with 24px side margins. On desktop, content should be centered in a max-width container (1200px) with fluid outer margins.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Soft Ambient Shadows**. 

Instead of harsh borders or high-elevation shadows, this system uses "Deep Soft Shadows"—shadows with a very large blur radius (30px-40px) and low opacity (8-12%), often tinted with a hint of the secondary color (Lavender) to keep them from looking muddy. 

Cards should appear to float just slightly above the Warm Cream background. For interactive elements like buttons, a slight "pressed" neomorphic-lite effect or a decrease in shadow spread can be used to indicate a physical click.

## Shapes
Shapes are the cornerstone of the "Soft Kawaii" aesthetic. 

The system uses a signature **28px corner radius** for all primary containers and cards. Buttons are typically full-pill shaped to maximize the tactile, friendly feel. There are no sharp corners in the entire design system; even progress bars and input focus states must utilize the maximum possible rounding for their height.

## Components

- **Primary Buttons:** High-contrast Warm Coral background with white or Soft Charcoal text. They must be pill-shaped with a minimum height of 56px to feel "squishy" and tappable.
- **Soft Cards:** White or slightly tinted (#FFF) backgrounds with 28px corners and deep ambient shadows. Use these for all content modules.
- **Mood Scale:** A horizontal track featuring oversized, custom-illustrated emojis. The selected state should scale the emoji up and apply a Soft Lavender glow.
- **Input Fields:** Thick 2px borders in a very light Peach or Mint, with 16px internal padding and fully rounded corners.
- **Chips/Tags:** Used for activity tracking (e.g., "Yoga," "Sleep"). These should be small pills in pastel tints with Soft Charcoal text.
- **Progress Hoops:** Use thick, rounded-cap strokes instead of thin lines to represent daily goals, emphasizing a "full" and "soft" visual weight.