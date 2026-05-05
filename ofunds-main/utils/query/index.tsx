import { Query, QueryKey } from "@tanstack/react-query";
import { logger } from "@/utils/logger";
import { QueryTextProps, capitalize, errorText } from "@/utils/text";
import { errorToast } from "@/utils/toast";
// import { QueryErrCodes } from "@/models/query";
import { AxiosError } from "axios";

interface QueryCacheOnError {
  message: string | undefined | null;
  query: Query<unknown, unknown, unknown, QueryKey>;
}

export function queryCacheOnError({ message, query }: QueryCacheOnError) {
  switch (query.meta?.errCode) {
    case "PAYSTACK_BANKS":
    case "ACCOUNT_VERIFICATION":
      // Silently handle - no toast for bank resolution / account verification
      break;
    default:
      errorToast(message ?? "Something went wrong. Please try again later");
      break;
  }
}

export interface QueryKeysProps {
  key: string;
  other?: string;
}

export function queryKeyWithProps({ key, other }: QueryKeysProps) {
  const queryKeys = [key];

  if (other) {
    queryKeys.push(other);
  }

  return queryKeys;
}

interface Props extends QueryTextProps {
  error: AxiosError<{ message: string }>;
  desc: string;
  title: string;
}

export const queryErrorMessage = (error: AxiosError<{ message: string }>) => {
  if (!error) return;
  const message = error?.response?.data?.message;
  logger("query error message", error.message);
  return message ? capitalize(message) : undefined;
};

export const queryOnError = ({
  error,
  desc,
  isDelete,
  isEdit,
  title,
}: Props) => {
  const message = queryErrorMessage(error);
  errorToast( message ?? `${errorText({ isEdit, isDelete })} ${desc}`);
};
