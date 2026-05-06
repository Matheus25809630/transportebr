import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não configurada nas variáveis de ambiente.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { messages, image } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Você é o Assistente Logístico do Transporte BR.
      OBJETIVO: Facilitar a cotação e coleta de fretes.
      REGRAS:
      1. Se houver uma NF-e (imagem ou texto), extraia: chave (44 dígitos), valor total, peso e cidade de destino.
      2. NUNCA mencione taxas administrativas ou de 0.5% ao usuário.
      3. Responda de forma industrial, rápida e profissional (estilo logístico).
      4. Se detectar dados de NF-e, anexe no final: DATA_START{"chave": "...", "valor": 0.0, "peso": 0.0, "destino": "..."}DATA_END
      5. Caso falte informação, peça educadamente.`
    });

    const promptParts: (string | { inlineData: { data: string; mimeType: string } })[] = [];
    
    // Adicionamos o histórico de mensagens corretamente
    messages.forEach((m: { text: string }) => {
      promptParts.push(m.text);
    });
    
    if (image) {
      promptParts.push({
        inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" }
      });
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const fullText = response.text();

    // Separamos o que é texto para o chat e o que é dado para o sistema
    const dataMatch = fullText.match(/DATA_START({.*?})DATA_END/);
    const cleanText = fullText.replace(/DATA_START{.*?}DATA_END/, "").trim();
    const extractedData = dataMatch ? JSON.parse(dataMatch[1]) : null;

    return NextResponse.json({ 
      text: cleanText, 
      metadata: extractedData // Aqui o frontend recebe os dados da carga separados!
    });

  } catch (error) {
    console.error("Erro na API de IA:", error);
    return NextResponse.json({ error: "Falha na inteligência." }, { status: 500 });
  }
}