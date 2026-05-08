# BrandSafe CN

BrandSafe CN is a lightweight Chinese social media marketing risk checker for brand safety, platform-sensitive communication, and ethical marketing review. The MVP helps teams review Chinese campaign copy and briefs before publishing on platforms such as Xiaohongshu, Douyin, WeChat Official Account, Weibo, and Bilibili.

The app does **not** generate promotional content. It flags risky phrases, explains why they may be risky, and gives revision guidance without rewriting the full copy.

## Why this MVP is rule-based

This first version is intentionally rule-based so that the scoring system is transparent, beginner-friendly, and easy to audit. Every flagged phrase comes from either a default risk dictionary, a platform-specific rule, or a user-defined custom keyword. This makes the app suitable for a portfolio MVP and for teams that want clear reasoning before adding AI automation.

Future AI modules can be added later for semantic review, trend-aware updates, and deeper contextual analysis, but the current MVP keeps the product simple and explainable.

## Main features

- Large text area for Chinese marketing copy or campaign briefs.
- Platform selection for:
  - Xiaohongshu
  - Douyin
  - WeChat Official Account
  - Weibo
  - Bilibili
- Structured risk report with:
  - Overall risk level: Low, Medium, or High
  - Risk score from 0 to 100
  - Main risk categories detected
  - Platform-specific notes
  - Specific flagged phrases
  - Explanation for each phrase
  - Revision guidance without full-copy rewriting
- Demo cases for skincare, sustainable fashion, nonprofit communication, and Douyin livestream sales.
- Future Features / Product Roadmap section.
- Pricing / Product Vision section with placeholder tiers only.
- Disclaimer: “This tool provides marketing risk analysis and communication guidance. It is not legal advice.”

## Custom dictionary feature

Users can add custom sensitive keywords for each platform. Each custom keyword includes:

- Platform
- Keyword or phrase
- Risk category
- Severity level: Low, Medium, or High

Custom keywords can be deleted and are saved in `localStorage`, so they remain after refreshing the browser. During analysis, BrandSafe CN combines default rules, platform-specific rules, and relevant user-defined platform keywords.

## Risk categories

1. Exaggerated claims
2. Missing ad disclosure or unclear sponsorship
3. Greenwashing or sustainability overclaim
4. Body anxiety, beauty anxiety, or shame-based messaging
5. Gender stereotype or identity-based sensitivity
6. Urgency pressure or manipulative sales language
7. Public opinion backlash risk
8. Platform tone mismatch
9. User-defined platform keyword risk

## Risk scoring logic

The MVP uses a simple additive scoring model:

- Low severity match: 8 points
- Medium severity match: 15 points
- High severity match: 25 points
- Additional category diversity adjustment: 4 points for each extra detected category after the first
- Final score is capped at 100

Risk levels are assigned as follows:

- Low: 0–24
- Medium: 25–59
- High: 60–100

This scoring is not a legal or compliance determination. It is a transparent product heuristic for communication review.

## Future AI and subscription roadmap

Planned future modules include:

- AI semantic risk analysis
- Trend-aware keyword updates from public sources
- Platform policy monitoring
- Team workspace
- Exportable risk report
- Subscription plan placeholder

Product vision tiers:

- Free: rule-based risk detection and custom dictionary
- Pro: AI semantic analysis and trend keyword updates
- Enterprise: team dashboard and brand risk monitoring

No real payment, authentication, database, or complex backend is implemented in this MVP.

## Tech stack

- React
- Tailwind CSS
- Vite
- lucide-react icons
- Browser `localStorage` for custom keyword persistence

## Example use cases

- Reviewing Xiaohongshu skincare seeding posts for exaggerated claims and unclear sponsorship.
- Checking sustainable fashion copy for greenwashing and unsubstantiated environmental claims.
- Reviewing nonprofit campaign language for public sentiment and ethical communication risk.
- Screening Douyin livestream scripts for urgency pressure and price claim risk.

## Getting started

Install dependencies and run the local dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
