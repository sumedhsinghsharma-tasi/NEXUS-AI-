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

    def with_model(self, provider, model_name=None, *args, **kwargs):
        return self

    async def send_message(self, message, *args, **kwargs):
        # Extract text if a UserMessage or similar object is passed
        content = getattr(message, "text", str(message))
        return LLMResponse(f"Welcome! Here is your custom AI insight based on: {content[:50]}...")

class UserMessage:
    def __init__(self, text=None, message=None, **kwargs):
        self.text = text or message
