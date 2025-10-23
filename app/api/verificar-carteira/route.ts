import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { carteira } = await request.json();
    console.log("Verificando carteira:", carteira);

    if (!carteira || typeof carteira !== "string") {
      console.log("Carteira inválida:", carteira);
      return NextResponse.json({ error: "Carteira inválida" }, { status: 400 });
    }

    // Tentar diferentes caminhos para o arquivo (apenas caminhos seguros)
    const possiblePaths = [
      path.join(process.cwd(), "wallet", "carteiras.json"),
      path.join(process.cwd(), "..", "wallet", "carteiras.json"),
      path.join(__dirname, "..", "..", "..", "wallet", "carteiras.json"),
      path.join(process.cwd(), "data", "carteiras.json"), // Fallback para pasta data
    ];

    let filePath = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        filePath = possiblePath;
        break;
      }
    }

    console.log("Caminho do arquivo encontrado:", filePath);

    if (!filePath) {
      console.log("Arquivo não encontrado em nenhum dos caminhos possíveis");
      return NextResponse.json({ autorizada: false });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);
    console.log("Dados do arquivo:", data);

    const autorizada = data.carteirasAutorizadas.some(
      (c: string) => c.toLowerCase() === carteira.toLowerCase()
    );

    console.log("Carteira autorizada:", autorizada);
    return NextResponse.json({ autorizada });
  } catch (error) {
    console.error("Erro ao verificar carteira:", error);
    return NextResponse.json(
      { error: "Erro ao verificar carteira" },
      { status: 500 }
    );
  }
}
