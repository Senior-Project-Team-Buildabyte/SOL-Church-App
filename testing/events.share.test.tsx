import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Share } from "react-native";

jest.mock("expo-router", () => ({
  useGlobalSearchParams: () => ({ event: "42" }),
}));

jest.mock("react-native-elements", () => ({
  Icon: () => null,
}));

jest.mock("@/services/eventsService", () => ({
  fetchSingleEventData: jest.fn(),
  getGeo: jest.fn(),
}));

import SingleEventPage from "../app/event/[event]";
import { fetchSingleEventData, getGeo } from "@/services/eventsService";

describe("SingleEventPage – Share Button", () => {
  afterEach(() => jest.clearAllMocks());

  it("calls Share.share with the correct message", async () => {
    // spy on the real Share object imported from react-native
    const shareSpy = jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });

    // Mock the event data
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      title: "Youth Gathering",
      description: "Weekly meetup for young adults",
      date: "Nov 12, 2025",
      location: "Youth Center",
      image: null,
    });

    // Mock getGeo to avoid undefined errors
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
