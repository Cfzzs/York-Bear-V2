import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { sendEventNotification } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ events: [] });
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};
    if (published === "true") query.published = true;

    const events = await Event.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json({ events: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const event = await Event.create(body);

    if (event.published) {
      try {
        const users = await User.find({ role: "user" });
        const emailPromises = users.map((user) =>
          sendEventNotification(user.email, {
            title: event.title,
            description: event.description,
            date: event.date,
            image: event.image,
            link: event.link,
          })
        );
        await Promise.allSettled(emailPromises);
        event.notified = true;
        await event.save();
      } catch (emailError) {
        console.error("Error sending event emails:", emailError);
      }
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json(
      { error: "Erro ao criar evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await connectDB();
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Evento deletado" });
  } catch (error) {
    console.error("Events DELETE error:", error);
    return NextResponse.json(
      { error: "Erro ao deletar evento" },
      { status: 500 }
    );
  }
}
