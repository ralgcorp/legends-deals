import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFileNameFromDealName, getDealDisplayName } from "@/utils/dealUtils";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const files = fs.readdirSync(dataDir);

    const deals = files
      .filter((file) => {
        // Filtrar apenas arquivos JSON
        if (!file.endsWith(".json")) return false;

        // Excluir arquivos que contenham ".deleted." no nome
        if (file.includes(".deleted.")) return false;

        // Excluir arquivos de backup
        if (file.includes(".backup.")) return false;

        return true;
      })
      .map((file) => {
        const fileName = file.replace(".json", "");

        // Tentar encontrar o nome completo da DEAL lendo o arquivo
        try {
          const filePath = path.join(dataDir, file);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const dealData = JSON.parse(fileContent);

          // Se o arquivo tem dealName, usar ele e remover o número, senão usar o nome do arquivo
          if (dealData.dealName) {
            return getDealDisplayName(dealData.dealName);
          } else {
            return fileName;
          }
        } catch (error) {
          // Se não conseguir ler o arquivo, usar o nome do arquivo
          return fileName;
        }
      })
      .sort();

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Erro ao listar DEALs:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
