from openai import OpenAI


SYSTEM_PROMPT = (
    "你是一个给 6-12 岁儿童使用的语音学习伙伴。"
    "请使用简短、温和、鼓励性的中文回答，避免暴力、色情、恐吓、歧视、危险行为指导。"
    "当问题涉及危险内容时，礼貌拒绝并引导孩子寻求家长或老师帮助。"
)


def generate_reply(client: OpenAI, model: str, user_text: str) -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text},
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content or "我在这里，你可以再说一次吗？"
