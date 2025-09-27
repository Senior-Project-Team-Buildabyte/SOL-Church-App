import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock the supabase module so it doesn't initialize the real client
jest.mock("../lib/supabase", () => ({
  supabase: { from: jest.fn() },
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ children }: any) => children,
}));

// Import after mocks so the component and symbol use the mocked module
import BorrowTakeItems from "../app/borrow/borrowItems";
import { supabase } from "../lib/supabase";

describe("BorrowTakeItems", () => {
  it("shows loading indicator initially", () => {
    // Keep both initial queries pending so loading stays true
    const never = () => new Promise<any>(() => {});
    // First call: categories query chain
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = never;
      const order = (_col: string, _opts?: any) => ({ returns });
      const select = (_query?: string) => ({ order });
      return { select };
    });
    // Second call: items query chain
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = never;
      const gt = (_col: string, _val: any) => ({ returns });
      const not = (_col: string, _op: string, _val: any) => ({ gt });
      const select = (_query?: string) => ({ not });
      return { select };
    });

    const { getByTestId } = render(<BorrowTakeItems />);
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("renders items from supabase", async () => {
    // First call: categories query
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = async () => ({ data: [], error: null });
      const order = (_col: string, _opts?: any) => ({ returns });
      const select = (_query?: string) => ({ order });
      return { select };
    });
    // Second call: items query
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = async () => ({
        data: [
          {
            inventory_item_id: 1,
            item_name: "Bible",
            item_image_id: null,
            item_category_id: 1,
            item_category: { item_category_id: 1, item_category_name: "Books" },
            quanityAvailable: 3,
          },
        ],
        error: null,
      });
      const gt = (_col: string, _val: any) => ({ returns });
      const not = (_col: string, _op: string, _val: any) => ({ gt });
      const select = (_query?: string) => ({ not });
      return { select };
    });

    const { findByText } = render(<BorrowTakeItems />);
    expect(await findByText("Bible")).toBeTruthy();
  });

  it("filters items when search query changes", async () => {
    // First call: categories query
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = async () => ({ data: [], error: null });
      const order = (_col: string, _opts?: any) => ({ returns });
      const select = (_query?: string) => ({ order });
      return { select };
    });
    // Second call: items query with two items
    (supabase.from as jest.Mock).mockImplementationOnce((_table: string) => {
      const returns = async () => ({
        data: [
          {
            inventory_item_id: 1,
            item_name: "Bible",
            item_image_id: null,
            item_category_id: 1,
            item_category: { item_category_id: 1, item_category_name: "Books" },
            quanityAvailable: 3,
          },
          {
            inventory_item_id: 2,
            item_name: "Microphone",
            item_image_id: null,
            item_category_id: 2,
            item_category: { item_category_id: 2, item_category_name: "Audio" },
            quanityAvailable: 1,
          },
        ],
        error: null,
      });
      const gt = (_col: string, _val: any) => ({ returns });
      const not = (_col: string, _op: string, _val: any) => ({ gt });
      const select = (_query?: string) => ({ not });
      return { select };
    });

    const { findByPlaceholderText, queryByText } = render(<BorrowTakeItems />);
    const input = await findByPlaceholderText("Search items...");
    fireEvent.changeText(input, "micro");

    await waitFor(() => {
      expect(queryByText("Bible")).toBeNull();
      expect(queryByText("Microphone")).toBeTruthy();
    });
  });
});