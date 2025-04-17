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
                    text: "GIVE\nGeneral & New Building",
                    icon: "dollar",
                    link: "https://give.solsacramento.com/",
                    backgroundColor: "rgba(58, 120, 227, 1)"
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
            // {
            //     type: 0, // external
            //     shape: 0, // full
            //     buttonConfig: {
            //         text: "Update Your Address",
            //         link: "https://www.google.com/",
            //         backgroundImage: ""
            //      }
            // },
            // {
            //     type: 0, // external
            //     shape: 0, // full
            //     buttonConfig: {
            //         icon: 'map',
            //         text: "Update Your Address\nОновіть вашу адресу",
            //         link: "https://www.google.com/",
            //         backgroundImage: "https://media.istockphoto.com/id/665336594/vector/blurred-summer-background-beach-with-sparkles-and-bokeh-vector-background-for-your-creativity.jpg?s=612x612&w=0&k=20&c=V7XOossa2nByJENpYqB-OpCONFOJS2oWI7j2Hkc8JIE="
            //      }
            // }
        ]}></DynamicButton>
      );
    };
    
export default DynamicEventSection;