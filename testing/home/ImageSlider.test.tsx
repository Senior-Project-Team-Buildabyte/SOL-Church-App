import React from "react";
import { Dimensions } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { fetchSliderImages, SliderImage } from "../../services/imageSlider";
import ImageSlider from "@/components/home/Image_slider";

jest.mock("../../services/imageSlider", () => ({
  fetchSliderImages: jest.fn(),
}));

const mockedFetchSliderImages = fetchSliderImages as jest.MockedFunction<
  typeof fetchSliderImages
>;

// helper to flatten style from a test instance
const getMergedStyle = (element: any) => {
  const style = element.props.style;
  if (Array.isArray(style)) {
    return Object.assign({}, ...style);
  }
  return style || {};
};

describe("ImageSlider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockImages : SliderImage[] = [
    {
      id: 1,
      image: "../assets/images/stockphoto.jpg",
      title: "Image 1",
      description: "Fallback image 1",
    },
    {
      id: 2,
      image: "../assets/images/testbackground.jpg",
      title: "Image 2",
      description: "Fallback image 2",
    },
  ];
 beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads images from fetchSliderImages and renders images & dots", async () => {
    mockedFetchSliderImages.mockResolvedValueOnce(mockImages);

    const { getAllByTestId } = render(<ImageSlider />);

    await waitFor(() => {
      expect(mockedFetchSliderImages).toHaveBeenCalledTimes(1);
    });

    const renderedImages = getAllByTestId("slider-image");
    expect(renderedImages.length).toBe(mockImages.length);

    const dots = getAllByTestId("slider-dot");
    expect(dots.length).toBe(mockImages.length);

    const firstDotStyle = getMergedStyle(dots[0]);
    const secondDotStyle = getMergedStyle(dots[1]);

    // first dot is active, others inactive
    expect(firstDotStyle.backgroundColor).toBe("#3498db");
    expect(secondDotStyle.backgroundColor).toBe("#e0e0e0");
  });

  it("updates active dot when user scrolls horizontally", async () => {
    mockedFetchSliderImages.mockResolvedValueOnce(mockImages);

    const { getByTestId, getAllByTestId } = render(<ImageSlider />);

    await waitFor(() => {
      expect(mockedFetchSliderImages).toHaveBeenCalledTimes(1);
    });

    const width = Dimensions.get("window").width;
    const scrollView = getByTestId("slider-scrollview");

    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: width, y: 0 },
        contentSize: { width: width * mockImages.length, height: 200 },
        layoutMeasurement: { width, height: 200 },
      },
    });

    const dots = getAllByTestId("slider-dot");

    const firstDotStyle = getMergedStyle(dots[0]);
    const secondDotStyle = getMergedStyle(dots[1]);

    // after scrolling one width, second dot is active
    expect(secondDotStyle.backgroundColor).toBe("#3498db");
    expect(firstDotStyle.backgroundColor).toBe("#e0e0e0");
  });

 

  it("logs an error when fetchSliderImages fails", async () => {
    const error = new Error("Network error");
    mockedFetchSliderImages.mockRejectedValueOnce(error);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ImageSlider />);

    await waitFor(() => {
      expect(mockedFetchSliderImages).toHaveBeenCalledTimes(1);
    });

    const loggedOurMessage = consoleErrorSpy.mock.calls.some(
      (call) => call[0] === "Error fetching image:"
    );
    expect(loggedOurMessage).toBe(true);

    consoleErrorSpy.mockRestore();
  });

  it("renders gracefully when no images are returned", async () => {
    mockedFetchSliderImages.mockResolvedValueOnce([]);

    const { queryAllByTestId } = render(<ImageSlider />);

    await waitFor(() => {
      expect(mockedFetchSliderImages).toHaveBeenCalledTimes(1);
    });

    expect(queryAllByTestId("slider-image").length).toBe(0);
    expect(queryAllByTestId("slider-dot").length).toBe(0);
  });
});