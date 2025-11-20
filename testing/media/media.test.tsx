import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import MediaPage from "../../app/(tabs)/media";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("MediaPage", () => {
  const openURLSpy = jest
    .spyOn(Linking, "openURL")
    .mockImplementation(async () => undefined);

  const canOpenURLSpy = jest
    .spyOn(Linking, "canOpenURL")
    .mockImplementation(async () => true);

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders 4 tappable buttons", () => {
    const { UNSAFE_getAllByType } = render(<MediaPage />);
    const buttons = UNSAFE_getAllByType(require("react-native").Pressable);
    expect(buttons.length).toBe(4);
  });

  it("pressing external buttons opens the correct URLs", async () => {
    const { UNSAFE_getAllByType } = render(<MediaPage />);
    const pressables = UNSAFE_getAllByType(require("react-native").Pressable);

    const expectedExternalUrls = [
      "https://www.youtube.com/live/WAkwMg375ig?si=w-9a2XTOoCpN6tAX",
      "https://youtube.com/@soltv3023?si=aeGhE6sob2WDm8kp",
      "https://www.google.com/",
    ];

    for (let i = 0; i < 3; i++) {
      await fireEvent.press(pressables[i]);
      expect(canOpenURLSpy).toHaveBeenNthCalledWith(i + 1, expectedExternalUrls[i]);
      expect(openURLSpy).toHaveBeenNthCalledWith(i + 1, expectedExternalUrls[i]);
    }
  });

  it("pressing internal button navigates correctly", async () => {
    const { UNSAFE_getAllByType } = render(<MediaPage />);
    const pressables = UNSAFE_getAllByType(require("react-native").Pressable);
    await fireEvent.press(pressables[3]);
    expect(mockPush).toHaveBeenCalledWith("../media/lyrics");
  });
});
