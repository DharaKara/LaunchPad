import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def _env_str(key: str, default: str) -> str:
    return os.getenv(key, default)


def _env_int(key: str, default: int) -> int:
    value = os.getenv(key)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _env_list(key: str, default: List[str]) -> List[str]:
    value = os.getenv(key)
    if value is None:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


if os.getenv("GEMINI_API_KEY") and not os.getenv("API_KEY"):
    os.environ["API_KEY"] = os.getenv("GEMINI_API_KEY")


@dataclass
class Settings:
    PROJECT_NAME: str = _env_str("PROJECT_NAME", "LaunchPad Career OS")
    CORS_ORIGINS: List[str] = field(default_factory=lambda: _env_list("CORS_ORIGINS", ["*"]))
    PORT: int = _env_int("PORT", 8000)
    KEY_CAREER: bool = bool(os.getenv("GEMINI_KEY_CAREER") or os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY"))
    KEY_CV_SIM: bool = bool(os.getenv("GEMINI_KEY_CV_SIM") or os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY"))
    KEY_CV_IMPROVE: bool = bool(os.getenv("GEMINI_KEY_CV_IMPROVE") or os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY"))


settings = Settings()
