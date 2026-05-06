import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessKey, lojistaId } = body;

    if (!accessKey || !lojistaId) {
      return NextResponse.json({ error: "accessKey e lojistaId são obrigatórios." }, { status: 400 });
    }

    // TODO: aqui você pode chamar a Cloud Function ou outro serviço de backend
    // para ler o XML da SEFAZ, extrair peso/valor, criar os registros em Notas_Fiscais e Fretes.

    return NextResponse.json({ success: true, message: "Requisição recebida. A Cloud Function processará a NF-e." });
  } catch (err) {
    console.error("Erro no upload-nfe:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}
