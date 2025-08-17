import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.138.21:5500/',
});

// // Request interceptor
// axiosInstance.interceptors.request.use((request) => {
//   console.log('Starting Request:', { url: request.url, data: request.data });
//   return request;
// });

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('Response:', { url: response.config.url, data: response.data });
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.log('Error Response:', {
//         url: error.response.config.url,
//         data: error.response.data,
//       });
//     } else {
//       console.log('Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );
