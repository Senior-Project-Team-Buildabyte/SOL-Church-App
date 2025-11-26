import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import NotificationSettings from "@/app/settings/notification-settings";
import { useAuth } from "@/components/universal/useAuth";

// ---------------------------
// Mock AsyncStorage
// ---------------------------
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// ---------------------------
// Mock Auth
// ---------------------------
jest.mock("@/components/universal/useAuth", () => ({
  useAuth: jest.fn(),
}));

(useAuth as jest.Mock).mockReturnValue({
  session: { user: { id: "user123" } },
});

// ---------------------------
// Mock Supabase
// ---------------------------
const mockSingle = jest.fn();
const mockUpsert = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: mockSingle.mockResolvedValue({
        data: {
          user_id: "user123",
          notifications_enabled: false,
          general: false,
          youth: false,
          womens_ministry: false,
          teens: false,
          solru: false,
          mens: false,
        },
        error: null,
      }),
      upsert: mockUpsert.mockResolvedValue({ error: null }),
    })),
  },
}));

// Type for switch element
type SwitchElement = {
  props: {
    disabled?: boolean;
    value?: boolean;
  };
};

// ---------------------------
// TEST SUITE
// ---------------------------
describe("NotificationSettings — UI Behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the master switch", async () => {
    const screen = render(<NotificationSettings />);

    const switches = await screen.findAllByRole("switch");
    const masterSwitch = switches[0] as SwitchElement;

    expect(masterSwitch).toBeTruthy();
    expect(masterSwitch.props.value).toBe(false);
  });

  it("toggles master switch and calls Supabase", async () => {
    const screen = render(<NotificationSettings />);

    const switches = await screen.findAllByRole("switch");
    const master = switches[0] as SwitchElement;

    fireEvent(master as any, "valueChange", true);


    await waitFor(() => expect(mockUpsert).toHaveBeenCalled());
  });

  it("disables category switches when master OFF", async () => {
    const screen = render(<NotificationSettings />);

    const switches = await screen.findAllByRole("switch");
    const categories = switches.slice(1) as SwitchElement[];

    categories.forEach((sw: SwitchElement) => {
      expect(sw.props.disabled).toBe(true);
    });
  });

  it("enables category switches when master ON", async () => {
    const screen = render(<NotificationSettings />);

    let switches = await screen.findAllByRole("switch");
    const master = switches[0];

    fireEvent(master, "valueChange", true);

    switches = await screen.findAllByRole("switch");
    const categories = switches.slice(1) as SwitchElement[];

    categories.forEach((sw: SwitchElement) => {
      expect(sw.props.disabled).toBe(false);
    });
  });
});
