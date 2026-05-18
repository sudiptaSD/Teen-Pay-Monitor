import React, { createContext, useCallback, useContext, useState } from "react";

export type UserMode = "teen" | "parent" | null;

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  time: string;
  status: "completed" | "blocked" | "pending";
  blockedReason?: string;
  tag?: string;
  upiId?: string;
  isP2P?: boolean;
  isCredit?: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  createdAt: string;
  completedAt?: string;
  isActive: boolean;
}

export interface BudgetCategory {
  name: string;
  emoji: string;
  proposed: number;
  approved: number;
  spent: number;
  color: string;
}

export interface BudgetProposal {
  id: string;
  categories: BudgetCategory[];
  status: "pending" | "approved" | "rejected" | "revised";
  createdAt: string;
  respondedAt?: string;
  parentNote?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: "bronze" | "silver" | "gold";
  unlockedAt?: string;
  isUnlocked: boolean;
  icon: string;
}

export interface WeeklyChallenge {
  id: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  endsAt: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", amount: 245, merchant: "Zomato", category: "Food", date: "Today", time: "1:30 PM", status: "completed", upiId: "zomato@upi" },
  { id: "2", amount: 85, merchant: "School Canteen", category: "Food", date: "Today", time: "11:00 AM", status: "completed", upiId: "canteen@upi" },
  { id: "3", amount: 120, merchant: "Ola", category: "Transport", date: "Yesterday", time: "8:30 AM", status: "completed", upiId: "ola@upi" },
  { id: "4", amount: 200, merchant: "BookMyShow", category: "Entertainment", date: "Yesterday", time: "6:00 PM", status: "completed", upiId: "bookmyshow@upi" },
  { id: "5", amount: 459, merchant: "Amazon", category: "Shopping", date: "2 days ago", time: "3:15 PM", status: "completed", upiId: "amazon@upi" },
  { id: "6", amount: 175, merchant: "Swiggy", category: "Food", date: "3 days ago", time: "8:00 PM", status: "completed", upiId: "swiggy@upi" },
  { id: "7", amount: 50, merchant: "Pan Shop Kargi", category: "Sin Good", date: "3 days ago", time: "5:00 PM", status: "blocked", blockedReason: "Tobacco/Pan shop blocked", upiId: "panshop@upi" },
  { id: "8", amount: 300, merchant: "Rohan Kumar", category: "Personal", date: "4 days ago", time: "2:00 PM", status: "completed", isP2P: true, tag: "Lunch split", upiId: "rohan.kumar@upi" },
  { id: "9", amount: 2000, merchant: "Dad", category: "Received", date: "2 weeks ago", time: "9:00 AM", status: "completed", isCredit: true, tag: "Monthly allowance", upiId: "dad@upi" },
];

const MOCK_GOALS: SavingsGoal[] = [
  { id: "g1", name: "Sony WH-1000XM5 Earphones", targetAmount: 28000, currentAmount: 8400, emoji: "🎧", createdAt: "2025-04-01", isActive: true },
];

const MOCK_COMPLETED_GOALS: SavingsGoal[] = [
  { id: "g0", name: "Gaming Headset", targetAmount: 5000, currentAmount: 5000, emoji: "🎮", createdAt: "2025-01-15", completedAt: "2025-02-28", isActive: false },
];

const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: "Food", emoji: "🍕", proposed: 900, approved: 800, spent: 505, color: "#FF6B35" },
  { name: "Transport", emoji: "🚌", proposed: 400, approved: 300, spent: 120, color: "#6C47FF" },
  { name: "Entertainment", emoji: "🎬", proposed: 300, approved: 250, spent: 200, color: "#00C48C" },
  { name: "Shopping", emoji: "🛍️", proposed: 600, approved: 500, spent: 459, color: "#FFB020" },
];

const MOCK_BUDGET_PROPOSAL: BudgetProposal = {
  id: "bp1",
  categories: MOCK_BUDGET_CATEGORIES,
  status: "pending",
  createdAt: "2025-05-15",
};

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", name: "First Step", description: "Made your first UPI payment", tier: "bronze", isUnlocked: true, unlockedAt: "2025-04-01", icon: "zap" },
  { id: "a2", name: "Dream Big", description: "Created your first savings goal", tier: "bronze", isUnlocked: true, unlockedAt: "2025-04-01", icon: "target" },
  { id: "a3", name: "Negotiator", description: "First budget proposal approved by parent", tier: "bronze", isUnlocked: true, unlockedAt: "2025-04-10", icon: "check-circle" },
  { id: "a4", name: "Goal Getter", description: "Completed your first savings goal", tier: "silver", isUnlocked: true, unlockedAt: "2025-02-28", icon: "award" },
  { id: "a5", name: "Steady Hand", description: "4-week budget adherence streak", tier: "silver", isUnlocked: false, icon: "trending-up" },
  { id: "a6", name: "Future You Wins", description: "Cancelled a transaction after a Spend Nudge", tier: "silver", isUnlocked: false, icon: "shield" },
  { id: "a7", name: "Habit Builder", description: "8-week budget adherence streak", tier: "gold", isUnlocked: false, icon: "star" },
  { id: "a8", name: "Double Down", description: "Two savings goals completed", tier: "gold", isUnlocked: false, icon: "layers" },
  { id: "a9", name: "Trusted Teen", description: "Parent increased budget after strictness nudge", tier: "gold", isUnlocked: false, icon: "heart" },
];

const MOCK_WEEKLY_CHALLENGE: WeeklyChallenge = {
  id: "wc1",
  description: "Keep food spend under ₹500 this week",
  category: "Food",
  targetAmount: 500,
  currentAmount: 85,
  endsAt: "Sunday",
};

const SIN_GOODS_KEYWORDS = ["pan", "tobacco", "cigarette", "alcohol", "liquor", "beer", "wine", "adult", "hookah"];

function detectCategory(merchant: string): string {
  const lower = merchant.toLowerCase();
  if (["zomato", "swiggy", "canteen", "mcdonald", "kfc", "pizza", "food", "cafe", "biryani"].some((k) => lower.includes(k))) return "Food";
  if (["ola", "uber", "rapido", "metro", "bus", "transport", "railway", "flight"].some((k) => lower.includes(k))) return "Transport";
  if (["bookmyshow", "netflix", "spotify", "gaming", "entertainment", "movie", "pvr"].some((k) => lower.includes(k))) return "Entertainment";
  if (["amazon", "flipkart", "myntra", "shopping", "store", "mall"].some((k) => lower.includes(k))) return "Shopping";
  return "Personal";
}

interface AppContextType {
  balance: number;
  transactions: Transaction[];
  goals: SavingsGoal[];
  completedGoals: SavingsGoal[];
  budgetProposal: BudgetProposal | null;
  budgetCategories: BudgetCategory[];
  achievements: Achievement[];
  saverStreak: number;
  budgetAdherenceScore: number;
  weeklyChallenge: WeeklyChallenge | null;
  makePayment: (amount: number, merchant: string, upiId: string) => { success: boolean; blocked?: boolean; nudged?: boolean; goalName?: string };
  addGoal: (name: string, targetAmount: number, emoji: string) => void;
  addFunds: (amount: number) => void;
  approveBudget: (categories: BudgetCategory[], note?: string) => void;
  rejectBudget: (note: string) => void;
  submitBudgetProposal: (categories: BudgetCategory[]) => void;
  unlockAchievement: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(2340);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<SavingsGoal[]>(MOCK_GOALS);
  const [completedGoals] = useState<SavingsGoal[]>(MOCK_COMPLETED_GOALS);
  const [budgetProposal, setBudgetProposal] = useState<BudgetProposal | null>(MOCK_BUDGET_PROPOSAL);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(MOCK_BUDGET_CATEGORIES);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [saverStreak] = useState(4);
  const [budgetAdherenceScore] = useState(82);
  const [weeklyChallenge] = useState<WeeklyChallenge | null>(MOCK_WEEKLY_CHALLENGE);

  const makePayment = useCallback(
    (amount: number, merchant: string, upiId: string) => {
      const lower = merchant.toLowerCase();
      const isSinGood = SIN_GOODS_KEYWORDS.some((kw) => lower.includes(kw));

      if (isSinGood) {
        const blocked: Transaction = {
          id: Date.now().toString(),
          amount,
          merchant,
          category: "Sin Good",
          date: "Today",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "blocked",
          blockedReason: "Age-restricted category automatically blocked",
          upiId,
        };
        setTransactions((prev) => [blocked, ...prev]);
        return { success: false, blocked: true };
      }

      if (amount > balance) return { success: false };

      const activeGoal = goals.find((g) => g.isActive);
      const newBalance = balance - amount;
      const goalNeeded = activeGoal ? activeGoal.targetAmount - activeGoal.currentAmount : 0;
      const nudged = !!(activeGoal && newBalance < goalNeeded * 0.6 && amount > 100);

      const tx: Transaction = {
        id: Date.now().toString(),
        amount,
        merchant,
        category: detectCategory(merchant),
        date: "Today",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "completed",
        upiId,
      };

      setBalance((prev) => prev - amount);
      setTransactions((prev) => [tx, ...prev]);
      const cat = detectCategory(merchant);
      setBudgetCategories((prev) =>
        prev.map((c) => (c.name === cat ? { ...c, spent: c.spent + amount } : c))
      );

      return { success: true, nudged, goalName: activeGoal?.name };
    },
    [balance, goals]
  );

  const addGoal = useCallback((name: string, targetAmount: number, emoji: string) => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      targetAmount,
      currentAmount: 0,
      emoji,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const addFunds = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
    const tx: Transaction = {
      id: Date.now().toString(),
      amount,
      merchant: "Dad",
      category: "Received",
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      isCredit: true,
      tag: "Allowance top-up",
      upiId: "dad@upi",
    };
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const approveBudget = useCallback((categories: BudgetCategory[], note?: string) => {
    setBudgetProposal((prev) =>
      prev ? { ...prev, status: "approved", respondedAt: new Date().toISOString(), parentNote: note } : null
    );
    setBudgetCategories(categories.map((c) => ({ ...c, approved: c.proposed })));
  }, []);

  const rejectBudget = useCallback((note: string) => {
    setBudgetProposal((prev) =>
      prev ? { ...prev, status: "revised", respondedAt: new Date().toISOString(), parentNote: note } : null
    );
  }, []);

  const submitBudgetProposal = useCallback((categories: BudgetCategory[]) => {
    const proposal: BudgetProposal = {
      id: Date.now().toString(),
      categories,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBudgetProposal(proposal);
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        balance, transactions, goals, completedGoals, budgetProposal, budgetCategories,
        achievements, saverStreak, budgetAdherenceScore, weeklyChallenge,
        makePayment, addGoal, addFunds, approveBudget, rejectBudget, submitBudgetProposal, unlockAchievement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
