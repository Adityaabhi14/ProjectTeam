// Frontend-only CarePoint login service.
// No backend or API is required.

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResult = {
  success: boolean;
  message: string;
};

// Demo credentials
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

export const signInToCarePoint = async ({
  username,
  password,
}: LoginCredentials): Promise<LoginResult> => {
  const cleanUsername = username.trim();

  // Basic validation
  if (!cleanUsername || !password) {
    return {
      success: false,
      message: "Please enter both username and password.",
    };
  }

  // Small delay to make the demo feel like a real login request
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Frontend-only authentication
  if (
    cleanUsername === DEMO_USERNAME &&
    password === DEMO_PASSWORD
  ) {
    return {
      success: true,
      message: "Login successful.",
    };
  }

  return {
    success: false,
    message: "Invalid username or password. Try admin / admin123.",
  };
};