import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ products: [] });

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({ product });
    }

    if (slug) {
      const product = await Product.findOne({ slug });
      if (!product) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }
      product.views += 1;
      await product.save();
      return NextResponse.json({ product });
    }

    const query: any = {};
    if (category && category !== "todos") {
      const catMap: Record<string, string> = {
        novidades: "novidades",
        drop: "drop",
      };
      query.category = catMap[category] || category;
    }
    if (featured === "true") query.featured = true;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ products: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
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

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Products PATCH error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
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
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Produto deletado" });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}
