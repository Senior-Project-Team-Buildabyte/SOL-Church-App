import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import ContactsIcons from "@/components/universal/contacts-icons";

// Mock expo-linking
jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

const openURLMock = Linking.openURL as jest.Mock;

describe("ContactsIcons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls tel: link when phone icon is pressed", async () => {
    openURLMock.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<ContactsIcons />);

    await act(async () => {
      fireEvent.press(getByTestId("contact-phone"));
    });

    expect(openURLMock).toHaveBeenCalledTimes(1);
    expect(openURLMock).toHaveBeenCalledWith("tel:+19167987306");
  });

  it("tries Instagram app URL then falls back to web URL if app fails", async () => {
    openURLMock
      .mockRejectedValueOnce(new Error("instagram app failed")) // app URL
      .mockResolvedValueOnce(undefined); // web URL

    const { getByTestId } = render(<ContactsIcons />);

    await act(async () => {
      fireEvent.press(getByTestId("contact-instagram"));
    });

    expect(openURLMock).toHaveBeenCalledTimes(2);
    expect(openURLMock).toHaveBeenNthCalledWith(
      1,
      "instagram://user?username=sol_sacramento"
    );
    expect(openURLMock).toHaveBeenNthCalledWith(
      2,
      "https://www.instagram.com/sol_sacramento/"
    );
  });

  it("shows an Alert if both Facebook app and web URLs fail", async () => {
    openURLMock
      .mockRejectedValueOnce(new Error("fb app failed"))
      .mockRejectedValueOnce(new Error("fb web failed"));

    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined as any);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByTestId } = render(<ContactsIcons />);

    await act(async () => {
      fireEvent.press(getByTestId("contact-facebook"));
    });

    expect(openURLMock).toHaveBeenCalledTimes(2);
    expect(openURLMock).toHaveBeenNthCalledWith(
      1,
      "fb://profile/100064281505779"
    );
    expect(openURLMock).toHaveBeenNthCalledWith(
      2,
      "https://www.facebook.com/churchSOL"
    );

    expect(alertSpy).toHaveBeenCalledWith("Error", "Something went wrong.");
    expect(consoleErrorSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("shows an Alert if website link fails", async () => {
    openURLMock.mockRejectedValueOnce(new Error("web failed"));

    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined as any);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByTestId } = render(<ContactsIcons />);

    await act(async () => {
      fireEvent.press(getByTestId("contact-web"));
    });

    expect(openURLMock).toHaveBeenCalledTimes(1);
    expect(openURLMock).toHaveBeenCalledWith("https://www.solsacramento.com/");

    expect(alertSpy).toHaveBeenCalledWith("Error", "Something went wrong.");
    expect(consoleErrorSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("tries YouTube app URL then web URL when app fails", async () => {
    openURLMock
      .mockRejectedValueOnce(new Error("yt app failed"))
      .mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<ContactsIcons />);

    await act(async () => {
      fireEvent.press(getByTestId("contact-youtube"));
    });

    expect(openURLMock).toHaveBeenCalledTimes(2);
    expect(openURLMock).toHaveBeenNthCalledWith(
      1,
      "youtube://www.youtube.com/SpringofLifeChurchSOL"
    );
    expect(openURLMock).toHaveBeenNthCalledWith(
      2,
      "https://www.youtube.com/SpringofLifeChurchSOL"
    );
  });
});
