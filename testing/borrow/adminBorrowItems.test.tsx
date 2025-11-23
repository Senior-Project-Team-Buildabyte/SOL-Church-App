// testing/borrow/adminBorrowItems.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Silence console output during these tests
let logSpy: jest.SpyInstance;
let warnSpy: jest.SpyInstance;
let errorSpy: jest.SpyInstance;

beforeAll(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  logSpy.mockRestore();
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});

const asMock = <T extends (...args: any[]) => any>(fn: T) =>
  fn as unknown as jest.Mock;

// Simple Supabase-style builder returning { data, error: null }
const createSupabaseBuilder = (rows: any[]) => {
  const result = { data: rows, error: null };

  const builder: any = {
    data: result.data,
    error: result.error,
    select: () => builder,
    order: () => builder,
    eq: () => builder,
    gt: () => builder,
    not: () => builder,
    in: () => builder,
    returns: () => Promise.resolve(result),
    then: (resolve: any, _reject?: any) => resolve(result),
  };

  return builder;
};

// Supabase mocks (from, rpc, auth)
const mockFrom = jest.fn();
const mockRpc = jest.fn();
const mockAuthGetSession = jest.fn();
const mockAuthGetUser = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    rpc: (...args: any[]) => mockRpc(...args),
    auth: {
      getSession: (...args: any[]) => mockAuthGetSession(...args),
      getUser: (...args: any[]) => mockAuthGetUser(...args),
    },
  },
}));

// Alias import '@/lib/supabase'
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    rpc: (...args: any[]) => mockRpc(...args),
    auth: {
      getSession: (...args: any[]) => mockAuthGetSession(...args),
      getUser: (...args: any[]) => mockAuthGetUser(...args),
    },
  },
}));

// request.service mocks
const mockCreateInventoryRequest = jest.fn();
const mockApproveInventoryRequest = jest.fn();
const mockApproveInventoryRequestRaw = jest.fn();

const requestServiceModule = {
  __esModule: true,
  default: {
    createInventoryRequest: (...args: any[]) =>
      mockCreateInventoryRequest(...args),
    approveInventoryRequest: (...args: any[]) =>
      mockApproveInventoryRequest(...args),
    approveInventoryRequestRaw: (...args: any[]) =>
      mockApproveInventoryRequestRaw(...args),
  },
  requestService: {
    createInventoryRequest: (...args: any[]) =>
      mockCreateInventoryRequest(...args),
    approveInventoryRequest: (...args: any[]) =>
      mockApproveInventoryRequest(...args),
    approveInventoryRequestRaw: (...args: any[]) =>
      mockApproveInventoryRequestRaw(...args),
  },
};

jest.mock('../../services/request.service', () => requestServiceModule);
jest.mock('@/services/request.service', () => requestServiceModule);

// inventory.service mocks
const mockApproveAndCreateLoan = jest.fn();
const mockGetMyBorrowedItems = jest.fn();
const mockReturnLoans = jest.fn();

const inventoryServiceModule = {
  __esModule: true,
  inventoryService: {
    approveAndCreateLoan: (...args: any[]) =>
      mockApproveAndCreateLoan(...args),
    getMyBorrowedItems: (...args: any[]) =>
      mockGetMyBorrowedItems(...args),
    returnLoans: (...args: any[]) => mockReturnLoans(...args),
  },
};

jest.mock('../../services/inventory.service', () => inventoryServiceModule);
jest.mock('@/services/inventory.service', () => inventoryServiceModule);

// expo-router mocks
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockDismissTo = jest.fn();
const mockUseRouter = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => mockUseRouter(),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  Link: ({ children }: any) => children,
  Stack: {
    Screen: ({ children }: any) => children || null,
  },
}));

// Other libs / components

// Mock LinearGradient to just render children
jest.mock('expo-linear-gradient', () => {
  const ReactReal = require('react');
  return {
    LinearGradient: ({ children }: any) => <>{children}</>,
  };
});

// Mock BackHeaderBar used in confirm-borrow.tsx
jest.mock('../../components/universal/header-back-button', () => {
  const ReactReal = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => <Text>Back</Text>,
  };
});

// Components under test
import InventoryRequests from '../../app/admin/inventory_requests';
import ApprovedRequestPage from '../../app/borrow/approved-request';
import BorrowTakeItems from '../../app/borrow/borrowItems';
import ConfirmBorrow from '../../app/borrow/confirm-borrow';
import ReturnItems from '../../app/borrow/returnItems';
import AdminManageItems from '../../app/admin/admin-borrow';

// Shared test setup
beforeEach(() => {
  jest.clearAllMocks();

  mockUseRouter.mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    dismissTo: mockDismissTo,
  });

  mockUseLocalSearchParams.mockReturnValue({});

  mockFrom.mockImplementation((table: string) => {
    throw new Error(`Unexpected table in supabase.from: ${table}`);
  });
  mockRpc.mockReset();

  mockAuthGetSession.mockResolvedValue({
    data: { session: { user: { id: 'user-123' } } },
    error: null,
  });

  mockAuthGetUser.mockResolvedValue({
    data: { user: { id: 'user-123' } },
    error: null,
  });
});

// InventoryRequests
describe('InventoryRequests', () => {
  it('renders with no requestId and shows "No items in request"', async () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { findByText } = render(<InventoryRequests />);

    expect(await findByText('Request ID: None')).toBeTruthy();
    expect(await findByText('No items in request')).toBeTruthy();
  });

  it('renders items when Supabase returns request items', async () => {
    mockUseLocalSearchParams.mockReturnValue({ requestId: '5' });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_request_items') {
        const eq = async () => ({
          data: [
            {
              inventory_item_id: 1,
              inventory_items: { item_name: 'Bible', quanityAvailable: 3 },
            },
          ],
          error: null,
        });
        const select = () => ({ eq });
        return { select };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const { findByText } = render(<InventoryRequests />);

    expect(await findByText('• Bible (Available: 3)')).toBeTruthy();
  });

  it('approves a request when Approve is pressed', async () => {
    mockUseLocalSearchParams.mockReturnValue({ requestId: '10' });

    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((title: any, msg?: any, buttons?: any) => {
        // Simulate pressing "OK" on success alert so router.back() runs
        if (title === 'Success' && buttons && buttons[0]?.onPress) {
          buttons[0].onPress();
        }
      });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_request_items') {
        const eq = async () => ({
          data: [
            {
              inventory_item_id: 1,
              inventory_items: { item_name: 'Bible', quanityAvailable: 3 },
            },
          ],
          error: null,
        });
        const select = () => ({ eq });
        return { select };
      }

      if (table === 'notification') {
        const select = async () => ({ data: [], error: null });
        const contains = () => ({ select });
        const eq = () => ({ contains, select });
        const _delete = () => ({ eq });
        return { delete: _delete };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    asMock(mockApproveInventoryRequestRaw).mockResolvedValueOnce({
      data: null,
      error: null,
    });
    asMock(mockApproveInventoryRequest).mockResolvedValueOnce(undefined);
    asMock(mockApproveAndCreateLoan).mockResolvedValue(undefined);

    const { findByText, getByText } = render(<InventoryRequests />);

    await findByText('• Bible (Available: 3)');

    const approveButton = getByText('Approve');
    fireEvent.press(approveButton);

    await waitFor(() => {
      expect(mockApproveInventoryRequestRaw).toHaveBeenCalledWith(
        10,
        'user-123',
      );
      expect(mockApproveInventoryRequest).toHaveBeenCalledWith(
        10,
        'user-123',
      );
      expect(mockApproveAndCreateLoan).toHaveBeenCalledWith(10, 1);
      expect(mockBack).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});

// ApprovedRequestPage
describe('ApprovedRequestPage', () => {
  it('shows "No request found" when no requestId', async () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { findByText } = render(<ApprovedRequestPage />);
    expect(await findByText('No request found')).toBeTruthy();
  });

  it('renders request details and items', async () => {
    mockUseLocalSearchParams.mockReturnValue({ requestId: '2' });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_request') {
        const single = async () => ({
          data: {
            inventory_request_id: 2,
            user_requesting_id: 'borrower-1',
            is_approved: false,
          },
          error: null,
        });
        const eq = () => ({ single });
        const select = () => ({ eq });
        return { select };
      }

      if (table === 'inventory_request_items') {
        const eq = async () => ({
          data: [
            {
              inventory_item_id: 1,
              requested_qty: 2,
              quantity: null,
              inventory_items: {
                item_name: 'Mic',
                item_image_id: null,
                quanityAvailable: 1,
              },
            },
          ],
          error: null,
        });
        const select = () => ({ eq });
        return { select };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    asMock(mockAuthGetUser).mockResolvedValueOnce({
      data: { user: { id: 'borrower-1' } },
      error: null,
    });

    const { findByText } = render(<ApprovedRequestPage />);

    expect(await findByText('Request #2')).toBeTruthy();
    expect(await findByText(/Mic/)).toBeTruthy();
  });
});

// BorrowTakeItems
describe('BorrowTakeItems', () => {
  it('shows loading spinner then renders items and filters by search', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'item_category') {
        return createSupabaseBuilder([
          { item_category_id: 1, item_category_name: 'Books' },
          { item_category_id: 2, item_category_name: 'Audio' },
        ]);
      }

      if (table === 'inventory_items') {
        return createSupabaseBuilder([
          {
            inventory_item_id: 1,
            item_name: 'Bible',
            item_image_id: null,
            item_category_id: 1,
            item_category: {
              item_category_id: 1,
              item_category_name: 'Books',
            },
            quanityAvailable: 3,
          },
          {
            inventory_item_id: 2,
            item_name: 'Microphone',
            item_image_id: null,
            item_category_id: 2,
            item_category: {
              item_category_id: 2,
              item_category_name: 'Audio',
            },
            quanityAvailable: 1,
          },
        ]);
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { findByText, findByPlaceholderText, queryByText } = render(
      <BorrowTakeItems />,
    );

    await findByText('Bible');
    await findByText('Microphone');

    const input = await findByPlaceholderText('Search items...');
    fireEvent.changeText(input, 'micro');

    await waitFor(() => {
      expect(queryByText('Bible')).toBeNull();
      expect(queryByText('Microphone')).toBeTruthy();
    });
  });

  it('navigates to confirm-borrow with selected item ids', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'item_category') {
        return createSupabaseBuilder([]);
      }

      if (table === 'inventory_items') {
        return createSupabaseBuilder([
          {
            inventory_item_id: 1,
            item_name: 'Bible',
            item_image_id: null,
            item_category_id: 1,
            item_category: {
              item_category_id: 1,
              item_category_name: 'Books',
            },
            quanityAvailable: 3,
          },
        ]);
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { findByText } = render(<BorrowTakeItems />);

    const itemRow = await findByText('Bible');
    fireEvent.press(itemRow);

    const button = await findByText(/Borrow Items/);
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
      const arg = (mockPush.mock.calls[0][0] as any) || {};
      expect(arg.pathname).toBe('/borrow/confirm-borrow');
      expect(arg.params.selectedIds).toBe('1');
    });
  });
});

// ConfirmBorrow
describe('ConfirmBorrow', () => {
  it('shows "No items selected." when no selectedIds', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByText } = render(<ConfirmBorrow />);
    expect(getByText('No items selected.')).toBeTruthy();
  });

  it('loads selected items and submits request on Confirm', async () => {
    mockUseLocalSearchParams.mockReturnValue({ selectedIds: '1,2' });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_items') {
        return createSupabaseBuilder([
          {
            inventory_item_id: 1,
            item_name: 'Bible',
            item_image_id: null,
            quanityAvailable: 3,
          },
          {
            inventory_item_id: 2,
            item_name: 'Mic',
            item_image_id: null,
            quanityAvailable: 1,
          },
        ]);
      }
      throw new Error(`Unexpected table ${table}`);
    });

    asMock(mockCreateInventoryRequest).mockResolvedValueOnce(99);

    const { findByText, findAllByText } = render(<ConfirmBorrow />);

    await findByText('Bible');
    await findByText('Mic');

    // First "Confirm Borrow" is header, second is the button text
    const confirmBtnTexts = await findAllByText('Confirm Borrow');
    const confirmBtn = confirmBtnTexts[1];
    fireEvent.press(confirmBtn);

    await waitFor(() => {
      expect(mockCreateInventoryRequest).toHaveBeenCalledWith('user-123', [
        1, 2,
      ]);
    });

    const doneBtn = await findByText('Done');
    fireEvent.press(doneBtn);

    await waitFor(() => {
      expect(mockDismissTo).toHaveBeenCalledWith('/(tabs)/borrow');
    });
  });
});

// ReturnItems
describe('ReturnItems', () => {
  it('shows borrowed items list', async () => {
    asMock(mockGetMyBorrowedItems).mockResolvedValueOnce([
      {
        loan_id: 11,
        inventory_item_id: 1,
        item_name: 'Bible',
        item_description: 'A book',
        item_location: 'Shelf',
        my_borrowed_quantity: 1,
        quanityAvailable: 1,
        quanityTotal: 3,
      },
      {
        loan_id: 22,
        inventory_item_id: 2,
        item_name: 'Mic',
        item_description: null,
        item_location: null,
        my_borrowed_quantity: 2,
        quanityAvailable: 5,
        quanityTotal: 5,
      },
    ]);

    const { findByText } = render(<ReturnItems />);

    await findByText('Bible');
    await findByText('Mic');
  });

  it('returns selected items when button pressed', async () => {
    asMock(mockGetMyBorrowedItems)
      .mockResolvedValueOnce([
        {
          loan_id: 11,
          inventory_item_id: 1,
          item_name: 'Bible',
          item_description: null,
          item_location: null,
          my_borrowed_quantity: 2,
          quanityAvailable: 1,
          quanityTotal: 3,
        },
      ])
      .mockResolvedValueOnce([]); // after reload

    const { findByText, getByPlaceholderText, getByText } = render(
      <ReturnItems />,
    );

    await findByText('Bible');

    const qtyInput = getByPlaceholderText('0');
    fireEvent.changeText(qtyInput, '2');

    const btn = getByText('Return Selected Items');
    fireEvent.press(btn);

    await waitFor(() => {
      expect(mockReturnLoans).toHaveBeenCalledWith([11]);
    });
  });
});

// AdminManageItems (admin-borrow.tsx)
describe('AdminManageItems', () => {
  it('renders items and allows searching', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_items') {
        const order = async () => ({
          data: [
            {
              inventory_item_id: 1,
              item_name: 'Bible',
              item_category_id: 1,
              is_available: true,
              quantity_available: 3,
              item_category: {
                item_category_id: 1,
                item_category_name: 'Books',
              },
            },
            {
              inventory_item_id: 2,
              item_name: 'Mic',
              item_category_id: 2,
              is_available: false,
              quantity_available: 1,
              item_category: {
                item_category_id: 2,
                item_category_name: 'Audio',
              },
            },
          ],
          error: null,
        });
        const select = () => ({ order });
        const update = () => {
          throw new Error('update should not be called in this test');
        };
        return { select, update };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const { findByText, findByPlaceholderText, queryByText } = render(
      <AdminManageItems />,
    );

    await findByText('Manage Items');
    await findByText('Bible');
    await findByText('Mic');

    const searchInput = await findByPlaceholderText('Search items...');
    fireEvent.changeText(searchInput, 'bible');

    await waitFor(() => {
      expect(queryByText('Bible')).toBeTruthy();
      expect(queryByText('Mic')).toBeNull();
    });
  });

  it('toggles availability and calls update', async () => {
    const updateMock = jest.fn(() => ({
      eq: () => ({
        select: () => ({
          single: async () => ({
            data: { inventory_item_id: 1, is_available: false },
            error: null,
          }),
        }),
      }),
    }));

    mockFrom.mockImplementation((table: string) => {
      if (table === 'inventory_items') {
        const order = async () => ({
          data: [
            {
              inventory_item_id: 1,
              item_name: 'Bible',
              item_category_id: 1,
              is_available: true,
              quantity_available: 3,
              item_category: {
                item_category_id: 1,
                item_category_name: 'Books',
              },
            },
          ],
          error: null,
        });
        const select = () => ({ order });
        return { select, update: updateMock };
      }
      throw new Error(`Unexpected table ${table}`);
    });

    const { findByText, getAllByRole } = render(<AdminManageItems />);

    await findByText('Bible');

    // First switch is "Show unavailable", second is the item toggle
    const switches = getAllByRole('switch');
    const itemSwitch = switches[switches.length - 1];

    fireEvent(itemSwitch, 'valueChange', false);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledTimes(1);
      expect(updateMock).toHaveBeenCalledWith({ is_available: false });
    });
  });
});
