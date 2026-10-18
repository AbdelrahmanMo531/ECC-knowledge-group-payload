# ECC brand system in code

Everything here is traceable to the *ECC Brand Identity Guidelines | 2026*. Page
references are to that PDF.

## Colour (p.12)

| Token | Hex | Meaning in the guideline |
| --- | --- | --- |
| `brand-teal` | `#004442` | Dark Teal — confidence, stability, maturity. The primary brand colour. |
| `brand-turquoise` | `#058E83` | Modern Turquoise — innovation, flexibility, openness to change. |
| `brand-gold` | `#E7DCAA` | Flat Gold — success, elevation, high value. |
| `brand-beige` | `#F9F6E8` | Warm Beige — tranquility, purity, containment. |
| `brand-sand` | `#E4D6C8` | Neutral tone; used for borders and dividers. |
| `brand-ink` | `#333333` | Neutral text colour. |
| `brand-accent` | `#FD7218` | Accent orange. Used sparingly — never as a surface. |

Defined in `src/app/(frontend)/globals.css` under `@theme`. Use the named aliases
(`bg-brand-teal`) in components rather than the numeric `teal-*` ramp; the ramp
exists for hover and tint states only.

### Gradients (p.13)

`bg-brand-gradient-teal` and `bg-brand-gradient-gold` are utilities in
`globals.css`. The teal gradient carries the call-to-action panel; the gold one
is reserved for accents.

## Typography (p.14–16)

- **Somar Sans** — the primary brand face, for everything from headings to body.
- **Frank Ruhl Libre** — the display serif; it is the letterform of the ECC
  wordmark, and is used for pull quotes.
- **Arabic** — Somar Sans carries the Arabic cut. `[lang="ar"]` switches to
  `--font-arabic`.

Neither face is a Google-hosted webfont, so both load as licensed local files:

```
public/fonts/
├── SomarSans-Regular.woff2
├── SomarSans-Medium.woff2
├── SomarSans-Bold.woff2
├── FrankRuhlLibre-Medium.woff2
└── FrankRuhlLibre-Bold.woff2
```

**Drop the licensed `.woff2` files into `public/fonts/` and they take over
automatically** — the `@font-face` rules are already declared. Until then the
stacks fall back to close metric matches, so the build never depends on a font
licence being in place.

## Logo (p.3–8)

`public/brand/` holds nine SVGs, extracted as vector directly from the
guideline PDF — three lockups × three colourways:

| Lockup | Files |
| --- | --- |
| Horizontal | `ecc-logo-horizontal{,-cream,-mono}.svg` |
| Vertical | `ecc-logo-vertical{,-cream,-mono}.svg` |
| Mark only | `ecc-mark{,-cream,-mono}.svg` |

Use the `<Logo />` component rather than the files directly:

```tsx
<Logo />                                    // horizontal, full colour
<Logo variant="cream" height={52} />        // for teal / turquoise grounds
<Logo lockup="mark" height={340} />         // the shield alone
```

Background rules from p.8 are encoded in the variants:

- **Full colour** on white, beige and other light grounds.
- **Cream** (`#F9F6E8`, solid) on dark teal, turquoise and the teal gradient.
- **Mono** (`#333333`, solid) for single-colour contexts.

The horizontal lockup follows the guideline's proportions: mark and wordmark at
equal height, separated by 0.18 × the mark's width.

## Logo pattern (p.17)

`bg-logo-pattern` tiles the mark as a background texture. It is always held at
3–4% opacity behind a solid ground — it reads as tone, never as decoration. Used
on the footer, the partners section and the CTA panel.

## Headings

Section headings follow the brand book's own treatment: bold Somar Sans, with a
short gold rule beneath. `<SectionHeading />` and `<PageHeader />` encode this —
prefer them over hand-rolling a heading.
