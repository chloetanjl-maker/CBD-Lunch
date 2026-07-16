import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDealInput, ValidationError } from "@/lib/dealInput";

export async function GET() {
  const deals = await prisma.deal.findMany({ orderBy: { price: "asc" } });
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = parseDealInput(body);
    const deal = await prisma.deal.create({ data: input });
    return NextResponse.json(deal, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
