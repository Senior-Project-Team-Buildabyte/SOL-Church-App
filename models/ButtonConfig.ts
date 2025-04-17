import { RelativePathString } from "expo-router";

export enum ButtonType{
    ExternalLink, 
    InternalEventPage,
    FormsCalendarButton
}
export enum ButtonShape{
    FullWidth, 
    Square
}
export interface DynamicButtonProps {
    buttons: GenericButtonConfig[];
}

export interface GenericButtonConfig{
    type: ButtonType,
    shape: ButtonShape,
    buttonConfig: ButtonConfig
}

export interface ButtonConfig{
    text?: string,
    subText?: string,
    altText?: string,
    textColor?: string, // supports #RGB, #RRGGBB, #RRGGBBAA, "rgba(#,#,#,#)"
    backgroundImage?: string,
    backgroundColor?: string,   // supports same as above
    backgroundGradient?: Array<string>[3],  // [gradientDirection, color1, color2]
    link?: string | undefined, 
    internalLink?: RelativePathString,
    icon?: string,
    iconColor?: string,
}
