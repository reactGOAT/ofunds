"use client";

import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { TransactionService } from "@/services/transactions";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { QueryKeys } from "@/models/query";

export const useTransactionHistory = (limit: number = 20) => {
  const addTransaction = useJetsendUserStore((state) => state.addTransaction);

  return useInfiniteQuery({
    queryKey: [QueryKeys.Get_Transactions, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await TransactionService.getTransactionHistory(
        pageParam,
        limit,
      );
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.meta && lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useGetTransactionDetails = (id: number) => {
  return useQuery({
    queryKey: [QueryKeys.Get_Transaction_Details, id],
    queryFn: async () => {
      const response = await TransactionService.getTransactionDetails(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// TRANSFER (to bank account) with 2FA
export const useInitTransfer = () => {
  return useMutation({
    mutationFn: async (data: {
      bank_id: number;
      amount: string;
      note: string;
    }) => {
      const response = await TransactionService.initTransfer(
        data.bank_id,
        data.amount,
        data.note,
      );
      return response.data.data;
    },
  });
};

export const useProcessTransfer = () => {
  return useMutation({
    mutationFn: async (data: { hash: string; pin: string }) => {
      const response = await TransactionService.processTransfer(
        data.hash,
        data.pin,
      );
      return response;
    },
  });
};

export const useVerifyTransfer = () => {
  const addTransaction = useJetsendUserStore((state) => state.addTransaction);
  const setBalance = useJetsendUserStore((state) => state.setBalance);

  return useMutation({
    mutationFn: async (data: { hash: string; otp_code: string }) => {
      const response = await TransactionService.verifyTransfer(
        data.hash,
        data.otp_code,
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.data) {
        addTransaction(response.data as any);
        // Update balance after successful transfer
        if (response.data.balance_after !== null) {
          setBalance(response.data.balance_after);
        }
      }
    },
  });
};

// GIFTING (P2P transfer) with 2FA
export const useInitGifting = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      amount: string;
      note: string;
    }) => {
      const response = await TransactionService.initGifting(
        data.email,
        data.amount,
        data.note,
      );
      return response.data.data;
    },
  });
};

export const useProcessGifting = () => {
  return useMutation({
    mutationFn: async (data: { hash: string; pin: string }) => {
      const response = await TransactionService.processGifting(
        data.hash,
        data.pin,
      );
      return response;
    },
  });
};

export const useVerifyGifting = () => {
  const addTransaction = useJetsendUserStore((state) => state.addTransaction);
  const setBalance = useJetsendUserStore((state) => state.setBalance);

  return useMutation({
    mutationFn: async (data: { hash: string; otp_code: string }) => {
      const response = await TransactionService.verifyGifting(
        data.hash,
        data.otp_code,
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.data) {
        addTransaction(response.data as any);
        if (response.data.balance_after !== null) {
          setBalance(response.data.balance_after);
        }
      }
    },
  });
};

// OFUNDS TRANSFER (wallet to wallet) with 2FA
export const useInitOfundsTransfer = () => {
  return useMutation({
    mutationFn: async (data: {
      recipient_id: number;
      amount: string;
      note: string;
    }) => {
      const response = await TransactionService.initOfundsTransfer(
        data.recipient_id,
        data.amount,
        data.note,
      );
      return response.data.data;
    },
  });
};

export const useProcessOfundsTransfer = () => {
  return useMutation({
    mutationFn: async (data: { hash: string; pin: string }) => {
      const response = await TransactionService.processOfundsTransfer(
        data.hash,
        data.pin,
      );
      return response;
    },
  });
};

export const useVerifyOfundsTransfer = () => {
  const addTransaction = useJetsendUserStore((state) => state.addTransaction);
  const setBalance = useJetsendUserStore((state) => state.setBalance);

  return useMutation({
    mutationFn: async (data: { hash: string; otp_code: string }) => {
      const response = await TransactionService.verifyOfundsTransfer(
        data.hash,
        data.otp_code,
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.data) {
        addTransaction(response.data as any);
        if (response.data.balance_after !== null) {
          setBalance(response.data.balance_after);
        }
      }
    },
  });
};
