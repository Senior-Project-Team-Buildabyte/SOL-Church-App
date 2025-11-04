import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert, Pressable } from "react-native";
import Login from "../app/[auth]/login";

// Local mocks 
jest.mock("expo-router", () => {
  const push = jest.fn();
  const dismissTo = jest.fn();
  return {
    useRouter: () => ({ push, dismissTo }),
  };
});

jest.mock("@/services/auth.service", () => ({
  authService: {
    signInWithEmail: jest.fn(),
  },
}));

jest.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("Login Page", () => {
  const mockRouter = require("expo-router").useRouter();
  const { authService } = require("@/services/auth.service");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic UI elements", () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    expect(getByText("Email login")).toBeTruthy();
    expect(getByPlaceholderText("email@address.com")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log in")).toBeTruthy();
  });

  it("navigates to Create Account when pressed", () => {
    const { UNSAFE_getAllByType } = render(<Login />);
    const pressables = UNSAFE_getAllByType(Pressable);
    // Order in component: [Create account, Forgot password, Log in]
    fireEvent.press(pressables[0]);
    expect(mockRouter.push).toHaveBeenCalledWith("../[auth]/sign-up");
  });

  it("navigates to Forgot Password when pressed", () => {
    const { UNSAFE_getAllByType } = render(<Login />);
    const pressables = UNSAFE_getAllByType(Pressable);
    fireEvent.press(pressables[1]);
    expect(mockRouter.push).toHaveBeenCalledWith("../[auth]/forgot-password");
  });

  it("handles successful login", async () => {
    authService.signInWithEmail.mockResolvedValueOnce(true);

    const { getByPlaceholderText, UNSAFE_getAllByType } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText("email@address.com"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    const pressables = UNSAFE_getAllByType(Pressable);
    fireEvent.press(pressables[2]); // "Log in" button

    await waitFor(() => {
      expect(authService.signInWithEmail).toHaveBeenCalledWith("test@example.com", "password123");
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Logged in successfully.");
      expect(mockRouter.dismissTo).toHaveBeenCalledWith("/");
    });
  });

  it("handles failed login", async () => {
    authService.signInWithEmail.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { getByPlaceholderText, UNSAFE_getAllByType } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText("email@address.com"), "wrong@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");

    const pressables = UNSAFE_getAllByType(Pressable);
    fireEvent.press(pressables[2]); // "Log in" button

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Invalid credentials");
      expect(mockRouter.dismissTo).not.toHaveBeenCalled();
    });
  });
});
