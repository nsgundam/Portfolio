# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are startup recruiters, hiring managers, and technical founders
reviewing candidates with limited time. They need to understand Narunat Sutthibut's
engineering strengths, evidence of shipped work, and contact path without decoding
the visual experience.

## Product Purpose

Present Narunat's work as a focused single-page portfolio and make his full-stack,
backend, and real-time systems strengths understandable and memorable. Success means
a visitor can identify his positioning, compare credible project evidence, and reach
him directly.

## Content authority

`PRODUCT.md` is the factual authority for public-facing identity, project claims,
links, and contact paths. The selected visual reference can guide composition, scale,
and atmosphere, but text visible in that image is not approved content by itself.
Future implementation must distinguish owner-confirmed facts, repository evidence, and
open content questions rather than filling gaps from visual inspiration.

## Positioning

Narunat is positioned as a **Full-stack Engineer with backend and real-time systems
strength** who also cares about how software feels to use.

Internal identity line:

> I build real-time systems that feel good to use.

Use this as a decision filter, not as a repeated marketing slogan on the page.

## Operating Context

- One continuous page: Hero, About, Projects, Skills, and Contact.
- Visitors may arrive on desktop or mobile and may jump directly to a section.
- Recruiter comprehension governs the experience: motion may guide attention but
  cannot delay access to factual content.
- The portfolio is intended for startup internship and early-career opportunities.

## Capabilities and Constraints

- React + Vite client-side SPA with semantic section hashes; no router.
- Four portfolio project slots are implemented; two are published and two await
  owner-confirmed evidence.
- Project claims must be backed by owner-confirmed facts or repository evidence.
- Dark mode only.
- Contact channels: email, GitHub, and LinkedIn. Fastwork is intentionally excluded.
- Deployment remains pending until production QA is complete.

## Brand Commitments

- Name: **Narunat Sutthibut**
- Role language: **Software Engineer / Full-stack Developer**
- Tagline: **Aiming high, building what matters.**
- Voice: thoughtful, precise, technically honest, and quietly confident
- The experience may be cinematic, but it must never feel flashy, generic, or
  overclaimed.

## Evidence on Hand

### Project 01 — Boardgame Online: Exploding Kittens

- Configured live link: <https://exploding-kittens-beta.vercel.app/>
- Repository copy describes a real-time multiplayer card game.
- Current portfolio case-study data records Next.js, Socket.IO, PostgreSQL,
  TypeScript, Prisma ORM, and GitHub Actions as repository evidence.
- Any concurrency or latency number must be re-confirmed before final publication.

### Project 02 — TramTracking System

- Configured repository link: <https://github.com/nsgundam/TramTrackingSystem>
- Repository copy describes real-time shuttle tracking with WebSocket and PostGIS.
- Current portfolio case-study data records Next.js, Socket.IO, PostGIS,
  OpenStreetMap, PostgreSQL, and TypeScript as repository evidence.
- Any latency or accuracy number must be re-confirmed before final publication.

### Project 03 — Mini Appointment App

- Name confirmed by the owner on 24 August 2026.
- Outcome, role, system challenge, backend evidence, stack, and links are open.

### Project 04 — Backend LINE LIFF Baanchangsom

- Name confirmed by the owner on 24 August 2026.
- Outcome, role, system challenge, backend evidence, stack, and links are open.

No testimonials, employer endorsements, production usage counts, or independent
benchmarks are currently available. Future work must not fabricate them.

### This portfolio repository

- The current implementation directly evidences React, Vite, TypeScript, GSAP,
  Lenis, React Three Fiber, and Three.js usage.
- Capability presentation may cite this repository explicitly, but it must not turn
  dependency presence into unsupported claims about production scale or mastery.

## Product Principles

- Lead with specific work rather than buzzwords.
- Make backend contribution understandable in under 30 seconds.
- Treat technical honesty as part of the product quality.
- Let motion strengthen continuity without controlling the visitor.
- Keep one direct, accessible path to contact.

## Accessibility & Inclusion

Target WCAG AA text and control contrast, visible keyboard focus, semantic landmarks,
keyboard-operable navigation, a skip link, and `prefers-reduced-motion`. No information
may be available only through animation or pointer hover.
