import Dialog, { DialogProps } from "@mui/material/Dialog";

import AuthForm from "./AuthForm";

interface AuthDialogProps extends DialogProps {
  error?: string;
}

export default function AuthDialog({ error, open, ...props }: AuthDialogProps) {
  return (
    <Dialog
      open={open}
      {...props}
      aria-labelledby="auth-dialog-title"
      aria-describedby="auth-dialog-description"
    >
      <AuthForm error={error} />
    </Dialog>
  );
}
