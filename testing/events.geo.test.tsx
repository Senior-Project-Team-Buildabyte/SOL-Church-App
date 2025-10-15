import React from "react";
import { render, waitFor } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useGlobalSearchParams: () => ({ event: "9" }),
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

describe("SingleEventPage – geolocation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls getGeo with the event location and renders without errors", async () => {
    (fetchSingleEventData as jest.Mock).mockResolvedValueOnce({
      title: "Prayer Night",
      description: "",
      date: "Jan 10, 2026",
      location: "Chapel A",
      image: null,
    });

    (getGeo as jest.Mock).mockResolvedValueOnce({
      result: {
        addressMatches: [{ coordinates: { x: -121.205, y: 38.675 } }],
      },
    });

    const { toJSON, findByText } = render(<SingleEventPage />);
    await findByText("Chapel A");

    await waitFor(() => {
      expect(getGeo).toHaveBeenCalledWith("Chapel A");
      expect(toJSON()).toBeTruthy();
    });
  });
});
