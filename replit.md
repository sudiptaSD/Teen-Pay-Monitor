# FamilyPay

A UPI-integrated teen expense management mobile app for Indian teens (ages 13–18) with dual Teen and Parent modes.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54, Expo Router 6, React Native 0.81.5
- Fonts: Inter (400/500/600/700) via @expo-google-fonts/inter
- Icons: @expo/vector-icons (Feather)
- Gradients: expo-linear-gradient
- Charts: react-native-svg (custom DonutChart component)
- Haptics: expo-haptics
- State: React Context (AppContext) with mock data
- API: Express 5 (api-server artifact)
- Validation: Zod (zod/v4), drizzle-zod

## Where things live

```
artifacts/mobile/
  app/
    index.tsx                  # Role selector (Teen / Parent)
    _layout.tsx                # Root Stack + AppProvider
    (tabs)/                    # Teen app (5 tabs)
      _layout.tsx              # Teen tab bar
      index.tsx                # Teen dashboard
      pay.tsx                  # UPI payment screen + Spend Nudge
      goals.tsx                # Savings goals + gallery
      activity.tsx             # Expense chart + transaction history
      profile.tsx              # Achievements + budget proposal
    (parent)/                  # Parent app (4 tabs)
      _layout.tsx              # Parent tab bar
      index.tsx                # Parent dashboard + Add Funds + Strictness Nudge
      activity.tsx             # Teen's spending breakdown
      budget.tsx               # Budget proposal review + approve/reject
      reports.tsx              # Weekly report + blocked transactions
  components/
    BalanceCard.tsx            # Hero gradient balance card
    GoalCard.tsx               # Savings goal with progress bar
    TransactionItem.tsx        # Transaction row with category icons
    CategoryBar.tsx            # Budget vs spent progress bar
    AchievementBadge.tsx       # Bronze/Silver/Gold achievement cards
    WeeklyChallengeCard.tsx    # Weekly challenge with progress
    DonutChart.tsx             # SVG donut chart for expense breakdown
    SpendNudgeModal.tsx        # Soft spend nudge bottom sheet
  context/
    AppContext.tsx             # Global state, mock data, all actions
  constants/
    colors.ts                  # Design tokens (purple/orange/green palette)
  hooks/
    useColors.ts               # Theme hook
```

## Architecture decisions

- **No real UPI/bank integration in MVP demo** — all data is mock, stored in React Context. Real integration would require neo-bank API (Fi/Jupiter/Niyo) + RBI-compliant KYC.
- **Sin goods blocking is keyword-based** in the mock — real implementation would use MCC codes via UPI payment processor.
- **DonutChart uses react-native-svg** directly (no chart library) to avoid compatibility issues on Expo Go web.
- **Two separate route groups** `(tabs)` for teen and `(parent)` for parent — each has its own tab layout and color scheme (purple for teen, blue for parent).
- **Spend Nudge is non-blocking** per PRD — shown as a bottom sheet modal, teen can proceed or cancel.

## Product

FamilyPay has two modes:

**Teen side:**
- Balance card with UPI ID and quick actions (Pay, Add, Request, QR)
- 4-week Saver Streak + Budget Adherence Score (82/100)
- Weekly challenge (spend targets by category)
- Savings goals with progress tracking and Goal Gallery
- UPI payment with sin goods blocking and Spend Nudge
- Expense breakdown donut chart + budget progress bars
- Achievements system (Bronze/Silver/Gold) with 9 badges
- Budget proposal to parent (per-category monthly limits)

**Parent side:**
- Teen's live balance + monthly spending summary
- Strictness Nudge card (encourages more teen autonomy after consistent budget adherence)
- Add Funds modal (simulates UPI transfer to teen)
- Budget proposal review with editable categories (Approve / Send Back)
- Weekly report: Budget Score, Saver Streak, spending by category, blocked transactions

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Feather icon set doesn't include "flame" — use "zap" for the streak icon.
- `react-native-svg` Circle component uses `origin` prop for rotation center, not `transform-origin` — this generates a web console warning but works correctly.
- Web preview uses hardcoded `topPad = 67` and `bottomPad = 34` for safe area since `useSafeAreaInsets` returns 0 on web.
- The `(tabs)` group is the teen view. Do not rename to `(teen)` without updating all router.replace calls.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See PRD at `attached_assets/Pasted--PRD-Teen-Expense-Management-App-UPI-Integrated-...txt` for full product requirements
