#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

sudo apt-get update
sudo apt-get install -y python3 python3-venv python3-pip portaudio19-dev ffmpeg

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from template. Please edit OPENAI_API_KEY before starting service."
fi

sudo cp services/kidbot.service /etc/systemd/system/kidbot.service
sudo systemctl daemon-reload

echo "Install complete. Next steps:"
echo "  1) Edit $ROOT_DIR/.env"
echo "  2) sudo systemctl enable kidbot.service"
echo "  3) sudo systemctl start kidbot.service"
