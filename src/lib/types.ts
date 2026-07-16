export type DealDTO = {
  id: number;
  name: string;
  restaurant: string;
  address: string;
  price: number;
  description: string | null;
  dealDays: string | null;
  link: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  updatedAt: string;
};
