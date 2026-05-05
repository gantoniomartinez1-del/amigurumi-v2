import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método no permitido");

  const genAI = new GoogleGenerativeAI("AIzaSyB4MoUSWcp-6qFzcWLdecu_ZwB37B1hQk4");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { image, size, hook } = req.body; // Vercel ya parsea el JSON solo
    const imageData = image.split(",")[1];

    const prompt = `Eres un experto en amigurumis. Crea un patrón para tamaño ${size} con gancho ${hook} basado en la imagen.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);

    return res.status(200).json({ pattern: result.response.text() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
