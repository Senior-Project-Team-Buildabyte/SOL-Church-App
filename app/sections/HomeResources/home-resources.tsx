import React from 'react';
import DynamicButton from '../generic-buttons/dynamic-button';

const HomeResources = () => {

  return (
    <DynamicButton buttons={[
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "Resource 1",
            link: "https://example.com",
            backgroundImage: require('../../../assets/images/testbackground.jpg'),
        }
      },
      {
        type: 1, // internal
        shape: 1, // square
        buttonConfig: {
            text: "Page 1",
            internalLink: `../sections/EventsPage/single-event-page`,
            backgroundImage: "https://media.istockphoto.com/id/665336594/vector/blurred-summer-background-beach-with-sparkles-and-bokeh-vector-background-for-your-creativity.jpg?s=612x612&w=0&k=20&c=V7XOossa2nByJENpYqB-OpCONFOJS2oWI7j2Hkc8JIE=",
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "Google.com",
            link: "https://google.com",
            backgroundImage: require('../../../assets/images/Google-Emblem001.png'),
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            icon: 'map',
            text: "Bing.com",
            link: "https://bing.com",
            backgroundImage: require('../../../assets/images/microsoft-bing-logo-001.jpg'),
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "Resource 2",
            link: "https://example.com",
            backgroundImage: require('../../../assets/images/stockphoto.jpg'),
        }
      },
      { // full width button for testing / proof of concept (alternating rows of full & square)
        type: 0, // external
        shape: 0, // full
        buttonConfig: {
            text: "Resource 3",
            link: "https://example.com",
            backgroundImage: require('../../../assets/images/testbackground.jpg'),
            backgroundColor: "#bb1da5"
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "Resource 4",
            link: "https://example.com",
            backgroundColor: "#17a5dd"
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "Resource 5",
            link: "https://example.com",
            backgroundColor: "#nna68"
        }
      },
      {
        type: 0, // external
        shape: 0, // full
        buttonConfig: {
            text: "Resource 6",
            link: "https://example.com",
            backgroundColor: "rgba(240, 70, 255, 0.89)"
        }
      },
    ]}></DynamicButton>
  );
};

export default HomeResources;