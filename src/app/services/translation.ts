// translation.ts
//run libretranslate using port5000 bash-  docker run -p 5000:5000 libretranslate/libretranslate --load-only en,hi --update-models

/**
 * Translates English text to selected language using locally running LibreTranslate API.
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text.trim()) throw new Error("Please enter text to translate");

  try {
    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error("Translation API call failed");
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed");
  }
}
