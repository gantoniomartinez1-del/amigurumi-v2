import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metodo no permitido" };
  }

  // 1. Configurar la API Key de Google (la que pondremos en Netlify)
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { image, size, hook } = JSON.parse(event.body);

    // 2. Extraer la base64 de la imagen (quitando el encabezado de data:image)
    const imageData = image.split(",")[1];

    const prompt = `Eres un experto en diseño de amigurumis. 
    Analiza la imagen adjunta y crea un patrón para un tamaño ${size} usando un gancho de ${hook}.
    Escribe el patrón paso a paso en español, incluyendo materiales, abreviaturas y vueltas detalladas.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pattern: response.text() }),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error al generar el patrón con Gemini" }) 
    };
  }
};
