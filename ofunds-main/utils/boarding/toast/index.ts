import { toast } from "sonner";
import { capitalize } from "@/utils/text";

interface ToastParams {
  title: string;
  message: string;
}

export const successToast = ({ title, message }: ToastParams) => {
  const heading = title.split("_").join(" ");
  toast.success(capitalize(heading), {
    description: message,
    closeButton: true,
    // style: {
    //   backgroundColor: "#0E1512", // Softer green background
    //   color: "#B1F1CB", // Deep teal green text
    //   border: 'transparent'
    // },
    //  classNames: {
    //   toast: 'toast',
    //   title: 'title',
    //   description: 'description',
    //   actionButton: 'action-button',
    //   cancelButton: 'cancel-button',
    //   closeButton: 'close-button',
    // },
    // className:
    //   "dark:bg-green-900/30 dark:text-green-400 shadow-md rounded-lg",
  });
};

export const errorToast = ({ title, message }: ToastParams) => {
  const heading = title.split("_").join(" ");
  toast.error(capitalize(heading), {
    description: message,
    closeButton: true,
    // style: {
    //   backgroundColor: "#fee2e2", // Light red background
    //   color: "#b91c1c", // Dark red text
    //   border: "1px solid #f87171", // Red border
    // },
    // className:
    //   "dark:bg-red-900/30 dark:text-red-400 shadow-lg rounded-md",
  });
};
