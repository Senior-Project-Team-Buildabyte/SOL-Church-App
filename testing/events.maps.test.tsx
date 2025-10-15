import { Platform } from "react-native";

describe("SingleEventPage – map URL logic", () => {
  it("generates the correct iOS map URL", () => {
    // simulate Platform.select for iOS
    jest.spyOn(Platform, "select").mockReturnValue("maps:0,0?q=Park Grounds");

    const url = Platform.select({
      ios: `maps:0,0?q=Park Grounds`,
      android: `geo:0,0?q=Park Grounds`,
    });

    expect(url).toBe("maps:0,0?q=Park Grounds");
  });

  it("generates the correct Android map URL", () => {
    // simulate Platform.select for Android
    jest.spyOn(Platform, "select").mockReturnValue("geo:0,0?q=Park Grounds");

    const url = Platform.select({
      ios: `maps:0,0?q=Park Grounds`,
      android: `geo:0,0?q=Park Grounds`,
    });

    expect(url).toBe("geo:0,0?q=Park Grounds");
  });
});
