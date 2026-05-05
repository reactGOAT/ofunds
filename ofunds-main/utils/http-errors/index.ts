import { isAxiosError } from "axios";
import { AuthError } from "@/utils/http-errors/error";
import { ZodError } from "zod";

interface NetError extends Error {
  status?: number;
}

interface NetErrorReturn<T> {
  type: "array" | "object" | "string";
  error: T;
}

interface ErrorToSend {
  code?: string;
  expected?: string;
  received?: string;
  path?: (string | number | symbol)[]; // <- fixed this line
  message?: any;
  cause?: string;
  key?: string | number | symbol; // <-- FIXED THIS LINE
}
export const nextErrorResponse = (
  error: NetError,
): {
  errors:
    | ErrorToSend
    | NetErrorReturn<ErrorToSend[]>
    | NetError
    | ZodError["issues"];
  status: number;
} => {
  if (error instanceof ZodError) {
    const errorToSend: NetErrorReturn<ErrorToSend[]> = {
      error: error.issues.map(({ code, path, message }) => ({
        code,
        path,
        message,
        key: path[path.length - 1],
      })),
      type: "array",
    };
    return { errors: errorToSend, status: 409 };
    // return { errors: error.issues, status: 409 };
  }

  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        return {
          errors: {
            message: "Invalid Credential",
          },
          status: 409,
        };
      case "AccessDenied":
        return {
          errors: {
            message: "Verify email to continue",
          },
          status: 409,
        };
      case "OAuthAccountNotLinked": {
        return {
          errors: {
            message: error.message,
          },
          status: 409,
        };
      }
      default:
        return { errors: { message: "Something went wrong" }, status: 409 };
    }
  }

  if (error?.cause === "validation") {
    return {
      errors: {
        type: "string",
        message: error.message.replace(/Error:/g, ""),
      },
      status: 409,
    };
  }
  if (error?.cause === "authorization") {
    return {
      errors: {
        type: "string",
        message: error.message.replace(/Error:/g, ""),
      },
      status: 401,
    };
  }

  return { errors: error, status: error?.status ?? 500 };
};

type ApiErrorReturnType = {
  type: "array" | "object" | "string";

  message: any;
};
export const apiErrors = (error: Error): ApiErrorReturnType => {
  if (isAxiosError(error)) {
    return error.response?.data;
  }

  return {
    type: "string",
    message: error.message,
  };
};

/*
TODO: try to catch all possible errors 
reference https://authjs.dev/reference/core/errors
*/
export type ClientErrorType = AuthError["type"] | null;
export const clientErrorMapper = (error: ClientErrorType) => {
  if (!error) return "";
  switch (error) {
    case "OAuthAccountNotLinked":
      return "account with this email already singed in but with a different provider";
    case "AccessDenied":
      return "verify email to continue";
    default:
      return "something went wrong while trying to sign you in";
  }
};
