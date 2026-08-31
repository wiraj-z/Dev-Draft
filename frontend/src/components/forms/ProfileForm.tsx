"use client";

import { FormEvent, useState } from "react";
import { updateUser } from "@/lib/api/users";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/providers/AuthProvider";

export function ProfileForm() {
  const { user, token, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !token) {
    return null;
  }

  const userId = user.id;
  const accessToken = token;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const updatedUser = await updateUser(
        userId,
        { username, email },
        accessToken,
      );
      setUser(updatedUser);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update profile"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Input
        label="Username"
        name="username"
        required
        maxLength={50}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Button type="submit" isLoading={isLoading}>
        Save changes
      </Button>
    </form>
  );
}
