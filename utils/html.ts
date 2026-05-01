export const stripHtml = (html: string | undefined): string => {
  if (!html) return "No content yet";

  // Remove HTML tags
  const stripped = html.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = stripped;
  const decoded = textarea.value;

  return decoded.trim() || "No content yet";
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
