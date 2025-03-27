import { ButtonType, DynamicButtonProps, GenericButtonConfig } from "@/app/models/ButtonConfig";
import { Component, FC, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground, Linking, TouchableOpacity } from "react-native";
import ExternalLinkButton from "./external-link-button";
import InternalPageButton from "./interal-page-button";

const DynamicButton: FC<DynamicButtonProps> = (props) => {
    const {buttons} = props;
    const [loading, setLoading] = useState<boolean>(true);
    //debugger;
    if (!Array.isArray(buttons)) {
        console.error("Expected 'buttons' to be an array but got:", buttons);
        return null;
    }
    return (
        <>
            {buttons.map((button, index) => {
                 if (button.type === ButtonType.ExternalLink) {
                    return <ExternalLinkButton key={index} {...button.buttonConfig} />;
                } else if (button.type === ButtonType.InternalEventPage) {
                    return <InternalPageButton key={index} {...button.buttonConfig} />;
                } else {
                    console.warn("Unsupported button type:", button.type);
                    return null;
                }
            }
            )}
        </>
    );
};
    
export default DynamicButton;