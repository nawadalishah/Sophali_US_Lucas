import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY || "";

const client = new Client({});

export const calculateDistance = async (origin: string, destination: string) => {
  try {
    if (!GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not set.");
      return null;
    }

    const response = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        mode: TravelMode.driving,
        units: UnitSystem.metric,
        key: GOOGLE_API_KEY,
      },
    });

    const data = response.data;

    if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements.length > 0) {
      const element = data.rows[0].elements[0];
      if (element.status === 'OK') {
        const distance = element.distance.text;
        const duration = element.duration.text;
        return { distance, duration };
      } else {
        console.log("Element status:", element.status);
        return null;
      }
    } else {
      console.log("API response status:", data.status);
      if (data.error_message) {
        console.log("Error message:", data.error_message);
      }
      return null;
    }
  } catch (error: any) {
    if (error && error.message) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};
