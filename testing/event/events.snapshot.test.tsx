import React from "react";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useGlobalSearchParams: () => ({ event: "7" }),
}));

jest.mock("react-native-elements", () => ({
  Icon: () => null,
}));

jest.mock("@/services/eventsService", () => ({
  fetchSingleEventData: jest.fn(),
  getGeo: jest.fn(),
}));

import SingleEventPage from "../../app/event/[event]";
import { fetchSingleEventData, getGeo } from "@/services/eventsService";

describe("SingleEventPage – snapshot", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot for a typical event", async () => {
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      title: "Christmas Eve Celebration",
      group: "SOL Church",
      description: "Evening worship and fellowship",
      date: "Dec 24, 2025",
      location: "Main Hall",
      image: null,
    });

    (getGeo as jest.Mock).mockResolvedValueOnce({
      result: {
        addressMatches: [{ coordinates: { x: -121.22, y: 38.67 } }],
      },
    });

    const { toJSON } = render(<SingleEventPage />);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
