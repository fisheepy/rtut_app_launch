from src.brain import SYSTEM_PROMPT


def test_system_prompt_mentions_child_safety() -> None:
    assert "儿童" in SYSTEM_PROMPT
    assert "危险" in SYSTEM_PROMPT
