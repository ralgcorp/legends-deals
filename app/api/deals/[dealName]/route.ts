import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFileNameFromDealName } from "@/utils/dealUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dealName: string }> }
) {
  try {
    const { dealName } = await params;
    const fileName = getFileNameFromDealName(dealName);
    const filePath = path.join(process.cwd(), "data", `${fileName}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "DEAL não encontrada" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const dealData = JSON.parse(fileContent);

    return NextResponse.json(dealData);
  } catch (error) {
    console.error("Erro ao carregar DEAL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ dealName: string }> }
) {
  try {
    const { dealName } = await params;
    const newDealData = await request.json();

    console.log("Criando DEAL:", dealName);
    console.log("Dados recebidos:", newDealData);

    const fileName = getFileNameFromDealName(dealName);
    const filePath = path.join(process.cwd(), "data", `${fileName}.json`);

    // Verificar se a DEAL já existe
    if (fs.existsSync(filePath)) {
      console.log("DEAL já existe:", filePath);
      return NextResponse.json({ error: "DEAL já existe" }, { status: 409 });
    }

    // Criar a nova DEAL
    fs.writeFileSync(filePath, JSON.stringify(newDealData, null, 2), "utf8");
    console.log("DEAL criada com sucesso:", filePath);

    return NextResponse.json({
      message: "DEAL criada com sucesso",
      dealName: dealName,
    });
  } catch (error) {
    console.error("Erro ao criar DEAL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ dealName: string }> }
) {
  try {
    const { dealName } = await params;
    const updatedData = await request.json();

    const fileName = getFileNameFromDealName(dealName);
    const filePath = path.join(process.cwd(), "data", `${fileName}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "DEAL não encontrada" },
        { status: 404 }
      );
    }

    // Criar pasta deals-backup se não existir (fora da pasta data)
    const backupDealsDir = path.join(process.cwd(), "deals-backup");
    if (!fs.existsSync(backupDealsDir)) {
      fs.mkdirSync(backupDealsDir, { recursive: true });
      console.log("Pasta deals-backup criada:", backupDealsDir);
    }

    // Fazer backup do arquivo original
    const backupPath = path.join(
      backupDealsDir,
      `${fileName}.backup.${Date.now()}.json`
    );
    fs.copyFileSync(filePath, backupPath);

    // Salvar os dados atualizados
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");

    return NextResponse.json({
      message: "DEAL atualizada com sucesso",
      backup: backupPath,
    });
  } catch (error) {
    console.error("Erro ao salvar DEAL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dealName: string }> }
) {
  try {
    const { dealName } = await params;

    console.log("Deletando DEAL:", dealName);

    const fileName = getFileNameFromDealName(dealName);
    const filePath = path.join(process.cwd(), "data", `${fileName}.json`);

    // Verificar se a DEAL existe
    if (!fs.existsSync(filePath)) {
      console.log("DEAL não encontrada:", filePath);
      return NextResponse.json(
        { error: "DEAL não encontrada" },
        { status: 404 }
      );
    }

    // Criar pasta deals-deleted se não existir (fora da pasta data)
    const deletedDealsDir = path.join(process.cwd(), "deals-deleted");
    if (!fs.existsSync(deletedDealsDir)) {
      fs.mkdirSync(deletedDealsDir, { recursive: true });
      console.log("Pasta deals-deleted criada:", deletedDealsDir);
    }

    // Mover arquivo para pasta deals-deleted
    const deletedFilePath = path.join(
      deletedDealsDir,
      `${fileName}.deleted.${Date.now()}.json`
    );
    fs.renameSync(filePath, deletedFilePath);

    console.log("DEAL movida para deals-deleted:", deletedFilePath);

    return NextResponse.json({
      message: "DEAL deletada com sucesso",
      deletedPath: deletedFilePath,
    });
  } catch (error) {
    console.error("Erro ao deletar DEAL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
