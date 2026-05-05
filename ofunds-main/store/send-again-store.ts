import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SendAgainRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  type: "bank" | "ofunds" | "gifting";
  lastAmount: number;
  bankId?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  recipientId?: number;
  timestamp: number;
}

interface SendAgainState {
  recipients: SendAgainRecipient[];
  addRecipient: (
    recipient: Omit<SendAgainRecipient, "timestamp" | "id">,
  ) => void;
  getRecipients: () => SendAgainRecipient[];
  removeRecipient: (id: string) => void;
  clearRecipients: () => void;
  updateRecipient: (id: string, updates: Partial<SendAgainRecipient>) => void;
}

export const useSendAgainStore = create<SendAgainState>()(
  persist(
    (set, get) => ({
      recipients: [],

      addRecipient: (
        recipient: Omit<SendAgainRecipient, "timestamp" | "id">,
      ) => {
        const state = get();

        // Check if recipient already exists (by email or phone + type)
        const existingIndex = state.recipients.findIndex(
          (r) =>
            (r.email === recipient.email || r.phone === recipient.phone) &&
            r.type === recipient.type,
        );

        const newRecipient: SendAgainRecipient = {
          ...recipient,
          id: `${recipient.type}-${recipient.email || recipient.phone}-${Date.now()}`,
          timestamp: Date.now(),
        };

        if (existingIndex >= 0) {
          // Update existing recipient (move to top, update amount)
          const updated = [...state.recipients];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...newRecipient,
            timestamp: Date.now(),
          };
          // Move to top
          const recipient = updated.splice(existingIndex, 1)[0];
          set({ recipients: [recipient, ...updated].slice(0, 20) });
        } else {
          // Add new recipient (keep max 20)
          set({ recipients: [newRecipient, ...state.recipients].slice(0, 20) });
        }
      },

      getRecipients: () => get().recipients,

      removeRecipient: (id: string) => {
        set({
          recipients: get().recipients.filter((r) => r.id !== id),
        });
      },

      clearRecipients: () => {
        set({ recipients: [] });
      },

      updateRecipient: (id: string, updates: Partial<SendAgainRecipient>) => {
        set({
          recipients: get().recipients.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        });
      },
    }),
    {
      name: "ofunds-send-again", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recipients: state.recipients }), // Only persist recipients
    },
  ),
);
