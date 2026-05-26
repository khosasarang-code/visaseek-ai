export const ACCEPTED_FILE_TYPES =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const ACCEPTED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "doc",
  "docx",
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ACCEPTED_EXTENSIONS.includes(ext);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getFileKind(
  file: File
): "image" | "pdf" | "document" {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "document";
}

export function getMediaType(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] ?? file.type ?? "application/octet-stream";
}

export function getUploadAckMessage(kind: "image" | "pdf" | "document"): string {
  if (kind === "image") {
    return "I can see your uploaded image. Let me review it...";
  }
  if (kind === "pdf") {
    return "I can see you uploaded a document. Let me analyze it for you...";
  }
  return "I can see you uploaded a document. Let me review it for you...";
}
