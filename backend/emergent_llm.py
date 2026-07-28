class LLMResponse:
    def __init__(self, text=""):
        self.text = text
    def __str__(self):
        return self.text
    def json(self):
        return {"response": self.text}

class LlmChat:
    def __init__(self, api_key=None, model=None, system_message=None, session_id=None, **kwargs):
        pass

    def with_model(self, provider=None, model_name=None, *args, **kwargs):
        return self

    async def send_message(self, message, *args, **kwargs):
        content = getattr(message, "text", str(message))
        return LLMResponse(f"**Welcome** — {content.splitlines()[0] if content else 'Founder'}.\n\n**Strengths Detected** — Cross-border coordination, operations.\n\n**Learning Roadmap** — 1. Review trade regulations.\n\n**Community Match** — Connect with logistics experts in the UAE hub.")

class UserMessage:
    def __init__(self, text=None, message=None, **kwargs):
        self.text = text or message
