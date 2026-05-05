export class Constants {
  static redirect = "redirect";
  static readonly baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://quickrooms.app";
  static readonly appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://app.quickrooms.app";
  static readonly isDev = process.env.NEXT_PUBLIC_ENV === "dev";
  static readonly isStaging =
    process.env.NEXT_PUBLIC_API_BASE_URL === "https://staging.quickrooms.app/api";
  static readonly defaultAvatar =
    "https://firebasestorage.googleapis.com/v0/b/nestuge.appspot.com/o/default_avatar.png?alt=media&token=a49ee4f4-8138-4773-9abf-c334f5e54776";
  static readonly defaultPhoneNumber = "+2345652342345";
}
