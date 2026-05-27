# AI Agent Instruction: Next.js & Shadcn UI Development for "Harga Telur Indonesia"

**Role:** You are an Expert Next.js Developer and SEO Specialist. Your task is to build a highly optimized, AdSense-ready information website based on the specifications below.

**Context:** The client ("Harga Telur Indonesia") previously had a poorly optimized WordPress site that failed Google AdSense due to "Low Value Content" and technical SEO errors (slow speed, bad routing, missing meta tags). You must build a replacement system using modern web technologies to ensure a perfect SEO score.

---

## 1. Tech Stack & Architecture
* **Framework:** Next.js (App Router, TypeScript).
* **Styling:** Tailwind CSS.
* **UI Components:** Shadcn UI (specifically `Card`, `Button`, and basic layout components).
* **Hosting Target:** Vercel (Serverless).
* **Database (Future-proofing):** Prepare structures for Prisma ORM integration.

---

## 2. SEO & AdSense Requirements (CRITICAL)

The website MUST strictly adhere to these SEO rules to pass AdSense:

### 2.1. Global Metadata (`app/layout.tsx`)
* Implement Next.js `Metadata` object.
* **Title:** Default to "Update Harga Telur & Ayam Ras Hari Ini", with a template `%s | Harga Telur Indonesia`.
* **Description:** Must be ~150 characters, containing primary keywords ("harga telur", "ayam ras", "peternak").
* **Canonical Links:** Explicitly set canonical URLs to prevent `www` vs `non-www` duplicate content issues.
* **OpenGraph & Twitter Cards:** Fully configured for social sharing.

### 2.2. Page Structure (`app/page.tsx`)
* **Semantic HTML:** Must use `<main>`, `<article>`, `<section>`, and `<header>`.
* **Heading Hierarchy:**
    * Strictly ONE `<h1>` per page (e.g., "Update Harga Telur Ayam Hari Ini").
    * Logical use of `<h2>` and `<h3>` without skipping levels. No duplicate heading texts.
* **Content Length (AdSense Rule):** The homepage must have substantive text content (minimum 600 words) surrounding the price data. Do not just display data tables/cards. Include narrative paragraphs about market trends, factors affecting egg prices, and regional differences (e.g., Blitar vs. Jakarta).
* **Linking Strategy:**
    * **Internal Links:** At least one link pointing to another page on the site (e.g., `<a href="/kontak">Kontak Kami</a>`).
    * **External Links:** At least one DoFollow link pointing to a high-authority external resource (e.g., Ministry of Agriculture or central statistics agency).

### 2.3. Schema Markup (Rich Snippets)
* Inject `JSON-LD` structured data in the `<head>` of the page (using Next.js `script` tag with `dangerouslySetInnerHTML`).
* Use `@type: "WebPage"` and optionally `Dataset` or `Table` schemas for the pricing data to ensure it appears in Google Search rich results.

---

## 3. UI/UX Specifications

### 3.1. Hero Section
* A clean, modern hero section containing the `<h1>` and a brief introductory paragraph.
* Include a primary Call-to-Action (CTA) button (Shadcn `Button`).

### 3.2. Data Display (The Core Feature)
* Use Shadcn `Card` components to display regional prices.
* **Card Anatomy:**
    * `CardHeader` / `CardTitle`: Region Name (e.g., "Blitar").
    * `CardDescription`: Last updated date.
    * `CardContent`: Large, bold typography for the price formatted in IDR (Rupiah). Include a trend indicator (e.g., text color changing based on 'up', 'down', or 'stable' trends).
* The cards should be arranged in a responsive CSS Grid (1 column on mobile, 2 on tablet, 3 on desktop).

---

## 4. Required Output from AI Agent
When prompted to generate code, provide complete, production-ready files for:
1.  `app/layout.tsx` (Global SEO & Layout)
2.  `app/page.tsx` (Homepage with Semantic HTML, 600+ word content, and JSON-LD)
3.  `components/PriceCard.tsx` (Shadcn UI implementation for data display)