import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ orders: [] });

    const session = await getServerSession(authOptions);

    if ((session?.user as any)?.role === "admin") {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }

    if (!session?.user) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await Order.find({
      userId: (session.user as any).id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { items, shippingAddress, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (acc: number, i: any) => acc + i.price * i.quantity,
      0
    );
    const shipping = total >= 299 ? 0 : 19.9;

    await connectDB();

    const order = await Order.create({
      userId: (session.user as any).id,
      items,
      total: total + shipping,
      shipping,
      shippingAddress,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json();

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Orders PATCH error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
