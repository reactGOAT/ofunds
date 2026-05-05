/**
 *
 * @param desc a pointer that helps to keep track of the log
 * @param message The info that you want to console
 *  @description Only logs on local development
 */

import { Constants } from "@/utils/constants";

export const logger = (desc: string, ...message: any[]) => {
  if (Constants.isDev) {
    console.log(`This is ${desc} ==>`, ...message);
  }
};
