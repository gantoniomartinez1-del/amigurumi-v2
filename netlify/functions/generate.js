import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. En Vercel, el método se revisa así
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // 2. Configurar la API Key desde las variables de entorno de Vercel
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return res.status(401).json({ error: "API Key no configurada en Vercel" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // En Vercel, el body ya viene parseado si usas JSON
    const { image, size, hook } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No se recibió la imagen" });
    }

    // Extraer la base64
    const imageData = image.split(",")[1];

    const prompt = `Eres un experto en diseño de amigurumis. 
    Analiza la imagen adjunta y crea un patrón para un tamaño ${size} usando un gancho de ${hook}.
    Escribe el patrón paso a paso en español, incluyendo materiales, abreviaturas y vueltas detalladas.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // 3. Respuesta al estilo Vercel
    return res.status(200).json({ pattern: text });

  } catch (error) {
    console.error("Error en Gemini:", error);
    return res.status(500).json({ error: "Error al generar el patrón con Gemini" });
  }
}
