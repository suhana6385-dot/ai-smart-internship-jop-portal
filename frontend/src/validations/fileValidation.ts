import { FILE_UPLOAD } from "@/constants/appConstants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a File against the app's resume upload rules (type + size).
 * Not currently wired into ResumeAnalyzer's upload (that page is part
 * of the completed Student module), but ready to drop into any new
 * upload form — Company job/internship attachments, admin bulk
 * imports, etc.
 */
export function validateResumeFile(file: File): FileValidationResult {
  const maxBytes = FILE_UPLOAD.maxResumeSizeMb * 1024 * 1024;

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File is too large. Max size is ${FILE_UPLOAD.maxResumeSizeMb}MB.`,
    };
  }

  const hasValidExtension = FILE_UPLOAD.acceptedResumeTypes.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );
  const hasValidMimeType = FILE_UPLOAD.acceptedResumeMimeTypes.includes(file.type);

  if (!hasValidExtension && !hasValidMimeType) {
    return {
      valid: false,
      error: `Unsupported file type. Accepted formats: ${FILE_UPLOAD.acceptedResumeTypes.join(", ")}.`,
    };
  }

  return { valid: true };
}
