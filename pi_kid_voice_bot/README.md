# Pi Kid Voice Bot (MVP)

这是一个可在 Raspberry Pi 上“开机可跑”的儿童语音机器人最小版本。

## 功能（MVP）
- 按回车开始一次对话循环（后续可替换为 GPIO 按钮）
- 录音 -> 语音识别（OpenAI Whisper API）
- 生成儿童友好回复（带安全系统提示）
- 文本转语音并播放（edge-tts）
- 提供 systemd 服务模板，可设置开机自启动

## 目录结构
- `src/main.py`：主循环
- `src/config.py`：环境变量与配置
- `src/audio_io.py`：录音/播放
- `src/brain.py`：对话逻辑
- `src/tts.py`：语音合成
- `services/kidbot.service`：systemd 服务模板
- `scripts/install_on_pi.sh`：在树莓派上的快速安装脚本

## 1) 本地运行（开发）
```bash
cd pi_kid_voice_bot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
python -m src.main
```

## 2) 树莓派部署（推荐 Raspberry Pi OS Bookworm）
```bash
cd /opt
sudo git clone <your-new-repo-url> pi_kid_voice_bot
cd pi_kid_voice_bot
bash scripts/install_on_pi.sh
```

安装脚本会：
1. 安装系统依赖（python、portaudio、ffmpeg）
2. 创建虚拟环境并安装 Python 依赖
3. 复制并启用 `kidbot.service`

## 3) 开机启动
```bash
sudo systemctl enable kidbot.service
sudo systemctl start kidbot.service
sudo systemctl status kidbot.service
```

## 4) 建议的下一步
- 替换“按回车触发”为 GPIO 实体按钮
- 增加唤醒词（如 Porcupine）
- 增加家长控制：时段限制、敏感主题拦截、日志脱敏
- 增加离线降级链路（Vosk + Piper）

## 环境变量
见 `.env.example`。
