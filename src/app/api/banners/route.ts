import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ banners: [] });
    const banners = await Banner.find({ active: true }).sort({ order: 1 });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Banners GET error:", error);
    return NextResponse.json({ banners: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const banner = await Banner.create(body);
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("Banners POST error:", error);
    return NextResponse.json(
      { error: "Erro ao criar banner" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const body = await req.json();
    await connectDB();

    const banner = await Banner.findByIdAndUpdate(id, body, { new: true });
    if (!banner) {
      return NextResponse.json(
        { error: "Banner não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Banners PATCH error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar banner" },
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
    await Banner.findByIdAndDelete(id);

    return NextResponse.json({ message: "Banner deletado" });
  } catch (error) {
    console.error("Banners DELETE error:", error);
    return NextResponse.json(
      { error: "Erro ao deletar banner" },
      { status: 500 }
    );
  }
}
