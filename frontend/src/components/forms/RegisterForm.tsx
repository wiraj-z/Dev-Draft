"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/providers/AuthProvider";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({ username, email, password });
      router.push("/login?registered=1");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <Input
        label="Username"
        name="username"
        autoComplete="username"
        required
        minLength={1}
        maxLength={50}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={2}
        maxLength={50}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <Button type="submit" className="w-full cursor-pointer" isLoading={isLoading}>
        Create account
      </Button>
    </form>
  );
}
