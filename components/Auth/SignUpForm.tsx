"use client";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import React from "react";

import { userRegister } from "@/libs/auth";

export default function SignUpForm({ error }: { error: string | undefined }) {
  const [fieldErrors, setFieldErrors] = React.useState<{
    [key: string]: string;
  }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    const data = new FormData(event.currentTarget as HTMLFormElement);
    const fullName = data.get("fullName");
    const email = data.get("email");
    const telephone = data.get("telephone");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    if (password == null || String(password).length < 6) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    const emailStr =
      typeof email === "string"
        ? email.trim()
        : email
          ? String(email).trim()
          : "";

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailStr || !emailRegex.test(emailStr)) {
      setFieldErrors((prev) => ({ ...prev, email: "Invalid email address." }));
      return;
    }

    // continue with submission (example)
    const payload = {
      name: fullName ? String(fullName).trim() : "",
      email: emailStr,
      tel: telephone ? String(telephone).trim() : "",
      password: password ? String(password) : "",
      role: "staff",
    } as User;

    await userRegister(payload);

    signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <Typography color="error" variant="body2" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <TextField
        error={!!fieldErrors.fullName}
        helperText={fieldErrors.fullName}
        margin="normal"
        required
        fullWidth
        label="Full Name"
        name="fullName"
        autoComplete="name"
        autoFocus
      />

      <TextField
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        autoComplete="email"
      />

      <TextField
        error={!!fieldErrors.telephone}
        helperText={fieldErrors.telephone}
        margin="normal"
        required
        fullWidth
        label="Telephone Number"
        name="telephone"
        autoComplete="tel"
      />

      <TextField
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        margin="normal"
        required
        fullWidth
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
      />

      <TextField
        error={!!fieldErrors.confirmPassword}
        helperText={fieldErrors.confirmPassword}
        margin="normal"
        required
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
      />

      <Divider sx={{ my: 2 }} />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Register
      </Button>
    </form>
  );
}
