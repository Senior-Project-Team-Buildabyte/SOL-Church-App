import axios from 'axios';


const API_BASE_URL = 'localhost:3000'
// Define a generic response type
export interface ApiResponse {
  data: any;
}
//  SHOULD BE UNCOMMENTED WHEN API WILL BE CREATED 

// Create an Axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL || 'https://your-default-api.com',
//   timeout: 10000, // 10 seconds timeout
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
//export default api;