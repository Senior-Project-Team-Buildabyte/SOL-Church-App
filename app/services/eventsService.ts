//import api from './api.service'; 

export interface EventData {
  image: string;
  title: string;
  guestSpeaker: string;
  time: string;
}

const dummyData: EventData[] = [
  {
    image: '../../../assets/images/testbackground.jpg',
    title: 'Title 1',
    guestSpeaker: 'John Doe',
    time: '7:00 PM'
  },
  {
    image: '../../../assets/images/testbackground.jpg',
    title: 'Title 2',
    guestSpeaker: 'Guest Speaker',
    time: '7:00 PM'
  },
  {
    image: '../../../assets/images/testbackground.jpg',
    title: 'Title 3',
    guestSpeaker: 'Guest Speaker',
    time: '7:00 PM'
  },
  {
    image: '../../../assets/images/testbackground.jpg',
    title: 'Title 4',
    guestSpeaker: 'Guest Speaker',
    time: '7:00 PM'
  }
];

// Fetch events data from API or fallback to dummy data
export const fetchEventData = async (endpoint: string): Promise<EventData[]> => {
    return dummyData;
//   try {
//     const response = await api.get<EventData[]>(endpoint);
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error);
//     return dummyData; // Fallback to dummy data if API call fails
//   }
};

// Generic POST request function
export const postEventsData = async (endpoint: string, data: object): Promise<any> => {
//   try {
//     const response = await api.post(endpoint, data);
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
};
