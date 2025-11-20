import React from "react";
import { render } from "@testing-library/react-native";
import Index from "../../app/(tabs)/index";

// Mock child components so we can detect that Index renders them

jest.mock("../../components/home/Image_slider", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = () => <View testID="image-slider-mock" />;
  return {
    __esModule: true,
    default: Mock,
  };
});

jest.mock("../../components/home/dynamic-event", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = () => <View testID="dynamic-event-mock" />;
  return {
    __esModule: true,
    default: Mock,
  };
});

jest.mock("../../components/universal/contacts-icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = () => <View testID="contacts-icons-mock" />;
  return {
    __esModule: true,
    default: Mock,
  };
});

jest.mock("../../components/home/resources", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = () => <View testID="resources-mock" />;
  return {
    __esModule: true,
    default: Mock,
  };
});

describe("Home Index screen", () => {
  it("renders the home layout with slider, events, contacts, and resources", () => {
    const { getByTestId } = render(<Index />);

    // All sections should be rendered once
    expect(getByTestId("image-slider-mock")).toBeTruthy();
    expect(getByTestId("dynamic-event-mock")).toBeTruthy();
    expect(getByTestId("contacts-icons-mock")).toBeTruthy();
    expect(getByTestId("resources-mock")).toBeTruthy();
  });
});
