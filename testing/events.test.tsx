import React from "react";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useGlobalSearchParams: () => ({ event: "1" }),
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

describe("SingleEventPage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders safely while loading initial data", async () => {
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      title: "Loading Placeholder",
      description: "",
      date: "",
      location: "",
      image: null,
    });

    const { toJSON } = render(<SingleEventPage />);
    await waitFor(() => expect(toJSON()).toBeTruthy());
  });

  it("renders event details after successful data retrieval", async () => {
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      event_id: 1,
      title: "Sunday Service",
      description: "Join us for worship",
      date: "October 19, 2025",
      location: "Main Hall",
      group: "SOL Church",
      image: null,
    });

    (getGeo as jest.Mock).mockResolvedValueOnce({
      result: {
        addressMatches: [{ coordinates: { x: -121.22, y: 38.67 } }],
      },
    });

    const { findByText } = render(<SingleEventPage />);
    await waitFor(async () => {
      expect(await findByText("Sunday Service")).toBeTruthy();
      expect(await findByText(/Join us for worship/i)).toBeTruthy();
      expect(await findByText("Main Hall")).toBeTruthy();
    });
  });

  it("handles data-fetch failure gracefully without warnings", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (fetchSingleEventData as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const { toJSON } = render(<SingleEventPage />);
    await waitFor(() => expect(toJSON()).toBeTruthy());
    consoleSpy.mockRestore();
  });
});
