import { RelativePathString } from "expo-router";

export enum ButtonType{
    ExternalLink, 
    InternalEventPage
}
export interface DynamicButtonProps {
    buttons: GenericButtonConfig[];
}

export interface GenericButtonConfig{
    type: ButtonType,
    buttonConfig: ButtonConfig
}

export interface ButtonConfig{
    text?: string, 
    backgroundImage?: string,
    link?: string | undefined, 
    internalLink?: RelativePathString, 
    icon?: string
}
