// testing/home/DynamicEventSection.test.tsx (or wherever you put tests)

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { supabase } from "@/lib/supabase";
import DynamicButton from "@/components/universal/dynamic-button";
import DynamicEventSection from "@/components/home/dynamic-event";


// Mock supabase client
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

// Helper: create a fake Supabase query builder that supports
// .select().eq().eq() and is awaitable (thenable).
const createQueryBuilder = (result: { data: any; error: any }) => {
  return {
    // select just returns the same builder
    select: jest.fn().mockReturnThis(),
    // eq returns the same builder so we can chain eq().eq()
    eq: jest.fn().mockReturnThis(),
    // when awaited, Supabase's builder resolves to { data, error }.
    then: (resolve: (value: any) => void) => {
      return resolve(result);
    },
  };
};

describe("DynamicEventSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads buttons from supabase and passes formatted buttons to DynamicButton", async () => {
    const mockData = [
      {
        type_id: 0,
        shape_id: 1,
        button_config: {
          text: "Main text",
          sub_text: "Sub text",
          icon: "icon-name",
          link: "https://example.com",
          internal_link: "/internal",
          background_color: "#ffffff",
          background_gradient: '["#000000", "#ffffff"]',
          background_image: {
            image_link: "https://example.com/bg.png",
          },
        },
        page: { page_name: "home" },
      },
    ];

    const builder = createQueryBuilder({ data: mockData, error: null });
    mockedSupabase.from.mockReturnValue(builder);

    render(<DynamicEventSection />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;

    expect(buttonsProp).toEqual([
      {
        type: 0,
        shape: 1,
        buttonConfig: {
          text: "Main text",
          subText: "Sub text",
          icon: "icon-name",
          link: "https://example.com",
          internalLink: "/internal",
          backgroundColor: "#ffffff",
          backgroundGradient: ["#000000", "#ffffff"],
          backgroundImage: "https://example.com/bg.png",
        },
      },
    ]);
  });

  it("logs an error and still renders DynamicButton with empty buttons when supabase returns an error", async () => {
    const error = new Error("Database error");

    const builder = createQueryBuilder({ data: null, error });
    mockedSupabase.from.mockReturnValue(builder);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<DynamicEventSection />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    // Check console.error was called with our message
    const loggedOurError = consoleErrorSpy.mock.calls.some(
      (call) => call[0] === "Error loading event buttons:"
    );
    expect(loggedOurError).toBe(true);

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;
    expect(buttonsProp).toEqual([]); // state initialized as [], never updated

    consoleErrorSpy.mockRestore();
  });

  it("handles empty data gracefully (buttons stays empty)", async () => {
    const builder = createQueryBuilder({ data: [], error: null });
    mockedSupabase.from.mockReturnValue(builder);

    render(<DynamicEventSection />);

    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith("button_setup");
      expect(mockedDynamicButton).toHaveBeenCalled();
    });

    const buttonsProp = mockedDynamicButton.mock.calls[0][0].buttons;
    expect(buttonsProp).toEqual([]);
  });
});
