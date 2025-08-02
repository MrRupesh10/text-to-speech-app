// Server-side route to proxy requests to LibreTranslate (bypasses CORS)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, toLang } = await req.json();

  if (!text || !toLang) {
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });
  }

  try {
    // Make request to LibreTranslate server-side to avoid CORS issues
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: toLang,
        format: 'text'
      })
    });

    if (!res.ok) {
      throw new Error(`LibreTranslate API returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ translatedText: data.translatedText });
  } catch (err) {
    console.error('[Translation Error]', err);
    return NextResponse.json({ error: 'Translation failed at server' }, { status: 500 });
  }
}
