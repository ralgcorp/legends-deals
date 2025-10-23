import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "wallet", "carteiras.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ carteirasAutorizadas: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao ler carteiras:", error);
    return NextResponse.json(
      { error: "Erro ao carregar carteiras" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { carteira } = await request.json();

    if (!carteira || typeof carteira !== "string") {
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "wallet", "carteiras.json");

    // Ler arquivo atual
    let data: { carteirasAutorizadas: string[] } = { carteirasAutorizadas: [] };
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(fileContent);
    }

    // Verificar se a carteira já existe
    if (data.carteirasAutorizadas.includes(carteira)) {
      return NextResponse.json(
        { error: "Carteira já está autorizada" },
        { status: 409 }
      );
    }

    // Adicionar nova carteira
    data.carteirasAutorizadas.push(carteira);

    // Salvar arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: "Carteira adicionada com sucesso",
      carteirasAutorizadas: data.carteirasAutorizadas,
    });
  } catch (error) {
    console.error("Erro ao adicionar carteira:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar carteira" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { carteira } = await request.json();

    if (!carteira || typeof carteira !== "string") {
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "wallet", "carteiras.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Arquivo de carteiras não encontrado" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Remover carteira
    data.carteirasAutorizadas = data.carteirasAutorizadas.filter(
      (c: string) => c.toLowerCase() !== carteira.toLowerCase()
    );

    // Salvar arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: "Carteira removida com sucesso",
      carteirasAutorizadas: data.carteirasAutorizadas,
    });
  } catch (error) {
    console.error("Erro ao remover carteira:", error);
    return NextResponse.json(
      { error: "Erro ao remover carteira" },
      { status: 500 }
    );
  }
}
