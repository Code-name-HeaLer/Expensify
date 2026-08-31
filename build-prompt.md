## 0. HOW WE ARE GOING TO WORK TOGETHER (read this first, obey it for the entire project)

You are helping me build a personal finance / expense tracker app. This is a **long, multi-session build**, so you must follow these working rules exactly, every single time, without me having to repeat them:

1. **Before writing any code at all**, explain back to me — in your own words, not copy-pasted — every feature and design rule in this document, organized by section, so we can confirm we are on the same page before anything gets built. Do this first. Wait for my explicit "yes, go ahead" before writing any code.
2. **We build in stages.** You will generate a maximum of **2–3 files per step**. After each step, stop and wait for me to confirm the files work in my app (tested live via Expo Go) before you move to the next step. Do not jump ahead, do not pre-generate future features "while you're at it," and do not combine multiple stages into one response even if it seems efficient.
3. **Extreme modularity is non-negotiable.** Every individual feature/component/screen lives in its **own file**. No file should try to do multiple unrelated things. If a `.tsx` file is getting long (rough guideline: over ~150–200 lines), that's a signal it's doing too much — stop and split it into smaller pieces (e.g., split UI from logic via a hook, split a screen into subcomponents) before continuing.
4. **Every file must be self-contained and independently testable.** When you generate a feature, I should be able to drop it into the app and immediately see/interact with it in Expo Go — not have it depend on four other unfinished files to render anything.
5. **Never hallucinate a library, API, or file that doesn't exist.** If you are not certain a package, function, or Expo/React Native API works the way you're about to describe, say so explicitly and ask me, rather than inventing it. If you reference a file we created earlier, use its exact name and path — don't rename things mid-project.
6. **Always re-state which stage/step we're on** at the start of your response (e.g., "Stage 2, Step 3: Category picker component") so we never lose track of where we are in the build order below.
7. **If I ask for something that contradicts this document**, point out the contradiction and ask which one wins, rather than silently picking one.
8. **Do not add features that aren't in this document** without asking first — no scope creep, no "I also added a bonus feature" surprises.

---

## 1. PRODUCT VISION

A **dark mode, minimalist, extremely functional** personal expense tracker — built by me, for me, in **React Native + Expo**, styled with **Tailwind via NativeWind**, tested live in **Expo Go** on my phone during development.

Design philosophy: **legible density over decoration.** This is an app I will open every single day, so it earns its keep by being fast to scan and fast to log an expense in — not by looking impressive once. Numbers are the hero. Every screen should answer "where did my money go" and "what can I still spend today" in under 2 seconds of looking at it.

Core differentiator vs. commercial apps: since I own this app end-to-end, I get automation (SMS-based auto-logging for UPI/bank debits, receipt OCR) **without** handing my bank credentials to a third party the way Rocket Money/Copilot/Monarch require. Manual entry must be fast and reliable as the core; automation is a bonus accelerant layered on top, never a dependency.

---

## 2. COMPLETE FEATURE LIST

Explain each of these back to me before we start. This is organized by build priority tier — we will build Tier 1 fully before touching Tier 2, and so on, following the Build Order in Section 5.

### TIER 1 — Core (nothing works without these)

- **Sub-5-second expense entry**: floating "+" button opens a bottom sheet → numeric keypad appears immediately → horizontal scroll of category icon chips (not a dropdown) → amount → category → done, in 3 taps.
- **Manual accounts/buckets**: cash, each bank account, each card, each UPI-linked account, tracked as separate balances that can be toggled on/off in reports.
- **Custom categories** with icon + color per category (not just hardcoded presets) — food, transport, bills, rent, EMI, entertainment, health, shopping, subscriptions, misc, and user-addable beyond that.
- **Recurring/scheduled transactions** — rent, EMI, subscriptions auto-populate as a draft on their due date so they don't need re-typing every month.
- **Home dashboard**: this month's total spend, remaining budget, a spending trend sparkline, top 3 categories — all visible without scrolling, for the daily glance-and-close use case.
- **Transaction search & filter**: by category, date range, account, amount range, and tags.

### TIER 2 — Automation (effortless-feeling)

- **SMS/notification parsing (Android only)**: read bank/UPI debit SMS and pre-fill a draft transaction for one-tap confirm. This is the single biggest lever for daily UPI-heavy spending in India. Requires an **Expo dev build**, not Expo Go, once implemented (native permissions aren't available in Expo Go) — flag this clearly when we get here.
- **Receipt scanning (OCR)** for larger/rarer purchases, using the camera + on-device or cloud text recognition.
- **Voice entry** — speak an expense ("two hundred fifty on groceries") and have it parsed into amount + category.
- **Auto-categorization that learns**: a lightweight on-device rule engine mapping merchant string → category, refined every time I correct a mis-categorized transaction.
- **Subscription/recurring-charge radar**: scan logged transactions for repeating merchant+amount patterns and surface a "still using this?" nudge for charges that look like forgotten subscriptions.

### TIER 3 — Budgeting & insight

- **Envelope-style monthly budgets per category** — set a cap per category, show a progress bar, warn before the cap is blown.
- **"Safe to spend today" number** — calculated as (remaining monthly budget ÷ days left in month), shown prominently on the dashboard. This is the single highest-leverage behavior-change feature — prioritize getting this right.
- **Monthly/weekly spend reports**: category breakdown (pie/bar chart) + trend line over multiple months.
- **Net worth / savings tracking** (simple): total across all accounts, trend over time.
- **Month-in-review / year-in-review card**: a recap summary ("You spent most on food, 18% more than last month") that turns raw numbers into a short narrative.

### TIER 4 — Engagement (make me _want_ to open it)

- **Logging streaks**: consecutive days with at least one logged expense — a habit-loop mechanic, not a spending-amount goal.
- **Light achievements**: e.g. "First month under budget," "30-day logging streak," "Cancelled 2 unused subscriptions." Keep this restrained — a light touch, never the core mechanic, never patronizing.
- **Micro-interactions with restraint**: a subtle haptic + checkmark animation on successful logging, a gentle progress-bar fill on hitting a savings goal. No confetti, no bouncy over-the-top animation — short (150–250ms), purposeful, spring-based transitions only.
- **Smart proactive nudges**: at most one contextual insight per day (e.g., "discretionary spend is already high this week and rent is due today") — never more than one per day, never naggy.
- **Home-screen widget**: today's spend / remaining budget visible without opening the app.

### TIER 5 — Later / v2 (do not build until explicitly told to)

- Multi-currency support
- Bill-splitting with friends
- CSV/Excel export
- Cross-device cloud sync (Supabase/Firebase)
- Financial goals tracker with visual progress (e.g., saving for a laptop)

---

## 3. DESIGN SYSTEM (apply consistently to every screen/component, no exceptions)

### Color palette (dark mode)

- **Background**: near-black, NOT pure `#000000` (causes OLED glare/halation with white text) — use something in the `#0B0D10`–`#111418` range.
- **Surface/cards**: one or two steps lighter than background (`#16191E`–`#1C2026`) to create depth without needing borders.
- **Primary accent**: exactly ONE vivid accent color, used sparingly — CTAs, the "+" button, active states only. Not decoration everywhere.
- **Semantic colors**: green for income/under-budget, a warm coral/red (not harsh pure red — that reads as an error state) for overspend, amber for approaching-limit warnings.
- **Text**: primary text near-white (`#F5F6F7`, not pure white), secondary/muted text mid-gray (`#8A8F98`) for timestamps/helper copy.
- **Category colors**: each category gets a distinct muted hue, used consistently everywhere it appears (dashboard chart, transaction list, budget bars) so categories are recognizable at a glance without reading the label.

### Typography

- One geometric/humanist sans-serif throughout (Inter or Manrope).
- **Tabular figures required** for all monetary amounts so columns of numbers align vertically.
- Hero numbers (today's spend, budget remaining) large and bold (32–40px); everything else restrained (13–15px body text).
- Currency formatting: ₹ symbol, Indian digit grouping (₹1,23,456 — not ₹123,456).

### Layout & interaction patterns

- **Bottom tab bar**, max 4–5 items: Home, Transactions, Budgets, Insights, plus a floating "+" action button overlapping the tab bar for quick-add.
- **Bottom sheets, not full-screen modals**, for quick actions (add expense, edit category, filter) — keeps context visible.
- **Swipeable transaction cards**: swipe left to delete, swipe right to edit/re-categorize — avoid making the user tap into a detail screen for common actions.
- **Card-based grouping**: transaction lists grouped by day, with a running daily total header per group.
- **Progressive disclosure**: home screen shows conclusions (safe-to-spend, % of budget used); tapping in reveals underlying detail. Don't cram every number onto one screen.
- **Motion**: 150–250ms transitions, spring-based for sheets, no bounce/overshoot easing. Micro-haptics on log/complete actions only.

---

## 4. TECHNICAL ARCHITECTURE RULES

- **Framework**: React Native + Expo, tested live via Expo Go during development (until Tier 2 SMS parsing requires a dev build — call this out explicitly when we get there).
- **Styling**: NativeWind (Tailwind for React Native). Define the full dark palette above as custom Tailwind theme tokens **once**, in a single config file, and reference those tokens everywhere — never hardcode hex values inline in components.
- **Charts**: Victory Native (Skia-based rendering, GPU-accelerated, works well with Reanimated + Gesture Handler for interactive tooltips).
- **Animation**: `react-native-reanimated` + `react-native-gesture-handler`.
- **Bottom sheets**: `@gorhom/bottom-sheet`.
- **Local storage**: `expo-sqlite`, offline-first — no backend/cloud dependency for Tier 1–4. Cloud sync is Tier 5 only, and optional even then.
- **Icons**: `lucide-react-native`.
- **Haptics**: `expo-haptics`.
- **SMS parsing** (Tier 2, Android only): requires `expo-dev-client` — flag this dependency change clearly before we start that stage, since it changes how we test (can no longer use plain Expo Go).

### File/folder structure rules

- One feature = one file. One component = one file. Do not combine unrelated logic into a single file for convenience.
- Suggested structure (adjust as needed, but keep this shape):
  ```
  /app                    → screens (one file per screen)
  /components
    /transactions          → TransactionCard.tsx, TransactionList.tsx, etc.
    /budgets
    /dashboard
    /shared                → truly generic, reused UI atoms (Button, Chip, etc.)
  /hooks                   → one hook per file, logic extracted out of UI files
  /lib                     → db access, categorization engine, date/currency utils
  /constants                → theme tokens, category defaults
  /types                   → shared TypeScript types
  ```
- Any file exceeding ~150–200 lines should be flagged and split before we continue, not left to grow.
- Every new file must include a one-line comment at the top stating what it does and which stage/tier it belongs to.

---

## 5. BUILD ORDER — follow this exactly, 2–3 files per step, confirm before advancing

**Stage 0**: Explain this entire document back to me. Wait for confirmation.

**Stage 1 — Foundation**

1. Tailwind/NativeWind theme config (colors, typography tokens) + SQLite schema (transactions, categories, accounts, budgets tables)
2. Bottom tab navigation shell (empty placeholder screens for Home, Transactions, Budgets, Insights)

**Stage 2 — Core logging flow**

1. Quick-add bottom sheet: numeric keypad component
2. Category chip picker component
3. Save-transaction logic (hook + db write) wired to the two components above

**Stage 3 — Home dashboard**

1. Safe-to-spend + month-progress header component
2. Spend trend sparkline component
3. Top-categories mini list component

**Stage 4 — Transactions screen**

1. Day-grouped transaction list component
2. Swipeable transaction card (edit/delete actions)
3. Search & filter bar component

**Stage 5 — Budgets**

1. Category envelope/budget-bar component
2. Budget edit bottom sheet
3. Recurring transaction scheduler logic

**Stage 6 — Insights**

1. Victory Native pie/bar category breakdown
2. Month-over-month trend chart
3. Month-in-review summary card

**Stage 7 — Engagement layer**

1. Streak tracker logic + display component
2. Achievements logic + light UI
3. Haptics/micro-animation polish pass on existing components (no new screens)

**Stage 8+ — Automation (Tier 2), then Tier 5**, only after Stages 1–7 are working and tested, and only when I explicitly ask to proceed — starting with the `expo-dev-client` migration required for SMS parsing.

---

## 6. YOUR FIRST RESPONSE SHOULD BE

Nothing but the explanation requested in Rule 1 of Section 0 — a plain-language walkthrough of every feature tier, the design system, the architecture rules, and the build order, confirming you understand them, followed by one clarifying question if anything above is genuinely ambiguous. **Do not write any code in this first response.**
