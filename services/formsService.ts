//import api from './api.service'; 

export interface FormsData {
   
    title: string;
    link: string;
  }
  
  const dummyData: FormsData[] = [
    {
      title: 'Connect Form',
      link: 'https://solsacramento.churchcenter.com/people/forms/718725'
    },
    {
      title: 'Meet with Pastor',
      link: 'https://calendly.com/office-fb6/45min'
    },
    {
      title: 'Prayer Request',
      link: 'https://solsacramento.churchcenter.com/people/forms/612308'
    },
    {
      title: 'Membership Class',
      link: ' https://solsacramento.churchcenter.com/people/forms/581714'
    },
    {
      title: 'Baptism Class',
      link: 'https://solsacramento.churchcenter.com/people/forms/460975'
    },
    {
      title: 'Serve',
      link: 'https://solsacramento.churchcenter.com/people/forms/708470'
    },
    {
      title: 'Child Dedication',
      link: 'https://solsacramento.churchcenter.com/people/forms/708470'
    },
    {
      title: 'Leave Membership',
      link: 'https://solsacramento.churchcenter.com/people/forms/589043'
    },
    
  ];
  
  // Fetch events data from API or fallback to dummy data
  export const fetchFormsData = async (endpoint: string): Promise<FormsData[]> => {
      return dummyData;
  //   try {
  //     const response = await api.get<FormsData[]>(endpoint);
  //     return response.data;
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     return dummyData; // Fallback to dummy data if API call fails
  //   }
  };
  
  // Generic POST request function
  export const postFormsData = async (endpoint: string, data: object): Promise<any> => {
  //   try {
  //     const response = await api.post(endpoint, data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     throw error;
  //   }
  };
  