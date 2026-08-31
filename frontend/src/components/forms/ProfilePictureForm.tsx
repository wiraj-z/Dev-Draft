"use client";

import { ChangeEvent, useState } from "react";
import {
  deleteProfilePicture,
  uploadProfilePicture,
} from "@/lib/api/users";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/providers/AuthProvider";

export function ProfilePictureForm() {
  const { user, token, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user || !token) {
    return null;
  }

  const userId = user.id;
  const accessToken = token;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsUploading(true);

    try {
      const updatedUser = await uploadProfilePicture(userId, file, accessToken);
      setUser(updatedUser);
      setMessage("Profile picture updated.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to upload image"));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete() {
    setError(null);
    setMessage(null);
    setIsDeleting(true);

    try {
      const updatedUser = await deleteProfilePicture(userId, accessToken);
      setUser(updatedUser);
      setMessage("Profile picture removed.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete profile picture"));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <div className="flex items-center gap-4">
        <Avatar
          imagePath={user.image_path}
          username={user.username}
          size="lg"
        />
        <div className="space-y-2">
          <label className="inline-block">
            <span className="sr-only">Upload profile picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-500 hover:file:bg-surface-hover hover:file:text-brand-400 file:transition-colors"
            />
          </label>
          {user.image_file ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Remove picture
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove profile picture?"
        message="This will delete your current profile picture."
        confirmLabel="Remove"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
