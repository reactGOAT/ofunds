import { create } from "zustand";
import Cookies from "js-cookie";

export interface JetsendUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  chat_id: string;
  user_type: string;
  avatar: string;
  picture: string;
  email_status: number;
  app_status: number;
  phone: string;
  affliate_code: string;
  status: number;
  email_verified_at: string | null;
  jetpay_fcm_token: string | null;
  fcm_token: string | null;
  created_at: string;
  updated_at: string;
  authenticator_secret: null | string;
  google2fa_enable: number;
  google2fa_enable_date: string | null;
  balance: number;
  wallet: {
    id: number;
    balance: number;
    commission: number;
    currency: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  status: number;
  type: number;
  bank_name: string;
  account_name: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionHistoryItem {
  id: number;
  title: string;
  amount: number;
  status: number;
  type: number; // 0 = debit, 1 = credit
  bank_name: string;
  account_name: string;
  created_at: string;
  updated_at: string;
}

export interface Bank {
  id: number;
  account_reference: string;
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  card_type: string;
  card_number: string;
  status: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

interface JetsendUserState {
  user: JetsendUser | null;
  transactions: TransactionHistoryItem[];
  banks: Bank[];
  cards: Card[];
  balance: number;
  isLoading: boolean;

  setUser: (user: JetsendUser) => void;
  setTransactions: (transactions: TransactionHistoryItem[]) => void;
  setBanks: (banks: Bank[]) => void;
  setCards: (cards: Card[]) => void;
  setBalance: (balance: number) => void;
  setLoading: (loading: boolean) => void;

  addTransaction: (transaction: TransactionHistoryItem) => void;
  addBank: (bank: Bank) => void;
  removeBank: (bankId: number) => void;
  addCard: (card: Card) => void;
  updateCard: (cardId: number, updates: Partial<Card>) => void;
  removeCard: (cardId: number) => void;

  loadFromCookies: () => void;
  saveToCookies: () => void;
  clearAll: () => void;
}

export const useJetsendUserStore = create<JetsendUserState>((set, get) => ({
  user: null,
  transactions: [],
  banks: [],
  cards: [],
  balance: 0,
  isLoading: false,

  setUser: (user: JetsendUser) => {
    set({ user, balance: user.wallet.balance });
    get().saveToCookies();
  },

  setTransactions: (transactions: TransactionHistoryItem[]) => {
    set({ transactions });
  },

  setBanks: (banks: Bank[]) => {
    set({ banks });
  },

  setCards: (cards: Card[]) => {
    set({ cards });
  },

  setBalance: (balance: number) => {
    set({ balance });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  addTransaction: (transaction: TransactionHistoryItem) => {
    const current = get().transactions;
    set({ transactions: [transaction, ...current] });
  },

  addBank: (bank: Bank) => {
    const current = get().banks;
    set({ banks: [...current, bank] });
  },

  removeBank: (bankId: number) => {
    const current = get().banks;
    set({ banks: current.filter((b) => b.id !== bankId) });
  },

  addCard: (card: Card) => {
    const current = get().cards;
    set({ cards: [...current, card] });
  },

  updateCard: (cardId: number, updates: Partial<Card>) => {
    const current = get().cards;
    set({
      cards: current.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
    });
  },

  removeCard: (cardId: number) => {
    const current = get().cards;
    set({ cards: current.filter((c) => c.id !== cardId) });
  },

  loadFromCookies: () => {
    if (typeof window === "undefined") return;

    try {
      const userJson = Cookies.get("jetsend:user");
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user, balance: user.wallet.balance });
      }
    } catch (error) {
      console.error("Error loading from cookies:", error);
    }
  },

  saveToCookies: () => {
    if (typeof window === "undefined") return;

    const { user, balance } = get();
    if (user) {
      Cookies.set("jetsend:user", JSON.stringify(user), {
        expires: 7, // 7 days
        secure: true,
        sameSite: "lax",
      });
    }
  },

  clearAll: () => {
    Cookies.remove("jetsend:user");
    Cookies.remove("jetsend:access_token");
    Cookies.remove("jetsend:chat_token");
    set({
      user: null,
      transactions: [],
      banks: [],
      cards: [],
      balance: 0,
    });
  },
}));
