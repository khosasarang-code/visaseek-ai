"use client";

import { useRef } from "react";
import { ArrowUp, Paperclip, X, FileText, Loader2 } from "lucide-react";
import {
  ACCEPTED_FILE_TYPES,
  formatFileSize,
  isAcceptedFile,
} from "@/lib/file-upload";

export interface PendingFile {
  file: File;
  previewUrl?: string;
  progress: number;
}

interface ChatInputProps {
  input: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  pendingFile: PendingFile | null;
  uploadProgress: number | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function ChatInput({
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading,
  pendingFile,
  uploadProgress,
  onFileSelect,
  onRemoveFile,
  textareaRef,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isAcceptedFile(file)) {
      onFileSelect(file);
    }
    e.target.value = "";
  };

  return (
    <div className="mx-auto w-full max-w-[680px]">
      {pendingFile && (
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          {pendingFile.previewUrl ? (
            <img
              src={pendingFile.previewUrl}
              alt="Preview"
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {pendingFile.file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(pendingFile.file.size)}
            </p>
            {uploadProgress !== null && uploadProgress < 100 && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
          {uploadProgress !== null && uploadProgress < 100 ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <button
              type="button"
              onClick={onRemoveFile}
              className="rounded-lg p-1 hover:bg-gray-200"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-md">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="mb-1 shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about immigration..."
            rows={1}
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={(!input.trim() && !pendingFile) || isLoading}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800 disabled:opacity-40"
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
