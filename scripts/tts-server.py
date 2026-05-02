"""
Lightweight TTS server wrapping edge-tts.

Requirements: pip install edge-tts aiohttp
Run:          python tools/tts-server.py
Listens on:   http://localhost:8765
"""

import edge_tts
from aiohttp import web

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def _cors(response: web.Response) -> web.Response:
    response.headers.update(CORS_HEADERS)
    return response


async def handle_options(_request: web.Request) -> web.Response:
    return _cors(web.Response(status=204))


async def handle_health(_request: web.Request) -> web.Response:
    return _cors(web.json_response({"status": "ok"}))


async def handle_voices(_request: web.Request) -> web.Response:
    voices = await edge_tts.list_voices()
    result = [
        {
            "name": v["ShortName"],
            "gender": v.get("Gender", ""),
            "locale": v.get("Locale", ""),
            "styles": v.get("StyleList", []),
        }
        for v in voices
    ]
    return _cors(web.json_response(result))


async def handle_synthesize(request: web.Request) -> web.StreamResponse:
    try:
        body = await request.json()
    except Exception:
        return _cors(web.json_response({"error": "Invalid JSON"}, status=400))

    text = body.get("text", "").strip()
    voice = body.get("voice", "en-US-AriaNeural")
    rate = body.get("rate", "+0%")

    if not text:
        return _cors(web.json_response({"error": "text is required"}, status=400))

    response = web.StreamResponse(
        status=200,
        headers={
            "Content-Type": "audio/mpeg",
            **CORS_HEADERS,
        },
    )
    await response.prepare(request)

    communicate = edge_tts.Communicate(text, voice, rate=rate)
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            await response.write(chunk["data"])

    await response.write_eof()
    return response


app = web.Application()
app.router.add_route("OPTIONS", "/{path:.*}", handle_options)
app.router.add_get("/health", handle_health)
app.router.add_get("/voices", handle_voices)
app.router.add_post("/synthesize", handle_synthesize)

if __name__ == "__main__":
    print("TTS server starting on http://localhost:8765")
    web.run_app(app, host="0.0.0.0", port=8765)
