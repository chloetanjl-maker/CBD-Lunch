import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Real CBD salad spots, researched from public sources (Eatbook.sg,
// TheSmartLocal, food blogs) in July 2026. Prices, hours, and exact
// coordinates may have changed since — edit or replace entries via the
// app once you've verified them.
const deals = [
  {
    name: "Lettuce-Base Salad",
    restaurant: "Green Bites Salad",
    address: "50 Market Street, Golden Shoe Car Park, #03-20, Singapore 048940",
    price: 5.0,
    description: "Build-your-own salad; spinach base available for $6.",
    dealDays: "Mon-Fri, 10:30am-3pm",
    lat: 1.2836,
    lng: 103.8496,
  },
  {
    name: "Build-Your-Own Junior Salad",
    restaurant: "Salads and Wraps",
    address: "Icon Village, 12 Gopeng Street, #01-86/87, Singapore 078877",
    price: 7.0,
    description: "6 regular ingredients of your choice, or a $7 Greek/Caesar salad.",
    dealDays: "Mon-Fri, 11am-8pm; Sun 11am-3.30pm",
    lat: 1.2758,
    lng: 103.8437,
  },
  {
    name: "Petite Protein Bowl",
    restaurant: "The Daily Cut",
    address: "Tanjong Pagar Centre, 7 Wallich Street, #B2-16, Singapore 078884",
    price: 10.5,
    description: "2 bases, 1/2 protein, 2 supplements, 1 topping, 1 dressing.",
    dealDays: "Mon-Fri, 11am-8:30pm",
    lat: 1.2765,
    lng: 103.8455,
  },
  {
    name: "Tuna Sans Salad",
    restaurant: "SaladStop!",
    address: "Capital Tower, 168 Robinson Road, #01-05, Singapore 068912",
    price: 12.9,
    description: "Build-your-own bowl chain; this is one of their signature salads.",
    dealDays: "Mon-Fri, 11am-7:30pm",
    lat: 1.2758,
    lng: 103.8459,
  },
  {
    name: "Build-Your-Own Grain Bowl",
    restaurant: "Grain Traders",
    address: "CapitaGreen, 138 Market Street, #01-01/02/03, Singapore 048946",
    price: 16.0,
    description: "1 grain, 1 protein, 1 hot veg, 2 cold veg, 1 sauce, 1 topping.",
    dealDays: "Mon-Fri, 8am-5pm",
    lat: 1.2837,
    lng: 103.8503,
  },
] as const;

async function main() {
  await prisma.deal.deleteMany();
  for (const deal of deals) {
    await prisma.deal.create({ data: deal });
  }
  console.log(`Seeded ${deals.length} deals.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
