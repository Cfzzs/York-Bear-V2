import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Countdown from "@/models/Countdown";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ countdown: null });
    const countdown = await Countdown.findOne({ active: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ countdown });
  } catch (error) {
    console.error("Countdown GET error:", error);
    return NextResponse.json({ countdown: null });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const countdown = await Countdown.create(body);
    return NextResponse.json({ countdown }, { status: 201 });
  } catch (error) {
    console.error("Countdown POST error:", error);
    return NextResponse.json(
      { error: "Erro ao criar countdown" },
      { status: 500 }
    );
  }
}
