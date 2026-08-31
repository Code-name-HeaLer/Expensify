# Personal Expense Tracker — Research & Build Spec

_Dark mode, minimalist, React Native + Expo + Tailwind (NativeWind)_

---

## 1. What the research says (2026 landscape)

**The market has fractured into two camps, and you should deliberately sit in the middle:**

1. **Automated/bank-synced apps** (Rocket Money, Monarch, Copilot, Empower) — link your bank via Plaid, auto-import everything, AI-categorize. Powerful but require handing over bank credentials to a third party.
2. **Manual/privacy-first apps** (Monefy, Pocket Clear, Goodbudget, Toshl) — you log spend yourself, nothing leaves your device. Slower to log, but private and trustworthy.

Since this is a **personal app you're building yourself**, you get the best of both: you can build the automation (SMS/notification parsing, receipt OCR) _without_ the trust problem, because you own the backend. That's a genuine edge over every commercial app in this list.

**India-specific context that matters a lot for you:**

- UPI dominates small daily spend (₹30–500: chai, auto, kirana store) — <cite index="46-1">30–100 UPI transactions a week against 5–15 on cards is typical for Indian spending</cite>. Your app needs to make _sub-minute logging_ frictionless, because that's the volume you're dealing with, not 5 big card swipes a month.
- <cite index="44-1">Indian banks send structured SMS for nearly every transaction, and apps like Moneyview and Axio (formerly Walnut) read these to auto-log spend</cite>, though <cite index="44-1">Google Play tightened SMS-permission rules through 2024–25, making this harder to ship post-Play-Store-review</cite>. Since this is a personal app side-loaded via Expo Go / your own build, you don't face that App Store review friction — a real advantage for you specifically.
- <cite index="47-1">No app cleanly auto-imports UPI transactions directly — the best anyone does is SMS parsing</cite>, so don't chase a "perfect automatic" fantasy; design for **fast manual entry as the reliable core**, with SMS/notification parsing as a bonus accelerant.

**Design/UX consensus across every fintech design source in 2026:**

- <cite index="23-1">Dark mode has stopped being a trend and become an expectation, particularly for anything with charts and financial data, where a dark canvas reduces glare and makes color-coded gains and losses pop</cite>.
- <cite index="23-1">The direction is progressive onboarding, adaptive home screens that surface one next action, and restrained, purposeful motion</cite> — the confetti-and-bounce era is over; <cite index="23-1">that energy has cooled into something more deliberate</cite>.
- <cite index="22-1">Navigation is shifting from top bars to bottom-sheet interactions and one-handed gesture controls</cite>, and <cite index="22-1">the bigger shift is from static dashboards to predictive systems that surface relevant insights before the user asks</cite>.
- <cite index="18-1">Gamification increases engagement by roughly 60% according to Gartner research</cite> — but used sparingly. <cite index="17-1">Monobank's approach — swipeable cards, a light touch of achievements, and witty microcopy — is repeatedly cited as the gold standard for "gamification that doesn't feel gimmicky."</cite>
- Copilot Money is the most consistently cited "best-designed" finance app in every 2026 review. <cite index="10-1">Reviewers across The Penny Hoarder, SaaSweep, and Thalvi independently rate its design as best-in-category</cite>, and it's built on: automatic merchant logos, ML categorization that improves from your corrections, and a chart-forward transaction feed rather than a spreadsheet-style list.

---

## 2. Feature set — organized by tier

### Tier 1 — Core (build first, nothing works without these)

- **Sub-5-second expense entry**: big floating "+" button, numeric keypad opens immediately, category picker as a horizontal scroll of icons (not a dropdown), amount → category → done in 3 taps.
- **Manual accounts**: cash, each bank account, each card, each UPI-linked account — as separate balances you can toggle in reports.
- **Categories with icons + colors**, fully custom (not just presets) — food, transport, bills, rent, EMI, entertainment, health, shopping, subscriptions, misc.
- **Recurring/scheduled transactions** — rent, EMI, subscriptions auto-populate on their due date so you're not re-typing rent every month.
- **Home dashboard**: this month's total spend, remaining budget, a spending trend line, top 3 categories — all above the fold, no scrolling needed for the daily check-in.
- **Search & filter** transactions by category, date range, account, amount range, tags.

### Tier 2 — Automation (what makes it feel effortless)

- **SMS/notification parsing** (Android): read bank/UPI debit SMS and pre-fill a draft transaction for one-tap confirm — this is the single biggest lever for India-based daily use, and <cite index="7-1">expert roundups from Forbes Advisor and NerdWallet agree bank syncing and automatic categorization are now baseline features for top budget apps</cite>, even if you're doing it via SMS parsing instead of Plaid.
- **Receipt scanning (OCR)** for the rarer big purchases — <cite index="7-1">AI receipt scanning, bank imports, and voice entry are what separate powerful tools from simple logbooks in 2026</cite>.
- **Voice entry** — "₹250 on groceries" logged by speaking, for when you're mid-errand and typing is annoying.
- **Auto-categorization that learns**: a lightweight on-device rule engine (merchant string → category), refined every time you correct it — same mechanism Copilot uses, just simpler since you don't need bank-grade ML.
- **Subscription/recurring-charge radar**: scan your logged transactions for repeating merchant+amount patterns and surface "You're paying ₹499/mo for X — still using it?" nudges, the way <cite index="29-1">Rocket Money's algorithm scans linked accounts to detect every recurring charge, including forgotten or unused ones quietly draining the budget</cite>.

### Tier 3 — Budgeting & insight

- **Envelope-style monthly budgets per category** — set a cap, see a progress bar per category, get warned before you blow it (the <cite index="26-1">"give every dollar a job" YNAB philosophy</cite>, but lighter-weight — you don't need to justify every rupee, just cap categories that tend to run away).
- **"Safe to spend today" number** — daily discretionary allowance calculated from (remaining budget ÷ days left in month), the way <cite index="26-1">Rocket Money shows safe-to-spend insights before your next payday</cite>. This is the single highest-leverage feature for actually changing behavior day to day.
- **Monthly/weekly spend reports** with category breakdown pie chart + trend line over months, so patterns become visible (rent is fixed, but is food creeping up?).
- **Net worth / savings tracking** (optional, simple): total across accounts, trend over time.
- **Month-in-review / year-in-review card** — a shareable-style recap ("You spent most on food, 18% more than last month") — <cite index="9-1">Copilot's month/year-in-review feature is called out as a distinguishing feature</cite> that turns raw numbers into a story.

### Tier 4 — Engagement (the "make me _want_ to open it" layer)

- **Streaks**: consecutive days you've logged at least one expense — a habit loop, not a spending goal.
- **Light achievements**: "First month under budget," "30-day logging streak," "Cancelled 2 unused subscriptions" — <cite index="17-1">used the way Monobank uses achievements: as a light touch, not the core mechanic</cite>, and <cite index="21-1">framed as accomplishments so managing money stops feeling like an irritating chore</cite>.
- **Micro-interactions with restraint**: a satisfying haptic + subtle checkmark animation on logging an expense, a gentle progress-bar fill when you hit a savings goal — not confetti explosions. <cite index="23-1">The 2026 consensus is that this celebratory-motion energy has cooled into something more purposeful</cite>.
- **Smart proactive nudges**, not passive dashboards — e.g. <cite index="22-1">"you usually pay rent today but discretionary spend is already high this week"</cite> style contextual insight, delivered once a day max so it doesn't nag.
- **Widgets** (home-screen glance at today's spend / remaining budget) — cited repeatedly as a top reason users check Copilot daily without opening the app.

### Tier 5 — Nice-to-have / v2

- Multi-currency (useful if you travel)
- Bill-splitting with friends (Splitwise-style) if you ever want shared expenses
- Export to CSV/Excel for tax or year-end review
- Cloud backup/sync across your own devices (Supabase/Firebase, since it's your own app)
- A simple "financial goals" tracker (saving for a laptop, a trip, etc.) with a visual progress bar

---

## 3. Design system — dark, minimalist, functional

**Philosophy**: legible density over decoration. A finance app you check daily earns its keep by being _fast to scan_, not by looking impressive once and cluttered forever after. <cite index="20-1">Dense financial data can stay visible, but it must be organized through alignment, grouping, precise formatting, and consistent interaction patterns</cite> — that's the whole design brief in one sentence.

### Color palette (dark mode)

- **Background**: near-black, not pure black — `#0B0D10` to `#111418` range. Pure `#000000` causes halation/glare on OLED with white text; a very dark charcoal reads as "premium dark," not "off."
- **Surface/cards**: one or two steps lighter than background — `#16191E` / `#1C2026` — to create depth without borders.
- **Primary accent**: pick ONE vivid accent color for CTAs, active states, and the "+" button — an electric green (`#3ECF8E`-ish, "money" association) or a saturated indigo/violet if you want to differentiate from every fintech app's default green. Use it sparingly — accent, not everywhere.
- **Semantic colors**: green for income/under-budget, a warm red/coral for overspend/expense-over-limit (avoid harsh pure red — it reads as an error state, not just "you spent money"), amber for approaching-limit warnings.
- **Text**: primary text near-white (`#F5F6F7`, not pure white — softer on OLED), secondary/muted text a mid-gray (`#8A8F98`) for timestamps, category labels, helper copy.
- Category colors: each category gets a distinct, muted hue for its icon/chip — used consistently everywhere (dashboard chart, transaction list, budget bars) so a category becomes visually recognizable at a glance without reading the label.

### Typography

- One geometric/humanist sans (Inter, Manrope, or SF Pro if iOS-first) — numbers are the hero, so pick a font with proper **tabular figures** for amounts so columns of numbers align.
- Big, bold numerals for the hero amount (today's spend, budget remaining) — go large (32–40px) on the dashboard header; everything else stays restrained (13–15px body).
- Currency formatting: ₹ symbol handled consistently, Indian numbering (₹1,23,456 not ₹123,456) if you want it to feel native rather than imported.

### Layout & interaction patterns

- **Bottom tab bar**, 4–5 items max: Home, Transactions, Budgets, Insights, (+ floating action button for quick-add, overlapping the tab bar) — matches the <cite index="22-1">mobile-first shift toward bottom-sheet interactions and one-handed gesture control</cite>.
- **Bottom sheets, not full-screen modals**, for quick actions (add expense, edit category, filter) — keeps context visible, feels lighter.
- **Swipeable transaction cards**: swipe left to delete, swipe right to edit/re-categorize — no need to tap into a detail screen for common actions.
- **Card-based grouping** for transaction lists, grouped by day with a running daily total header — easier to scan than a flat infinite list.
- **Progressive disclosure**: the home screen shows _conclusions_ (you're at 70% of budget, ₹340/day safe to spend); tapping in reveals the underlying detail. Don't show every number everywhere.
- Motion: short, purposeful transitions (150–250ms), spring-based for sheet openings, no bouncing/exaggerated easing. Micro-haptics on log/complete actions.

---

## 4. Suggested screen map (IA)

1. **Home / Dashboard** — safe-to-spend today, month progress ring, spend trend sparkline, recent transactions (last 5), quick-add FAB
2. **Transactions** — searchable/filterable list grouped by day, swipe actions
3. **Add/Edit Expense** (bottom sheet) — amount keypad, category chips, account picker, note, date, recurring toggle
4. **Budgets** — per-category envelope bars, overall monthly budget ring, edit caps
5. **Insights/Reports** — monthly pie/bar breakdown, month-over-month trend, category deep-dive, month-in-review card
6. **Subscriptions/Recurring** — detected + manually added recurring charges, next due dates, "still using this?" flags
7. **Accounts** — list of cash/bank/card "buckets," balances, net worth summary
8. **Settings** — categories management, SMS-parsing permission toggle, backup/export, appearance

---

## 5. Tech stack recommendations (React Native + Expo + Tailwind)

- **Styling**: NativeWind (Tailwind for RN) — you already know Tailwind, so this is the fastest path to consistent spacing/color tokens. Define your dark palette as custom Tailwind theme colors once, use everywhere.
- **Charts**: <cite index="38-1">Victory Native is the 2026 go-to — it's a from-scratch rewrite that uses React Native Skia for GPU-accelerated rendering, Reanimated for UI-thread animation, and Gesture Handler for native touch interactions</cite>, giving you buttery line/bar/pie charts with interactive tooltips out of the box. If you later need extreme performance with very large datasets, drop to raw `react-native-skia`, but for a personal finance app Victory Native is more than enough and much faster to build with.
- **Animations**: `react-native-reanimated` + `react-native-gesture-handler` (Victory Native needs these anyway) for swipe actions and bottom-sheet transitions.
- **Bottom sheets**: `@gorhom/bottom-sheet` — the standard, works great with Expo.
- **Local storage/DB**: since this is personal and offline-first matters, use `expo-sqlite` (or WatermelonDB if you want reactive queries) rather than reaching for a backend on day one. Add Supabase later only if you want cross-device sync.
- **Icons**: `lucide-react-native` — clean, consistent, huge category-icon coverage, matches the minimalist aesthetic well.
- **SMS parsing (Android only)**: `react-native-get-sms-android` or a custom native module — note this requires an Expo **dev build** (not Expo Go) once you add native permissions, since Expo Go can't grant SMS read permission. Plan for `expo-dev-client` when you get to Tier 2 automation.
- **OCR (receipts)**: `expo-camera` + on-device ML Kit text recognition, or send to a lightweight cloud OCR API if on-device accuracy isn't enough.
- **Haptics**: `expo-haptics` for the micro-interaction feedback on logging.

---

## 6. Suggested build order (MVP → daily-driver → delight)

1. **Week 1**: Tailwind theme + dark palette, bottom-tab nav, SQLite schema (transactions, categories, accounts, budgets), quick-add flow with keypad + category chips.
2. **Week 2**: Home dashboard (safe-to-spend, progress ring, sparkline), transaction list with search/filter/swipe actions.
3. **Week 3**: Budgets screen (envelope bars), recurring transactions, Insights screen (Victory Native charts).
4. **Week 4**: Subscription radar, streaks/achievements (light), widgets, polish motion/haptics.
5. **Later**: SMS parsing dev build, OCR receipt scan, voice entry, cloud sync.

This order gets you a fully usable daily-driver app by week 2–3 — the automation and gamification layers are additive polish on top of a core that already works, which matches exactly what the research shows separates apps people actually keep using from ones they abandon after a week.
