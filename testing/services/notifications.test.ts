// testing/services/notifications.test.ts

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Application from "expo-application";
import * as Device from "expo-device";

import {
  subscribeNotifications,
  getRouteFromNotificationData,
  savePushTokenToDB,
  registerForPushAsync,
  updateUserIDForToken,
  getUserNotification,
} from "@/services/notifications";
import { supabase } from "@/lib/supabase";

// Mock AsyncStorage so supabase client doesn't crash in Jest
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => {
  const addNotificationReceivedListener = jest.fn();
  const addNotificationResponseReceivedListener = jest.fn();

  return {
    __esModule: true,
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    AndroidImportance: { MAX: 5 },
    AndroidNotificationVisibility: { PUBLIC: 1 },
  };
});

// Mock expo-device
jest.mock("expo-device", () => ({
  __esModule: true,
  isDevice: true,
}));

// Mock expo-application
jest.mock("expo-application", () => ({
  __esModule: true,
  getAndroidId: jest.fn(() => "android-device-id"),
  getIosIdForVendorAsync: jest.fn(() => Promise.resolve("ios-device-id")),
}));

// Mock constants (used inside registerForPushAsync)
jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: "test-project-id",
        },
      },
    },
    easConfig: null,
  },
}));

// Mock supabase client used inside getUserNotification
jest.mock("@/lib/supabase", () => {
  const fromMock = jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({
      data: [{ notificationid: 1 }],
      error: null,
    }),
  }));

  return {
    __esModule: true,
    supabase: {
      from: fromMock,
    },
  };
});

// Global fetch mock for savePushTokenToDB
(global as any).fetch = jest.fn();

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure a predictable platform
    Object.defineProperty(Platform, "OS", {
      value: "android",
    });
  });

  it("subscribeNotifications registers listeners and unsubscribes correctly", () => {
    const onReceive = jest.fn();
    const onRespond = jest.fn();

    const receivedRemove = jest.fn();
    const responseRemove = jest.fn();

    let receivedCallback: (n: any) => void = () => {};
    let responseCallback: (r: any) => void = () => {};

    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation(
      (cb: (n: any) => void) => {
        receivedCallback = cb;
        return { remove: receivedRemove };
      }
    );

    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (cb: (r: any) => void) => {
        responseCallback = cb;
        return { remove: responseRemove };
      }
    );

    const unsubscribe = subscribeNotifications({ onReceive, onRespond });

    // simulate foreground notification + response
    const fakeNotification = { request: { identifier: "notif-1" } };
    const fakeResponse = { notification: fakeNotification };

    receivedCallback(fakeNotification as any);
    responseCallback(fakeResponse as any);

    expect(onReceive).toHaveBeenCalledWith(fakeNotification);
    expect(onRespond).toHaveBeenCalledWith(fakeResponse);

    // now unsubscribe
    unsubscribe();
    expect(receivedRemove).toHaveBeenCalled();
    expect(responseRemove).toHaveBeenCalled();
  });

  it("getRouteFromNotificationData parses route + params", () => {
    const result = getRouteFromNotificationData({
      route: "Borrow",
      params: { itemId: 10 },
    });

    expect(result).toEqual({ screen: "Borrow", params: { itemId: 10 } });

    const empty = getRouteFromNotificationData({});
    expect(empty).toEqual({});
  });

  it("savePushTokenToDB sends valid request on success", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn(),
    });

    await savePushTokenToDB(
      "expo-token-123",
      "android",
      "device-1",
      "anon-key",
      "user-1"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];

    expect(url).toContain("supabase.co/functions/v1/save_token");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers.Authorization).toBe("Bearer anon-key");

    const body = JSON.parse(options.body);
    expect(body).toEqual({
      token: "expo-token-123",
      platform: "android",
      deviceId: "device-1",
      userID: "user-1",
    });
  });

  it("savePushTokenToDB throws error on failed request", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: "Bad" }),
    });

    await expect(
      savePushTokenToDB(
        "expo-token-123",
        "android",
        "device-1",
        "anon-key",
        "user-1"
      )
    ).rejects.toThrow("Bad");
  });

  it("registerForPushAsync returns null when permission denied", async () => {
    (Device as any).isDevice = true;

    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const token = await registerForPushAsync();
    expect(token).toBeNull();
    expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
  });

  it("registerForPushAsync returns token when permission granted", async () => {
    (Device as any).isDevice = true;

    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: "expo-token-xyz",
    });

    const token = await registerForPushAsync();
    expect(token).toBe("expo-token-xyz");
    expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
  });

  it("updateUserIDForToken calls savePushTokenToDB with mapped values", async () => {
    const registerSpy = jest
      .spyOn(require("@/services/notifications"), "registerForPushAsync")
      .mockResolvedValue("expo-token-999");

    const saveSpy = jest
      .spyOn(require("@/services/notifications"), "savePushTokenToDB")
      .mockResolvedValue(undefined as any);

    (Application.getAndroidId as jest.Mock).mockReturnValue("android-device-id");

    await updateUserIDForToken("user-55");

    expect(registerSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledTimes(1);

    const args = saveSpy.mock.calls[0];

    expect(args[0]).toBe("expo-token-999"); // token
    expect(args[1]).toBe("android"); // platform (for Android)
    expect(args[2]).toBe("android-device-id"); // deviceId
    expect(typeof args[3]).toBe("string"); // supabaseAnonKey (env-based)
    expect(args[4]).toBe("user-55"); // userID
  });

  it("getUserNotification returns list for admin user", async () => {
    const data = await getUserNotification("user-1", true);
    expect(data).toEqual([{ notificationid: 1 }]);
    expect(supabase.from).toHaveBeenCalledWith("notification");
  });
});
