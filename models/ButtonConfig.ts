import { RelativePathString } from "expo-router";

export enum ButtonType{
    ExternalLink, 
    InternalEventPage
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
    backgroundImage?: string,
    backgroundColor?: string,   // supports #RGB, #RRGGBB, #RRGGBBAA, "rgba(#,#,#,#)"
    link?: string | undefined, 
    internalLink?: RelativePathString,
    icon?: string
}
