import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

vector_store = {}

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


def create_embeddings(chunks):
    embeddings = model.encode(chunks)
    return np.array(embeddings).astype("float32")


def store_document(document_id, text):
    chunks = chunk_text(text)
    embeddings = create_embeddings(chunks)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    vector_store[document_id] = (index, chunks)


def retrieve(document_id, query, top_k=5):
    if document_id not in vector_store:
        print("Document not found in vector_store")
        return []

    index, chunks = vector_store[document_id]
    query_embedding = model.encode([query]).astype("float32")

    distances, indices = index.search(query_embedding, top_k)
    results = [chunks[i] for i in indices[0] if i < len(chunks)]

    return results