import axios from 'axios';
import { EventData } from './eventsService';


const API_BASE_URL = 'localhost:3000'
// Define a generic response type
export interface ApiResponse {
  data: any;
}


export function toEvent(raw: any): EventData {
  return {
    id: raw.event_id,
    title: raw.title,
    group: raw.group ?? null,
    guestSpeaker: raw.guest_speaker ?? null,
    link: raw.link ?? null,
    date: raw.date ? new Date(raw.date) : null,
    time: raw.time ?? null,
    image: raw.image_id ?? null,
    description: raw.description ?? "",
    location: raw.location ?? "",
    day: raw.date ? new Date(raw.date).getUTCDate().toString() : "",
    month: raw.date ? new Date(raw.date).toLocaleString('en-US', { month: 'short' }) : "",
  }
}