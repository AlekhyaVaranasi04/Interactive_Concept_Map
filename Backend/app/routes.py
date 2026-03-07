import json
from fastapi import APIRouter, UploadFile, File,Body
from app.utils import save_file, extract_text_from_pdf
from app.rag import store_document, retrieve
from app.services import generate_mindmap_with_context, generate_direct_mindmap,generate_mindmap_from_text
from app.models import MindmapRequest
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from app.database import SessionLocal
from app.models_db import User
from app.auth import hash_password, verify_password, create_access_token
from app.models import UserCreate, UserLogin
from app.auth import get_current_user, get_db
from app.models_db import Mindmap, ChatSession
from app.services import validate_mindmap_structure
from app.services import safe_parse_json

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    document_id, file_path = save_file(file)

    text = extract_text_from_pdf(file_path)
    store_document(document_id, text)

    return {"document_id": document_id}

def convert_to_tree_format(data):
    root = {
        "topic": data["topic"],
        "children": []
    }

    for sub in data.get("subtopics", []):
        node = {
            "topic": sub["title"],
            "children": []
        }

        for p in sub.get("points", []):
            node["children"].append({
                "topic": p,
                "children": []
            })

        root["children"].append(node)

    return root


@router.post("/generate-mindmap")
async def generate_mindmap(
    request: MindmapRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # CASE 1 — Paragraph input
    if request.text:
        result = generate_mindmap_from_text(request.text)
        parsed = safe_parse_json(result)

        if not validate_mindmap_structure(parsed):
            result = generate_mindmap_from_text(request.text)
            parsed = safe_parse_json(result)

        topic_name = parsed.get("topic", "Untitled")

    # CASE 2 — PDF RAG
    elif request.document_id:
        context_chunks = retrieve(request.document_id, request.topic or "")
        result = generate_mindmap_with_context(request.topic or "", context_chunks)
        parsed = safe_parse_json(result)

        if not validate_mindmap_structure(parsed):
            result = generate_mindmap_with_context(request.topic or "", context_chunks)
            parsed = safe_parse_json(result)

        topic_name = request.topic or parsed.get("topic", "Document Based")

    # CASE 3 — Topic only
    elif request.topic:
        result = generate_direct_mindmap(request.topic)
        parsed = safe_parse_json(result)

        if not validate_mindmap_structure(parsed):
            result = generate_direct_mindmap(request.topic)
            parsed = safe_parse_json(result)

        topic_name = request.topic

    else:
        return {"error": "Provide topic, text, or document_id"}

    # 🔹 Save CLEAN structured JSON
    new_map = Mindmap(
        topic=topic_name,
        content=json.dumps(parsed),
        user_id=current_user.id
    )

    db.add(new_map)
    db.commit()

    return {"mindmap": parsed}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"user_id": db_user.id}
    )

    return {"access_token": access_token}

@router.get("/history")
def get_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mindmaps = db.query(Mindmap).filter(
        Mindmap.user_id == current_user.id
    ).all()

    return [
    {
        "id": m.id,
        "topic": m.topic,
        "content": json.loads(m.content),
        "created_at": m.created_at
    }
    for m in mindmaps
  ]

@router.post("/sessions")
def create_session(title: str = Body(None), current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    title = title or "New chat"
    s = ChatSession(title=title, user_id=current_user.id)
    db.add(s); db.commit(); db.refresh(s)
    return {"session": {"id": s.id, "title": s.title, "created_at": s.created_at.isoformat()}}

@router.get("/sessions")
def list_sessions(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.created_at.desc()).all()
    out = []
    for s in sessions:
        last_map = db.query(Mindmap).filter(Mindmap.chat_session_id == s.id).order_by(Mindmap.created_at.desc()).first()
        preview = None
        if last_map:
            try:
                preview = json.loads(last_map.content)
            except:
                preview = last_map.content
        out.append({"id": s.id, "title": s.title, "created_at": s.created_at, "preview": preview})
    return out

@router.get("/sessions/{session_id}")
def get_session_maps(session_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    s = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not s:
        return {"error": "Session not found"}
    maps = db.query(Mindmap).filter(Mindmap.chat_session_id == session_id).order_by(Mindmap.created_at).all()
    return [{"id": m.id, "topic": m.topic, "content": json.loads(m.content), "created_at": m.created_at.isoformat()} for m in maps]