import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import React from "react";

export default function SignInForm({ error }: { error: string | undefined }) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const email = data.get("email");
    const password = data.get("password");

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
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />

      <Divider sx={{ my: 2 }} />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Login
      </Button>
    </form>
  );
}
