import { Metadata } from "next";

export const getMetaData = ({ description = "", ...r }: Metadata): Metadata => {
  return {
    title: {
      default: "Overview",
      template: "%s - 360HR",
    },
    description,
    icons: {
      icon: ["/favicon.ico"],
      apple: ["/apple-touch-icon.png"],
      shortcut: ["/apple-touch-icon.png"],
    },
    ...r,
  };
};
