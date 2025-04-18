import { DynamicButtonProps, GenericButtonConfig } from "@/models/ButtonConfig";
import { EventData, fetchEventData } from "@/services/eventsService";
import { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import DynamicButton from "../universal/dynamic-button";


const DynamicEventSection = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (  
        <DynamicButton buttons={[
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    link: "https://sol-tesla.com",
                    backgroundImage: require('@/assets/images/bg-fundraiser-screenshot.jpg'),
                 }
            },
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    text: "GIVE",
                    subText: "General & New Building",
                    icon: "dollar",
                    link: "https://give.solsacramento.com/",
                    backgroundGradient: ["0", "rgba(0, 0, 0, 0.9)", "rgba(60,129,246,1)"]
                 }
            },
            {
                type: 0, // external
                shape: 0, // full
                buttonConfig: {
                    link: "https://solsacramento.churchcenter.com/unproxy/registrations/events/2472901",
                    backgroundImage: require('@/assets/images/bg-school-btn.jpg'),
                 }
            },
        ]}></DynamicButton>
      );
    };
    
export default DynamicEventSection;