# design.md

# Digital Book Experience Design System

## Design Philosophy

This project follows the philosophy of **"Less, but Better."**

Every element exists for a purpose.

Animations support the user experience rather than distract from it.

The website should feel calm, premium, elegant, and timeless.

The browsing experience should resemble reading a modern digital book.

---

# Design Principles

## Simplicity

Keep every page clean.

Avoid unnecessary UI elements.

One primary focus per section.

---

## Storytelling

Scrolling should tell a story.

Every section is a chapter.

Every interaction has meaning.

---

## Whitespace

Use generous spacing.

Never overcrowd the interface.

Content should breathe.

---

## Motion

Motion should communicate.

Never animate without purpose.

Animations must remain under approximately 600–800 ms for standard interactions.

Respect users who prefer reduced motion.

---

# Visual Identity

## Theme

Digital Book Experience

Modern Library

Editorial Layout

Premium Reading Experience

---

# Color System

Primary

Forest Green

#1E5631

Secondary

Warm Paper

#F5F1E8

Accent

Classic Gold

#C8A96A

Background

#FFFFFF

Surface

#FAFAF8

Text Primary

#1F2937

Text Secondary

#6B7280

Border

#E5E7EB

Success

#16A34A

Warning

#F59E0B

Danger

#DC2626

---

# Typography

Heading

Poppins

Body

Inter

Editorial Heading

Playfair Display

Use large typography.

Avoid small unreadable text.

---

# Border Radius

Cards

20px

Buttons

999px

Input

14px

Images

24px

---

# Shadows

Soft shadows only.

Avoid heavy shadows.

---

# Layout

Maximum Width

1440px

Content Width

1200px

Section Padding

120px Desktop

80px Tablet

60px Mobile

---

# Components

## Navbar

Transparent initially.

Solid background on scroll.

Sticky.

Glass effect (optional).

---

## Hero

Large illustration.

Book visualization.

Big typography.

Clear CTA.

---

## Cards

Rounded.

Soft hover.

Lift slightly.

Smooth shadow.

---

## Buttons

Primary

Green background.

Secondary

White outline.

Ghost

Transparent.

---

## Gallery

Large images.

Rounded corners.

Masonry grid.

---

## FAQ

Accordion.

Minimal.

Easy to scan.

---

## Footer

Minimal.

Large spacing.

Three-column layout.

---

# Animation Guidelines

Library

Anime.js

Animation Style

Elegant

Natural

Minimal

Smooth

Editorial

Motion Rules

No excessive bouncing.

No distracting effects.

Use easing functions.

Maintain 60 FPS whenever possible.

Animate opacity, transform, and scale before layout properties.

---

# Scroll Experience

Reveal sections progressively.

Create a chapter-like reading flow.

Smooth page transitions.

---

# Accessibility

Minimum contrast ratio WCAG AA.

Keyboard navigable.

Visible focus states.

Alt text for images.

Reduced motion support.

Semantic HTML.

---

# Responsive Breakpoints

Mobile

<768px

Tablet

768–1023px

Laptop

1024–1439px

Desktop

1440px+

---

# Image Style

Natural lighting.

Real library environments.

Students reading.

Bookshelves.

Community activities.

No generic corporate stock-photo feeling.

---

# Icon Style

Lucide Icons

Outline style

Consistent sizing

24px standard

---

# Development Rules

* Build with reusable React components.
* Keep each component focused on a single responsibility.
* Use consistent spacing tokens.
* Avoid hardcoded colors.
* Centralize design tokens.
* Prefer CSS variables for colors and spacing.
* Optimize images and lazy-load media.
* Ensure all animations degrade gracefully on low-end devices.

---

# Overall Feeling

The website should evoke the feeling of:

Opening a beautiful book.

Walking into a quiet modern library.

Feeling curious.

Feeling welcomed.

Feeling inspired to learn.

Every interaction should reinforce those emotions while maintaining a professional, accessible, and high-performance user experience.
