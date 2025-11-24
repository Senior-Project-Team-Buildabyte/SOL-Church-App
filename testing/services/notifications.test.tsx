import React from "react";
import { render } from "@testing-library/react-native";
import NotificationSettings from "@/app/settings/notification-settings";
import { useAuth } from "@/components/universal/useAuth";

jest.mock("@/components/universal/useAuth");

describe("NotificationSettings (Simple Tests)", () => {
  it("renders loading screen first", () => {
    (useAuth as jest.Mock).mockReturnValue({
      session: { user: { id: "user123" } },
    });

    const { getByText } = render(<NotificationSettings />);

    expect(getByText("Loading notification settings…")).toBeTruthy();
  });

  it("renders sign-in message when no session", () => {
    (useAuth as jest.Mock).mockReturnValue({
      session: null,
    });

    const { getByText } = render(<NotificationSettings />);

    expect(
      getByText("Please sign in to manage your notification preferences.")
    ).toBeTruthy();
  });
});
