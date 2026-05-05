"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CardService, type AtmCardRequestPayload } from "@/services/cards";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { QueryKeys } from "@/models/query";

export const useGetUserCards = () => {
  const setCards = useJetsendUserStore((state) => state.setCards);

  return useQuery({
    queryKey: [QueryKeys.Get_Cards],
    queryFn: async () => {
      const response = await CardService.getUserCards();
      if (response.status) {
        setCards(response.data);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export const useRequestCard = () => {
  const addCard = useJetsendUserStore((state) => state.addCard);

  return useMutation({
    mutationFn: async (card_type: "sudo" | "ofunds") => {
      const response = await CardService.requestCard(card_type);
      return response;
    },
    onSuccess: (response) => {
      if (response.status) {
        addCard(response.data);
      }
    },
  });
};

export const useGetCardPrice = () => {
  return useQuery({
    queryKey: [QueryKeys.Get_Card_Price],
    queryFn: async () => {
      const response = await CardService.getCardPrice();
      return response.data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (prices don't change often)
    retry: 1,
  });
};

export const useGetCardDetails = (card_id: number) => {
  return useQuery({
    queryKey: [QueryKeys.Get_Card_Details, card_id],
    queryFn: async () => {
      const response = await CardService.getCardDetails(card_id);
      return response.data;
    },
    enabled: !!card_id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useActivateCard = () => {
  const updateCard = useJetsendUserStore((state) => state.updateCard);

  return useMutation({
    mutationFn: async (card_id: number) => {
      const response = await CardService.activateCard(card_id);
      return response;
    },
  });
};

export const useDeactivateCard = () => {
  return useMutation({
    mutationFn: async (card_id: number) => {
      const response = await CardService.deactivateCard(card_id);
      return response;
    },
  });
};

export const useDeleteCard = () => {
  const removeCard = useJetsendUserStore((state) => state.removeCard);

  return useMutation({
    mutationFn: async (card_id: number) => {
      const response = await CardService.deleteCard(card_id);
      return response;
    },
    onSuccess: (response, variables) => {
      if (response.status) {
        removeCard(variables);
      }
    },
  });
};

export const useGetSudoCard = () => {
  return useQuery({
    queryKey: [QueryKeys.Get_Sudo_Card],
    queryFn: async () => {
      const response = await CardService.getSudoCardDetails();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetOfundsCard = () => {
  return useQuery({
    queryKey: [QueryKeys.Get_Ofunds_Card],
    queryFn: async () => {
      const response = await CardService.getOfundsCardDetails();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useRequestOfundsCard = () => {
  const addCard = useJetsendUserStore((state) => state.addCard);

  return useMutation({
    mutationFn: async () => {
      const response = await CardService.requestOfundsCard();
      return response;
    },
    onSuccess: (response) => {
      if (response.status) {
        addCard(response.data);
      }
    },
  });
};

// ATM Card Hooks
export const useGetAtmCardCharge = () => {
  return useQuery({
    queryKey: ["atm-card-charge"],
    queryFn: async () => {
      const response = await CardService.getAtmCardCharge();
      return response.data?.data || "0";
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
};

export const useGetAtmCardRequests = (status?: "processing" | "delivered") => {
  return useQuery({
    queryKey: ["atm-card-requests", status],
    queryFn: async () => {
      const response = await CardService.getAtmCardRequests(status);
      return response.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useRequestAtmCard = () => {
  return useMutation({
    mutationFn: async (payload: AtmCardRequestPayload) => {
      const response = await CardService.requestAtmCard(payload);
      return response;
    },
  });
};
