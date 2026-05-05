import axiosInstance from "./axios-instance";

export interface TransactionData {
  id: number;
  hash: string;
  code: number;
  title: string;
  bank_name: string;
  bank_code: string;
  account_name: string;
  account_number: string;
  amount: number;
  amount_paid: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  status: number; // 1 = pending, 2 = success
  type: number;
  fee: number;
  note: string | null;
  description: string;
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

export interface TransactionInitResponse {
  status: boolean;
  data: {
    data: TransactionData;
    message: string;
  };
}

export interface TransactionProcessResponse {
  status: string;
  user_type: string;
  message: string; // "Please check your email for your otp to complete transaction"
}

export interface TransactionVerifyResponse {
  status: boolean;
  data: {
    message: string;
    data: TransactionData;
  };
  message: string;
}

export class TransactionService {
  // TRANSFER (to bank account)
  static async initTransfer(
    bank_id: number,
    amount: string,
    note: string,
  ): Promise<TransactionInitResponse> {
    const response = await axiosInstance.post("/transfer", {
      bank_id,
      amount,
      note,
    });
    return response.data;
  }

  static async processTransfer(
    hash: string,
    pin: string,
  ): Promise<TransactionProcessResponse> {
    const response = await axiosInstance.post("/process/transfer", {
      hash,
      pin,
    });
    return response.data;
  }

  static async verifyTransfer(
    hash: string,
    otp_code: string,
  ): Promise<TransactionVerifyResponse> {
    const response = await axiosInstance.post("/verify/transfer", {
      hash,
      otp_code,
    });
    return response.data;
  }

  // GIFTING (P2P transfer)
  static async initGifting(
    email: string,
    amount: string,
    note: string,
  ): Promise<TransactionInitResponse> {
    const response = await axiosInstance.post("/gifting", {
      email,
      amount,
      note,
    });
    return response.data;
  }

  static async processGifting(
    hash: string,
    pin: string,
  ): Promise<TransactionProcessResponse> {
    const response = await axiosInstance.post("/process/gifting", {
      hash,
      pin,
    });
    return response.data;
  }

  static async verifyGifting(
    hash: string,
    otp_code: string,
  ): Promise<TransactionVerifyResponse> {
    const response = await axiosInstance.post("/verify/gifting", {
      hash,
      otp_code,
    });
    return response.data;
  }

  // OFUNDS TRANSFER (wallet to wallet)
  static async initOfundsTransfer(
    recipient_id: number,
    amount: string,
    note: string,
  ): Promise<TransactionInitResponse> {
    const response = await axiosInstance.post("/ofunds/transfer", {
      recipient_id,
      amount,
      note,
    });
    return response.data;
  }

  static async processOfundsTransfer(
    hash: string,
    pin: string,
  ): Promise<TransactionProcessResponse> {
    const response = await axiosInstance.post("/process/ofunds/transfer", {
      hash,
      pin,
    });
    return response.data;
  }

  static async verifyOfundsTransfer(
    hash: string,
    otp_code: string,
  ): Promise<TransactionVerifyResponse> {
    const response = await axiosInstance.post("/verify/ofunds/transfer", {
      hash,
      otp_code,
    });
    return response.data;
  }

  // TRANSACTION HISTORY
  static async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    status: boolean;
    data: TransactionHistoryItem[];
    links: any;
    meta: any;
    message: string;
  }> {
    const response = await axiosInstance.get(
      `/transactions?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  static async getTransactionDetails(
    id: number,
  ): Promise<{ status: boolean; data: TransactionData; message: string }> {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  }

  // 2FA Transaction endpoints
  static async initTransaction2FA(
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
  ): Promise<TransactionInitResponse> {
    const response = await axiosInstance.post(`/${type}/2fa/init`, data);
    return response.data;
  }

  static async verify2FA(
    hash: string,
    otp_code: string,
  ): Promise<TransactionVerifyResponse> {
    const response = await axiosInstance.post("/2fa/verify", {
      hash,
      otp_code,
    });
    return response.data;
  }
}
