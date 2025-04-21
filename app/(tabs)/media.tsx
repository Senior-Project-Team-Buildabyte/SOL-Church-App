import { EventData, fetchEventData } from "@/services/eventsService";
import DynamicButton from "../../components/universal/dynamic-button";
import { useState } from "react";

const images = {
    evening_service: require("../../assets/images/bg-about-sol.jpg"),
    sol_tv: require("../../assets/images/bg-mission.jpg"),
    morning_service: require("../../assets/images/bg-sol-ru.jpg"),
};

const MediaPage = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (  
        <DynamicButton buttons={[
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    text: "Evening Service",
                    link: "https://www.youtube.com/live/WAkwMg375ig?si=w-9a2XTOoCpN6tAX",
                    backgroundImage: images.evening_service
                 }
            },
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    text: "SOL TV",
                    link: "https://youtube.com/@soltv3023?si=aeGhE6sob2WDm8kp",
                    backgroundImage: images.sol_tv
                 }
            },
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    text: "Morning Service",
                    link: "https://www.google.com/", // currently redirects to private video
                    backgroundImage: images.morning_service
                 }
            },
            {
                type: 1, // external
                shape: 0, // full
                buttonConfig: {
                    text: "Lyrics",
                    internalLink: `../media/lyrics`,
                    backgroundImage: "https://media.istockphoto.com/id/665336594/vector/blurred-summer-background-beach-with-sparkles-and-bokeh-vector-background-for-your-creativity.jpg?s=612x612&w=0&k=20&c=V7XOossa2nByJENpYqB-OpCONFOJS2oWI7j2Hkc8JIE="
                 }
            }
        ]}></DynamicButton>
      );
    };
    
export default MediaPage;
