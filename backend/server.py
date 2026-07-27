from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone




ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

app = FastAPI()
api_router = APIRouter(prefix="/api")


# Models
class FounderCreate(BaseModel):
    name: str
    skills: str
    learning_goals: str
    consent: bool


class Founder(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    skills: str
    learning_goals: str
    consent: bool
    ai_insight: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


async def generate_ai_insight(name: str, skills: str, learning_goals: str) -> str:
    """Generate a personalized welcome + learning roadmap via Claude Sonnet 4.5."""
    system_message = (
        "You are the AI Engine for NEXUS AI COMMUNITY HUB — a UAE-based founders' "
        "community. When a new founder joins, you produce a concise, warm onboarding "
        "briefing in clean markdown. Structure:\n"
        "1. **Welcome** — one personal sentence using their name.\n"
        "2. **Strengths Detected** — 2-3 bullets pulled from their skills.\n"
        "3. **Learning Roadmap** — 3 actionable steps tied to what they want to learn.\n"
        "4. **Community Match** — one suggestion (event, peer archetype, or resource).\n"
        "Tone: precise, confident, modern. Max 180 words. No emojis."
    )
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"founder-{uuid.uuid4()}",
        system_message=system_message,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    user_msg = UserMessage(
        text=(
            f"Founder Name: {name}\n"
            f"Skills: {skills}\n"
            f"Wants to learn: {learning_goals}\n\n"
            "Generate the onboarding briefing."
        )
    )
    response = await chat.send_message(user_msg)
    return str(response).strip()


@api_router.get("/")
async def root():
    return {"message": "NEXUS AI COMMUNITY HUB API"}


@api_router.post("/founders", response_model=Founder)
async def create_founder(payload: FounderCreate):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="UAE data privacy consent is required.")
    if not payload.name.strip() or not payload.skills.strip() or not payload.learning_goals.strip():
        raise HTTPException(status_code=400, detail="All fields are required.")

    try:
        insight = await generate_ai_insight(
            payload.name.strip(), payload.skills.strip(), payload.learning_goals.strip()
        )
    except Exception as e:
        logging.exception("AI engine failure")
        raise HTTPException(status_code=502, detail=f"AI engine error: {e}")

    founder = Founder(
        name=payload.name.strip(),
        skills=payload.skills.strip(),
        learning_goals=payload.learning_goals.strip(),
        consent=payload.consent,
        ai_insight=insight,
    )
    doc = founder.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.founders.insert_one(doc)
    return founder


@api_router.get("/founders", response_model=List[Founder])
async def list_founders():
    docs = await db.founders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
