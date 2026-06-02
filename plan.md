# Hero Section  Sprint 5 Step 03+Redesign

## Requested Changes

1. Remove `labelRef` ("Full Stack Developer" label)
2. Position name (`Narunat Sutthibut`) where the label was
3. Move tagline up
4. Add 2 CTA buttons: "Contact" and "Explore Work"
5. Update fonts per DEC-012 (font-display for name, font-label for labels)

## Implementation Plan

### Phase 1: Update Tokens (index.css + index.html)

- Add Cormorant Garamond to Google Fonts in index.html
- Update index.css with Sprint 5 tokens:
- Add `--font-display: "Cormorant Garamond", Georgia, serif;`
- Rename `--font-heading` to `--font-label`
- Update palette: warm gold (#C4A97D), adjust all colors per DEC-011
- Update h1-h6 rule to use `font-display` instead of `font-heading`

### Phase 2: Update Hero Component

- Remove labelRef and label element
- Move name to top position (where label was)
- Use font-display for name (Cormorant Garamond)
- Move tagline up below name
- Add CTA button group below tagline
 smooth scroll to #contact
 smooth scroll to #projects
- Preserve all animation logic (Splitting, Flip, char reveal)
- Ensure ScrollIndicator remains at bottom

### Phase 3: Verify

- Test responsive behavior (mobile, tablet, desktop)
- Run ESLint
- Test animations in dev server
