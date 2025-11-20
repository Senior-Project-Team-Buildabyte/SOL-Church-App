import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { supabase } from "@/lib/supabase";
import DynamicButton from "@/components/universal/dynamic-button";
import Resources from "@/components/home/resources";

// Mock Supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock DynamicButton so we can inspect props
jest.mock("@/components/universal/dynamic-button", () => {
  const React = require("react");
  const mock = jest.fn((props) =>
    React.createElement("DynamicButtonMock", props)
  );
  return {
    __esModule: true,
    default: mock,
  };
});

const mockedSupabase = supabase as unknown as {
  from: jest.Mock;
};
const mockedDynamicButton = DynamicButton as jest.Mock;

// Helper: fake Supabase query builder that supports select().eq().in() and is awaitable
const createQueryBuilder = (result: { data: any; error: any }) => {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    then: (resolve: (value: any) => void) => resolve(result),
  };
};

describe("Resources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads buttons from supabase and passes formatted buttons to DynamicButton", async () => {
    const mockData = [
      {
        type_id: 1,
        shape_id: 2,
        button_config: {
          text: "Resource 1",
          sub_text: "Sub 1",
          icon: "book",
          link: "https://example.com/resource",
          internal_link: "/resource",
          background_color: "#ffffff",
          background_gradient: '["#000000", "#ffffff"]',
          background_image: { image_link: "https://example.com/bg.png" },
        },
        page: { page_name: "home" },
      },
    ];

    const builder = createQueryBuilder({ data: mockData, error: null });
    mockedSupabase.from.mockReturnValue(builder);

    render(<Resources />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    // Assert the chained filters were used
    const builderInstance = mockedSupabase.from.mock.results[0].value;
    expect(builderInstance.select).toHaveBeenCalled();
    expect(builderInstance.eq).toHaveBeenCalledWith("page.page_name", "home");
    expect(builderInstance.in).toHaveBeenCalledWith("type_id", [1, 2]);

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;

    expect(buttonsProp).toEqual([
      {
        type: 1,
        shape: 2,
        buttonConfig: {
          text: "Resource 1",
          subText: "Sub 1",
          icon: "book",
          link: "https://example.com/resource",
          internalLink: "/resource",
          backgroundColor: "#ffffff",
          backgroundGradient: ["#000000", "#ffffff"],
          backgroundImage: "https://example.com/bg.png",
        },
      },
    ]);
  });

  it("logs an error and renders DynamicButton with empty buttons when supabase returns an error", async () => {
    const error = new Error("Database error");
    const builder = createQueryBuilder({ data: null, error });
    mockedSupabase.from.mockReturnValue(builder);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Resources />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    // Check console.error was called with our message
    const loggedOurError = consoleErrorSpy.mock.calls.some(
      (call) => call[0] === "Error loading resource buttons:"
    );
    expect(loggedOurError).toBe(true);

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;
    expect(buttonsProp).toEqual([]); // stays default [] when error thrown

    consoleErrorSpy.mockRestore();
  });

  it("handles empty data gracefully (passes empty array to DynamicButton)", async () => {
    const builder = createQueryBuilder({ data: [], error: null });
    mockedSupabase.from.mockReturnValue(builder);

    render(<Resources />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;
    expect(buttonsProp).toEqual([]);
  });
});
