// testing/connect.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Linking, TouchableOpacity } from "react-native";

// path is from /testing → /app
import ConnectPage from "../../app/(tabs)/connect";

describe("Connect page", () => {
  const openURLSpy = jest
    .spyOn(Linking, "openURL")
    .mockImplementation(async () => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows header text", () => {
    const { getByText } = render(<ConnectPage />);
    expect(getByText("Get Involved")).toBeTruthy();
    expect(getByText("Steps to become closer to SOL")).toBeTruthy();
  });

  it("renders 16 tappable tiles (10 big + 6 small)", () => {
    const { UNSAFE_getAllByType } = render(<ConnectPage />);
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables).toHaveLength(16);
  });

  it("pressing every tile opens the correct URL (all 16)", () => {
    const { UNSAFE_getAllByType } = render(<ConnectPage />);
    const t = UNSAFE_getAllByType(TouchableOpacity);

    const expectedUrls = [
      // Big (10)
      "https://www.solsacramento.com/give",
      "https://www.solsacramento.com/about?embedded=true",
      "https://solsacramento.churchcenter.com/people/forms/718725",
      "https://yoursite.com/groups",
      "https://calendly.com/office-fb6/45min",
      "https://solsacramento.churchcenter.com/people/forms/612308",
      "https://solsacramento.churchcenter.com/people/forms/581714",
      "https://solsacramento.churchcenter.com/people/forms/460975",
      "https://solsacramento.churchcenter.com/people/forms/708470",
      "https://solsacramento.churchcenter.com/people/forms/589043",
      // Small (6)
      "tel:9167597474",
      "mailto:office@solsacramento.com",
      "https://www.solsacramento.com",
      "https://www.instagram.com/sol_sacramento?igsh=MzRlODBiNWFlZA==",
      "https://youtube.com/@springoflifechurchsol?si=QsA38AcGYxntUyas",
      "https://m.facebook.com/churchSOL/?rf=178230975527106&wtsid=rdr_0zsPJaQGmTwscIlP7r",
    ];

    expect(t).toHaveLength(expectedUrls.length);

    expectedUrls.forEach((url, i) => {
      fireEvent.press(t[i]);
      expect(openURLSpy).toHaveBeenNthCalledWith(i + 1, url);
    });
  });
});
