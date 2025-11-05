export interface UserData {
  name: string;
  age: number;
  email: string;
  mobile: string;
  password: string;
}

export interface Beach {
  id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  safety: 'high' | 'medium' | 'low';
  popularActivities: string[];
}

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface Review {
  id: string;
  beachId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}