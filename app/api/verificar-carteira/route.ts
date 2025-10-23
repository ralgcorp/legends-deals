import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { carteira } = await request.json();

    if (!carteira || typeof carteira !== "string") {
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "wallet", "carteiras.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ autorizada: false });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    const autorizada = data.carteirasAutorizadas.some(
      (c: string) => c.toLowerCase() === carteira.toLowerCase()
    );

    return NextResponse.json({ autorizada });
  } catch (error) {
    console.error("Erro ao verificar carteira:", error);
    return NextResponse.json(
      { error: "Erro ao verificar carteira" },
      { status: 500 }
    );
  }
}
