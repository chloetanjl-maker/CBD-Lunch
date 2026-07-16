export type DealInput = {
  name: string;
  restaurant: string;
  address: string;
  price: number;
  description: string | null;
  dealDays: string | null;
  link: string | null;
  lat: number | null;
  lng: number | null;
};

export class ValidationError extends Error {}

function str(value: unknown, field: string, { required = true } = {}) {
  if (typeof value !== "string" || value.trim() === "") {
    if (required) throw new ValidationError(`${field} is required`);
    return null;
  }
  return value.trim();
}

function num(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be a number`);
  return n;
}

export function parseDealInput(body: unknown): DealInput {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }
  const b = body as Record<string, unknown>;

  const name = str(b.name, "name")!;
  const restaurant = str(b.restaurant, "restaurant")!;
  const address = str(b.address, "address")!;

  const priceRaw = b.price;
  const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw);
  if (!Number.isFinite(price) || price <= 0) {
    throw new ValidationError("price must be a positive number");
  }

  const lat = num(b.lat, "lat");
  const lng = num(b.lng, "lng");
  if (lat !== null && (lat < -90 || lat > 90)) {
    throw new ValidationError("lat must be between -90 and 90");
  }
  if (lng !== null && (lng < -180 || lng > 180)) {
    throw new ValidationError("lng must be between -180 and 180");
  }

  return {
    name,
    restaurant,
    address,
    price,
    description: str(b.description, "description", { required: false }),
    dealDays: str(b.dealDays, "dealDays", { required: false }),
    link: str(b.link, "link", { required: false }),
    lat,
    lng,
  };
}
