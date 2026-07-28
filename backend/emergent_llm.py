class LlmChat:
    def __init__(self, api_key=None, model=None, system_message=None, session_id=None, **kwargs):
        pass

    def with_model(self, model, *args, **kwargs):
        return self

    async def send_message(self, message: str, *args, **kwargs):
        return "Mock response"

class UserMessage:
    def __init__(self, message=None, **kwargs):
        pass
