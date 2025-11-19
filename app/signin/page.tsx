import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AuthForm from "@/components/Auth/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorType = (await searchParams).error;

  const errorMessage = {
    Configuration:
      "There is a configuration issue with the authentication provider.",
    AccessDenied: "You do not have permission to access this resource.",
    Verification:
      "There was an issue verifying your account. Please try again.",
    Default:
      "An unknown error occurred during authentication. Please try again.",
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login Page
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AuthForm
          error={errorMessage[errorType as keyof typeof errorMessage]}
        />
      </Box>
    </Box>
  );
}
