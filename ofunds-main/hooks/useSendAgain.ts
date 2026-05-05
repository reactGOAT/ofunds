"use client";

import {
  useSendAgainStore,
  SendAgainRecipient,
} from "@/store/send-again-store";

export const useSendAgain = () => {
  const recipients = useSendAgainStore((state) => state.recipients);
  const addRecipient = useSendAgainStore((state) => state.addRecipient);
  const removeRecipient = useSendAgainStore((state) => state.removeRecipient);
  const clearRecipients = useSendAgainStore((state) => state.clearRecipients);
  const updateRecipient = useSendAgainStore((state) => state.updateRecipient);

  return {
    recipients,
    addRecipient,
    removeRecipient,
    clearRecipients,
    updateRecipient,

    // Helpers
    addTransferRecipient: (data: {
      email?: string;
      phone?: string;
      name: string;
      amount: number;
      bankId?: string;
      accountNumber?: string;
      accountName?: string;
      bankName?: string;
    }) => {
      addRecipient({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: "bank",
        lastAmount: data.amount,
        bankId: data.bankId,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bankName: data.bankName,
      });
    },

    addOfundsRecipient: (data: {
      email: string;
      name: string;
      amount: number;
      recipientId: number;
      avatar?: string;
    }) => {
      addRecipient({
        name: data.name,
        email: data.email,
        type: "ofunds",
        lastAmount: data.amount,
        recipientId: data.recipientId,
        avatar: data.avatar,
      });
    },

    addGiftingRecipient: (data: {
      email: string;
      name: string;
      amount: number;
      avatar?: string;
    }) => {
      addRecipient({
        name: data.name,
        email: data.email,
        type: "gifting",
        lastAmount: data.amount,
        avatar: data.avatar,
      });
    },

    getByType: (type: "bank" | "ofunds" | "gifting") => {
      return recipients.filter((r) => r.type === type);
    },

    getByEmail: (email: string) => {
      return recipients.find((r) => r.email === email);
    },

    getByPhone: (phone: string) => {
      return recipients.find((r) => r.phone === phone);
    },

    // Sort by recent (timestamp descending)
    getSorted: () => {
      return [...recipients].sort((a, b) => b.timestamp - a.timestamp);
    },
  };
};
