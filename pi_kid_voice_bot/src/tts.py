import asyncio
from pathlib import Path
import edge_tts


async def _speak_async(text: str, voice: str, output: Path) -> None:
    communicate = edge_tts.Communicate(text=text, voice=voice)
    await communicate.save(str(output))


def synthesize_to_file(text: str, voice: str, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    asyncio.run(_speak_async(text, voice, output))
