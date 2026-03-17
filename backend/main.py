from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

from fastapi.middleware.cors import CORSMiddleware

from langchain_groq import ChatGroq

import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (good for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile"
)

# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

class Query(BaseModel):
    url: str
    question: str


@app.post("/chat")
async def chat(query: Query):

    # Load webpage
    loader = WebBaseLoader(
    query.url,
    header_template={
        "User-Agent": "Mozilla/5.0"
    }
    )
    docs = loader.load()

    # Split text
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    split_docs = splitter.split_documents(docs)

    # Create vector database
    vectorstore = FAISS.from_documents(split_docs, embeddings)

    # Retrieve relevant content
    results = vectorstore.similarity_search(query.question, k=3)

    context = "\n".join([doc.page_content for doc in results])

    prompt = f"""
                Use the webpage information to answer the question.

                Context:
                {context}

                Question:
                {query.question}
            """

    # Ask LLM
    response = llm.invoke(prompt)

    return {
        "answer": response.content
    }