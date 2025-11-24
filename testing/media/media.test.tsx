import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MediaPage from "../../app/(tabs)/media";
import { mediaService } from "@/services/media.service";
import { Linking, View, Text } from "react-native";
import { useRouter } from "expo-router";

// Mock router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// SAFE mock for DynamicButton — no JSX, no out-of-scope variables
jest.mock("@/components/universal/dynamic-button", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return function MockDynamicButton(props: any) {
    return React.createElement(
      View,
      { testID: "dynamic-button" },
      props.buttons.map((_: any, index: number) =>
        React.createElement(View, { key: index, testID: "media-button" })
      )
    );
  };
});

// Mock Linking
jest.spyOn(Linking, "openURL").mockImplementation(async () => undefined);
jest.spyOn(Linking, "canOpenURL").mockImplementation(async () => true);

// Mock media service
jest.mock("@/services/media.service");

describe("MediaPage basic tests", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("shows loading indicator first", () => {
    (mediaService.getMediaButtons as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<MediaPage />);
    expect(getByText("Loading media...")).toBeTruthy();
  });

  it("shows empty state when no buttons exist", async () => {
    (mediaService.getMediaButtons as jest.Mock).mockResolvedValue([]);

    const { findByText } = render(<MediaPage />);
    expect(await findByText("⚠ No media buttons found.")).toBeTruthy();
  });

  it("renders DynamicButton when data exists", async () => {
    (mediaService.getMediaButtons as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: "Youtube Stream",
        link: "https://youtube.com",
        internal_link: null,
        background_url: null,
        background_key: "evening_service",
        type: 0,
        shape: 0,
        created_at: "2025-01-01",
      },
    ]);

    const { findByTestId, findAllByTestId } = render(<MediaPage />);

    expect(await findByTestId("dynamic-button")).toBeTruthy();

    const btns = await findAllByTestId("media-button");
    expect(btns.length).toBe(1);
  });

  it("handles service errors safely", async () => {
    (mediaService.getMediaButtons as jest.Mock).mockRejectedValue(
      new Error("fail")
    );

    const { findByText } = render(<MediaPage />);
    expect(await findByText("⚠ No media buttons found.")).toBeTruthy();
  });
});
