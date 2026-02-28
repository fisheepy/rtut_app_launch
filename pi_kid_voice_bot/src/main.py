from __future__ import annotations

from pathlib import Path
import subprocess

from openai import OpenAI

from .audio_io import record_wav
from .brain import generate_reply
from .config import settings
from .tts import synthesize_to_file


def transcribe(client: OpenAI, wav_path: Path) -> str:
    with wav_path.open("rb") as f:
        text = client.audio.transcriptions.create(model=settings.whisper_model, file=f)
    return text.text.strip()


def play_audio(path: Path) -> None:
    subprocess.run(["ffplay", "-nodisp", "-autoexit", "-loglevel", "quiet", str(path)], check=True)


def run() -> None:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required")

    client = OpenAI(api_key=settings.openai_api_key)
    data_dir = Path("data")

    print("Kid Voice Bot ready. Press Enter to talk, Ctrl+C to exit.")
    while True:
        input("\nPress Enter and start speaking...")
        wav = data_dir / "input.wav"
        out_mp3 = data_dir / "reply.mp3"

        print("Recording...")
        record_wav(wav, settings.audio_seconds, settings.audio_sample_rate, settings.audio_channels)

        print("Transcribing...")
        user_text = transcribe(client, wav)
        if not user_text:
            print("I didn't catch that, try again.")
            continue

        print(f"Child said: {user_text}")
        reply = generate_reply(client, settings.openai_model, user_text)
        print(f"Bot reply: {reply}")

        synthesize_to_file(reply, settings.voice, out_mp3)
        play_audio(out_mp3)


if __name__ == "__main__":
    run()
