import axiosInstance from "./axios-instance";

export interface Card {
  id: number;
  user_id: number;
  card_type: "sudo" | "ofunds"; // or others
  card_number: string; // usually masked: last 4 digits
  status: string; // active, inactive, blocked
  expiry_date: string;
  cvv: string;
  created_at: string;
  updated_at: string;
}

export interface CardPricing {
  card_type: string;
  amount: number;
  currency: string;
}

export interface CardResponse {
  status: boolean;
  data: Card | Card[];
  message: string;
}

// ATM Card Request types
export interface AtmCardRequest {
  id: number;
  user_id: number;
  transaction_id: number;
  phone: string;
  state: string;
  lga: string;
  street: string;
  email: string;
  status: "processing" | "delivered";
  created_at: string;
  updated_at: string;
}

export interface AtmCardRequestPayload {
  phone: string;
  state: string;
  lga: string;
  street: string;
}

export interface AtmCardRequestResponse {
  status: boolean;
  data: {
    message: string;
    data: AtmCardRequest;
  };
}

export interface AtmCardChargeResponse {
  status: boolean;
  data: {
    message: string;
    data: string; // Card charge amount as string
  };
}

export interface AtmCardRequestsResponse {
  status: boolean;
  data: {
    message: string;
    data: AtmCardRequest[];
  };
}

export class CardService {
  static async requestCard(
    card_type: "sudo" | "ofunds",
  ): Promise<{ status: boolean; data: Card; message: string }> {
    const response = await axiosInstance.post("/cards/request", {
      card_type,
    });
    return response.data;
  }

  static async getUserCards(): Promise<{
    status: boolean;
    data: Card[];
    message: string;
  }> {
    const response = await axiosInstance.get("/user/cards");
    return response.data;
  }

  static async getCardPrice(): Promise<{
    status: boolean;
    data: CardPricing[];
    message: string;
  }> {
    const response = await axiosInstance.get("/cards/price");
    return response.data;
  }

  static async getCardDetails(
    card_id: number,
  ): Promise<{ status: boolean; data: Card; message: string }> {
    const response = await axiosInstance.get(`/cards/${card_id}`);
    return response.data;
  }

  static async activateCard(
    card_id: number,
  ): Promise<{ status: boolean; data: Card; message: string }> {
    const response = await axiosInstance.post(`/cards/${card_id}/activate`, {});
    return response.data;
  }

  static async deactivateCard(
    card_id: number,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post(
      `/cards/${card_id}/deactivate`,
      {},
    );
    return response.data;
  }

  static async deleteCard(
    card_id: number,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.delete(`/cards/${card_id}`);
    return response.data;
  }

  // Sudo card specific endpoints
  static async getSudoCardDetails(): Promise<{
    status: boolean;
    data: Card;
    message: string;
  }> {
    const response = await axiosInstance.get("/sudo/card");
    return response.data;
  }

  // Ofunds card specific endpoints
  static async getOfundsCardDetails(): Promise<{
    status: boolean;
    data: Card;
    message: string;
  }> {
    const response = await axiosInstance.get("/ofunds/card");
    return response.data;
  }

  static async requestOfundsCard(): Promise<{
    status: boolean;
    data: Card;
    message: string;
  }> {
    const response = await axiosInstance.post("/ofunds/card/request", {});
    return response.data;
  }

  // ATM Card endpoints
  static async requestAtmCard(payload: AtmCardRequestPayload): Promise<AtmCardRequestResponse> {
    const response = await axiosInstance.post("/card/request", payload);
    return response.data;
  }

  static async getAtmCardCharge(): Promise<AtmCardChargeResponse> {
    const response = await axiosInstance.get("/card/charge");
    return response.data;
  }

  static async getAtmCardRequests(status?: "processing" | "delivered"): Promise<AtmCardRequestsResponse> {
    const url = status ? `/card/requests?status=${status}` : "/card/requests";
    const response = await axiosInstance.get(url);
    return response.data;
  }
}
