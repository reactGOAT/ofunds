export const getFileTypeFromUrl = (
  url: string | null | undefined,
): "image" | "pdf" | "unknown" => {
  // Check if url is null, undefined, or not a string
  if (!url || typeof url !== "string") {
    return "unknown";
  }

  // Handle cases where the URL might have query parameters (e.g., file.pdf?token=abc)
  const urlWithoutQueryParams = url.split("?")[0];
  const parts = urlWithoutQueryParams.split(".");
  const extension = parts.pop()?.toLowerCase(); // Use optional chaining in case `pop()` returns undefined

  // If no extension found (e.g., a URL like "https://example.com/file"), treat as unknown
  if (!extension) {
    return "unknown";
  }

  // Common image extensions
  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"].includes(
      extension,
    )
  ) {
    return "image";
  }

  // PDF extension
  if (extension === "pdf") {
    return "pdf";
  }

  // Add more types as needed (e.g., video, audio, text, office docs)
  // if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
  // if (['mp3', 'wav', 'aac'].includes(extension)) return 'audio';
  // if (['txt', 'csv', 'json'].includes(extension)) return 'text';
  // if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) return 'document';

  return "unknown"; // Default for other or unrecognized types
};
