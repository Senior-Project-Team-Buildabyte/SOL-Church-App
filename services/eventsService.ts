//import api from './api.service'; 

export interface EventData {
  id: number;
  image: number | {uri: string};
  title: string;
  guestSpeaker: string | null;
  date: string;
  time: string | null;
  link: string;
  group: string | null; 
  day: string;
  month: string; 
  description: string | null;
  location: string | null | undefined;
}

const dummyData: EventData[] = [
  {
    id: 1,
    title: 'Rise & Shine',
    group: 'SOL Youth',
    guestSpeaker: null,
    link: '',
    date: 'Mon, Apr 7 – Sun, May 25',
    time: null,
    image: {uri:'https://example.com/image1.jpg'},
    day: '07',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 2,
    title: 'Good Friday',
    group: null,
    guestSpeaker: 'Guest speaker',
    link: '/event/',
    date: 'Fri, Apr 18',
    time: '6 - 8:30 PM',
    image: require('../assets/images/GoodFriday.jpg'),
    day: '18',
    month: 'APR',
    description: `Запрошуємо всіх на служіння в пʼятницю, April 18.
Служіння відбуватимуться о:
- 6:00pm - Ukrainian (main hall) / English (Coffee
Shop)
- 7:30pm - Ukrainian (main hall) / Russian (Coffee
Shop)`,
    location: '5948 Pecan Ave, Orangvale, CA 95662'
  },
  {
    id: 3,
    title: 'Alkatraz & Ocean Sunset',
    group: 'SOL Youth',
    guestSpeaker: null,
    link: '',
    date: 'Sat, Apr 19',
    time: null,
    image: { uri: 'https://example.com/image1.jpg'},
    day: '19',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 4,
    title: 'Easter Service',
    group: null,
    guestSpeaker: null,
    link: '',
    date: 'Sun, Apr 20',
    time: null,
    image: require('../assets/images/Easter.jpg'),
    day: '20',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 5,
    title: 'Easter Sunrise',
    group: 'SOL Youth',
    guestSpeaker: null,
    link: '',
    date: 'Sun, Apr 20',
    time: '6 - 7am',
    image: { uri: 'https://example.com/image1.jpg'},
    day: '20',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 6,
    title: 'Worship House',
    group: "SOL Youth",
    guestSpeaker: null,
    link: '',
    date: 'Tue, Apr 22 - Thu, Apr 24',
    time: null,
    image: { uri: 'https://example.com/image1.jpg'},
    day: '22',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 7,
    title: 'Теоголія - Ярослав Пиж',
    group: 'Відкриті Лекції',
    guestSpeaker: 'Ярослав Пиж',
    link: '',
    date: 'Fri, Apr 25',
    time: null,
    image: { uri: 'https://example.com/image1.jpg'},
    day: '25',
    month: 'APR',
    description: '',
    location: ''
  },
  {
    id: 8,
    title: 'Church Picnic',
    group: null,
    guestSpeaker: null,
    link: '',
    date: 'Sat, Apr 26',
    time: '2 - 9pm',
    image: { uri: 'https://example.com/image1.jpg'},
    day: '26',
    month: 'APR',
    description: '',
    location: ''
  },
  
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

// Fetch events data from API or fallback to dummy data
export const fetchSingleEventData = async (id: number): Promise<EventData> => {
  return dummyData.filter(x => x.id == id)[0];
//   try {
//     const response = await api.get<EventData>('/event/' + id);
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


export const getGeoLocation = async (location: string): Promise<any> => {
  var request = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=';
  location.split(/[\s,]+/).forEach(element => {
    request += element + '+';
  });
  request = request.slice(0, request.length - 1) + '&benchmark=4&format=json';
  const response = await fetch(request);
    const json = await response.json();
  //https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Washington%2C+DC+20233&benchmark=4&format=json
  return json;
}
