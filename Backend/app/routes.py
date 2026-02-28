import json
from fastapi import APIRouter, UploadFile, File
from app.utils import save_file, extract_text_from_pdf
from app.rag import store_document, retrieve
from app.services import generate_mindmap_with_context, generate_direct_mindmap
from app.models import MindmapRequest

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    document_id, file_path = save_file(file)

    text = extract_text_from_pdf(file_path)
    store_document(document_id, text)

    return {"document_id": document_id}


@router.post("/generate-mindmap")
async def generate_mindmap(request: MindmapRequest):
    if request.document_id:
        context_chunks = retrieve(request.document_id, request.topic)
        result = generate_mindmap_with_context(request.topic, context_chunks)
        return {"mindmap": json.loads(result)}

    else:
        result = generate_direct_mindmap(request.topic)
        return {"mindmap": json.loads(result)}