import axios, {
  type AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

// Jetsend API base URL
const baseURL =
  process.env.NEXT_PUBLIC_JETSEND_API_URL || "https://jetpayng.co/api";

// Create an Axios instance for Jetsend
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add authorization token interceptor
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: InternalAxiosRequestConfig<any>) => {
    const token = Cookies.get("jetsend:access_token");

    if (token) {
      config.headers = config.headers || new AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
);

// Interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the response body contains a 401 status_code
    if (response?.data?.status_code === 401) {
      // Cookies.remove("jetsend:user");
      // Cookies.remove("jetsend:access_token");
      // Cookies.remove("jetsend:chat_token");
      window.location.href = "/login";
      return Promise.reject(new Error("Token has expired"));
    }

    return response;
  },
  (error: AxiosError) => {
    const status = error?.response?.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = error?.response?.data as any;

    console.error("Error status:", status);
    console.error("Error response data:", responseData);

    // Extract the actual error message from API response
    if (responseData?.message) {
      error.message = responseData.message;
    } else if (responseData?.data?.message) {
      error.message = responseData.data.message;
    }

    if (status === 413) {
      error.message =
        "Content too large. Please reduce the file size and try again.";
      // Optionally, you can attach a custom property for UI handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).isContentTooLarge = true;
    }

    if (status === 401 || status === 500) {
      // Cookies.remove("jetsend:user");
      // Cookies.remove("jetsend:access_token");
      // Cookies.remove("jetsend:chat_token");
      // window.location.href = "/login";
    } else {
      // For other errors, log and propagate the message
      console.error("An error occurred:", error?.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
