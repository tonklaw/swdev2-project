"use client";

import Card, { CardProps } from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from "react";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthFormProps extends CardProps {
  error?: string;
}

export default function AuthForm({ error }: AuthFormProps) {
  const [selectedTab, setTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("Tab changed to:", newValue);
    setTab(newValue);
  };

  return (
    <Card
      sx={{
        padding: 4,
        width: "480px",
        minHeight: "100px",
      }}
    >
      <Tabs
        value={selectedTab}
        aria-label="auth tabs"
        centered
        variant="fullWidth"
        onChange={handleTabChange}
        sx={{
          m: -4,
          mb: 2,
          p: 2,
        }}
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Typography variant="h4" gutterBottom align="center">
        {selectedTab === 0 ? "Login to Your Account" : "Register a New Account"}
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {selectedTab === 0
          ? "Access your account by logging in with your credentials."
          : "Create a new account by filling out the registration form."}
      </Typography>

      {selectedTab === 0 ? (
        <SignInForm error={error} />
      ) : (
        <SignUpForm error={error} />
      )}
    </Card>
  );
}
