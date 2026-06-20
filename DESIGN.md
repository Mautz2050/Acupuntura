---
name: Organic Balance
colors:
  surface: '#fbfbe2'
  surface-dim: '#dbdcc3'
  surface-bright: '#fbfbe2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f5dc'
  surface-container: '#efefd7'
  surface-container-high: '#eaead1'
  surface-container-highest: '#e4e4cc'
  on-surface: '#1b1d0e'
  on-surface-variant: '#49473d'
  inverse-surface: '#303221'
  inverse-on-surface: '#f2f2d9'
  outline: '#7a776c'
  outline-variant: '#cbc6b9'
  surface-tint: '#635f40'
  primary: '#635f40'
  on-primary: '#ffffff'
  primary-container: '#b2ac88'
  on-primary-container: '#444024'
  inverse-primary: '#cec7a2'
  secondary: '#9f402d'
  on-secondary: '#ffffff'
  secondary-container: '#fd876f'
  on-secondary-container: '#732010'
  tertiary: '#156874'
  on-tertiary: '#ffffff'
  tertiary-container: '#6fb6c3'
  on-tertiary-container: '#004750'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eae3bc'
  primary-fixed-dim: '#cec7a2'
  on-primary-fixed: '#1f1c04'
  on-primary-fixed-variant: '#4b472b'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#802918'
  tertiary-fixed: '#a7eefc'
  tertiary-fixed-dim: '#8bd2df'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004e59'
  background: '#fbfbe2'
  on-background: '#1b1d0e'
  surface-variant: '#e4e4cc'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 80px
  container-padding: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The brand personality is rooted in the intersection of ancient wisdom and modern clinical precision. It avoids the cliché "zen spa" aesthetic in favor of a sophisticated, editorial-inspired minimalism that feels both organic and highly professional. The target audience seeks holistic wellness through Traditional Chinese Medicine (TCM) and expects an environment that feels grounded, authoritative, and tranquil.

The design style utilizes **Minimalism** with a **Tactile** edge. It leans heavily on generous whitespace to create "breathing room" for the user, reflecting the clarity and flow central to acupuncture. Visuals are characterized by high-quality photography featuring warm natural lighting, soft shadows, and organic textures that evoke a sense of touch and human connection.

## Colors

The palette is a sophisticated "earth-neutral" scheme that grounds the clinical experience in nature. 
- **Sage Green (#B2AC88)** serves as the primary color, used for primary actions and signifying healing and growth.
- **Soft Terracotta (#E2725B)** is the secondary accent, providing warmth and human energy to call-to-actions and highlights.
- **Petroleum Blue (#005F6B)** provides the professional anchor, used for deep contrast in text or structural elements to instill trust and stability.
- **Beige (#F5F5DC)** and its lighter variants form the canvas, replacing stark whites with a softer, more "linen" feel that reduces eye strain and feels premium.

## Typography

The typography strategy employs a classic serif/sans-serif pairing to balance tradition with modernity. **Playfair Display** provides an editorial, authoritative grace for headings, suggesting a high-end clinical practice. **Inter** handles all functional and body copy, ensuring maximum legibility across all digital touchpoints.

Headlines should use tight tracking and generous line heights to feel airy yet intentional. Labels and small navigation elements utilize Inter in uppercase with increased letter spacing to create a clean, modern "wayfinding" feel that contrasts against the fluid nature of the serif headlines.

## Layout & Spacing

This design system uses a **fixed-width grid** for desktop (12 columns, 1140px max-width) and a **fluid layout** for mobile (4 columns). The spacing philosophy is "Luxurious Breathability"—margins and gutters are wider than standard utility apps to lower the user's heart rate and encourage focus.

- **Desktop:** 32px gutters, 80px+ vertical section spacing.
- **Mobile:** 16px gutters, 24px horizontal margins.
- **Rhythm:** All spacing units are multiples of 8px. Use large "stack" values (48px or 64px) between major content groups to maintain an editorial layout feel.

## Elevation & Depth

To maintain a grounded and organic feel, avoid heavy, dark shadows. Instead, use **Tonal Layers** and **Ambient Shadows** to create a subtle sense of surface.

- **Surfaces:** Use slight shifts in background tint (e.g., from `#FBFBF5` to `#F5F5DC`) to differentiate sections.
- **Shadows:** When necessary (e.g., for cards or overlays), use very soft, diffused shadows tinted with the Petroleum Blue (#005F6B) at 5-8% opacity. This makes the shadow feel like a natural part of the environment rather than a digital artifact.
- **Outlines:** Use low-contrast 1px borders in Sage Green (#B2AC88) at 20% opacity for subtle containment without visual clutter.

## Shapes

The shape language is **Soft**. Sharp 90-degree corners are avoided to remain approachable, but high roundedness (pills) is avoided to maintain clinical professionalism. 

- **Primary Radius:** 0.25rem (4px) for inputs and small components.
- **Secondary Radius:** 0.5rem (8px) for cards and modals.
- **Imagery:** Photography should occasionally use large, asymmetrical organic "blob" masks or soft-radius containers to reinforce the "organic" brand pillar.

## Components

### Buttons & Inputs
- **Primary Buttons:** Solid Sage Green with white Inter Medium text. No shadow; use a subtle hover lift.
- **Secondary Buttons:** Ghost style with Petroleum Blue 1px border and text.
- **Inputs:** Underline-only or very soft-bordered fields to keep the UI light. Focus states use a Soft Terracotta underline.

### TCM Service Cards
- Service cards feature a **Fine-line art icon style**. Icons are drawn with 1px Petroleum Blue strokes, depicting botanical elements, acupuncture needles, or anatomical flow.
- Cards use the Beige (#F5F5DC) background with no border; elevation is indicated by a subtle shift to a white background on hover.

### Feedback & Status
- Use Sage Green for success/health indicators.
- Use Soft Terracotta for warnings or gentle reminders.
- Avoid harsh red; if an error occurs, use a desaturated rust tone to maintain the palette's harmony.

### Additional Components
- **Treatment Timeline:** A vertical line-art component for patient care plans.
- **Botanical Dividers:** Subtle line-art illustrations of herbs (e.g., Mugwort or Ginger) used to separate long-form content.