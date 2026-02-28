from __future__ import annotations

from pathlib import Path
import wave

import numpy as np
import sounddevice as sd


def record_wav(path: Path, seconds: int, sample_rate: int, channels: int) -> None:
    audio = sd.rec(int(seconds * sample_rate), samplerate=sample_rate, channels=channels, dtype="int16")
    sd.wait()

    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(np.asarray(audio).tobytes())
