import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ items: [] });
    }

    const db = await connectDB();
    if (!db) return NextResponse.json({ items: [] });
    const cart = await Cart.findOne({ userId: (session.user as any).id });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { items } = await req.json();
    await connectDB();

    const cart = await Cart.findOneAndUpdate(
      { userId: (session.user as any).id },
      { items },
      { upsert: true, new: true }
    );

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar carrinho" },
      { status: 500 }
    );
  }
}
