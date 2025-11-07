import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Share } from "react-native";

jest.setTimeout(15000);

// Robust router mock (params + navigation + Link passthrough)
jest.mock("expo-router", () => ({
  useGlobalSearchParams: () => ({ event: "42" }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Link: ({ children }: any) => children,
}));

// Silence RN Elements icons if used in the page
jest.mock("react-native-elements", () => ({
  Icon: () => null,
}));

// Mock services used by the page
jest.mock("@/services/eventsService", () => ({
  fetchSingleEventData: jest.fn(),
  getGeo: jest.fn(),
}));

import SingleEventPage from "../../app/event/[event]";
import { fetchSingleEventData, getGeo } from "@/services/eventsService";

describe("SingleEventPage – Share Button", () => {
  afterEach(() => jest.clearAllMocks());

  it("calls Share.share with the correct message", async () => {
    // spy on real RN Share
    const shareSpy = jest
      .spyOn(Share, "share")
      .mockResolvedValue({ action: "sharedAction" } as any);

    // Mock the event data to resolve immediately
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      title: "Youth Gathering",
      description: "Weekly meetup for young adults",
      date: "Nov 12, 2025",
      location: "Youth Center",
      image: null,
    });

    // Mock geocoding to avoid network/timeouts
    (getGeo as jest.Mock).mockResolvedValueOnce({
      result: { addressMatches: [{ coordinates: { x: -121.22, y: 38.67 } }] },
    });

    const { findByText } = render(<SingleEventPage />);
    const shareButton = await findByText("Share");

    fireEvent.press(shareButton);

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledTimes(1);
      const args = shareSpy.mock.calls[0][0];
      expect(args.message).toContain("Youth Gathering");
      expect(args.message).toContain("Nov 12, 2025");
      expect(args.message).toContain("Weekly meetup for young adults");
    });

    shareSpy.mockRestore();
  });
});
