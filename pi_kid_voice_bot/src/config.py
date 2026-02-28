from dataclasses import dataclass
import os
from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    whisper_model: str = os.getenv("WHISPER_MODEL", "whisper-1")
    voice: str = os.getenv("VOICE", "zh-CN-XiaoxiaoNeural")
    audio_seconds: int = int(os.getenv("AUDIO_SECONDS", "5"))
    audio_sample_rate: int = int(os.getenv("AUDIO_SAMPLE_RATE", "16000"))
    audio_channels: int = int(os.getenv("AUDIO_CHANNELS", "1"))


settings = Settings()
