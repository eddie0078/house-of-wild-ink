"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export interface DeleteActionButtonProps {
  id: string;
  title: string;
  itemType?: string;
  endpoint?: string; // defaults to "/api/content"
  variant?: "icon" | "button" | "danger-button";
  size?: "sm" | "md";
  className?: string;
  redirectAfterDelete?: string;
  onDeleted?: () => void;
  label?: string;
}

export function DeleteActionButton({
  id,
  title,
  itemType = "work",
  endpoint = "/api/content",
  variant = "button",
  size = "md",
  className = "",
  redirectAfterDelete,
  onDeleted,
  label = "Delete",
}: DeleteActionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const url = `${endpoint}?id=${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete item");
      }

      setIsOpen(false);

      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
      } else if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {variant === "icon" && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
          title={`Delete ${title}`}
          aria-label={`Delete ${title}`}
          className={`p-2 rounded-lg text-red-600/80 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer ${className}`}
        >
          <Trash2 className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300/60 text-red-700 bg-red-50/50 hover:bg-red-100/70 hover:border-red-400 text-xs font-sans font-semibold transition-all cursor-pointer ${className}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      {variant === "danger-button" && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-sans font-semibold tracking-wider uppercase transition-all cursor-pointer ${className}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      )}

      <DeleteConfirmModal
        isOpen={isOpen}
        title={title}
        itemType={itemType}
        isDeleting={isDeleting}
        error={error}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!isDeleting) {
            setIsOpen(false);
            setError(null);
          }
        }}
      />
    </>
  );
}
