#!/usr/bin/env python3
"""
Seed Pinecone vector index with EU AI Act regulation text.

Usage:
    cd backend
    python scripts/seed_pinecone.py

Requires PINECONE_API_KEY and GEMINI_API_KEY in .env
"""
import os
import sys
import json
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai

PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
PINECONE_INDEX = os.environ.get("PINECONE_INDEX", "regulations")
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

genai.configure(api_key=GEMINI_API_KEY)

# ─── EU AI Act regulation corpus ──────────────────────────────────────────────

REGULATIONS = [
    {
        "id": "art_5_1_a",
        "article": "5", "paragraph": "1", "point": "a",
        "title": "Prohibited AI — Subliminal manipulation",
        "risk_tier": "prohibited",
        "text": """Article 5(1)(a): The placing on the market, putting into service or use of an AI system 
        that deploys subliminal techniques beyond a person's consciousness or purposefully manipulative 
        or deceptive techniques, with the objective, or the effect of materially distorting the behaviour 
        of a person or a group of persons by appreciably impairing their ability to make an informed decision, 
        thereby causing them to take a decision that they would not have otherwise taken in a manner that 
        causes or is reasonably likely to cause that person, another person or group of persons significant harm.""",
        "keywords": ["subliminal", "manipulation", "deceptive", "behaviour", "decision"],
    },
    {
        "id": "art_5_1_b",
        "article": "5", "paragraph": "1", "point": "b",
        "title": "Prohibited AI — Exploitation of vulnerabilities",
        "risk_tier": "prohibited",
        "text": """Article 5(1)(b): AI systems that exploit any of the vulnerabilities of a natural person 
        or a specific group of persons due to their age, disability or a specific social or economic situation, 
        with the objective, or the effect, of materially distorting the behaviour of that person or a person 
        belonging to that group in a manner that causes or is reasonably likely to cause that person or 
        another person significant harm.""",
        "keywords": ["vulnerability", "age", "disability", "social situation", "economic situation"],
    },
    {
        "id": "art_5_1_c",
        "article": "5", "paragraph": "1", "point": "c",
        "title": "Prohibited AI — Social scoring",
        "risk_tier": "prohibited",
        "text": """Article 5(1)(c): AI systems for the evaluation or classification of natural persons or 
        groups of persons over a certain period of time based on their social behaviour or known, inferred 
        or predicted personal or personality characteristics, with the social score leading to either or 
        both of the following: (i) detrimental or unfavourable treatment of certain natural persons or 
        groups thereof in social contexts that are unrelated to the contexts in which the data was 
        originally generated or collected; (ii) detrimental or unfavourable treatment of certain natural 
        persons or groups of persons that is unjustified or disproportionate to their social behaviour.""",
        "keywords": ["social scoring", "social credit", "evaluation", "classification", "natural persons", "behaviour"],
    },
    {
        "id": "art_5_1_d",
        "article": "5", "paragraph": "1", "point": "d",
        "title": "Prohibited AI — Real-time remote biometric identification in public spaces",
        "risk_tier": "prohibited",
        "text": """Article 5(1)(d): AI systems for real-time remote biometric identification of natural persons 
        in publicly accessible spaces for the purpose of law enforcement, unless and in as far as such use 
        is strictly necessary for one of the following objectives: (i) the targeted search for specific 
        potential victims of crime, including missing children; (ii) the prevention of a specific, 
        substantial and imminent threat to the life or physical safety of natural persons or of a 
        terrorist attack; (iii) the detection, localisation, identification or prosecution of a perpetrator 
        or suspect of a criminal offence referred to in Article 2(2) of Council Framework Decision 2002/584/JHA.""",
        "keywords": ["real-time", "biometric", "identification", "public spaces", "law enforcement", "remote"],
    },
    {
        "id": "art_5_1_e",
        "article": "5", "paragraph": "1", "point": "e",
        "title": "Prohibited AI — Emotion recognition in workplace and education",
        "risk_tier": "prohibited",
        "text": """Article 5(1)(e): AI systems for making inferences about the emotions of a natural person 
        in the areas of workplace and education institutions, except where the use of the AI system is 
        intended for medical or safety reasons.""",
        "keywords": ["emotion recognition", "workplace", "education", "emotions", "inferences"],
    },
    {
        "id": "annex_iii_1",
        "article": "AnnexIII", "paragraph": "1", "point": "",
        "title": "High-risk — Biometric systems",
        "risk_tier": "high",
        "text": """Annex III, Category 1: Biometric systems: (a) AI systems intended to be used for the 
        real-time and post-remote biometric identification of natural persons; (b) AI systems intended 
        to be used for biometric categorisation of natural persons according to their biometric data 
        to deduce or infer their race, political opinions, trade union membership, religious or 
        philosophical beliefs, sex life or sexual orientation; (c) AI systems intended to be used for 
        emotion recognition.""",
        "keywords": ["biometric", "facial recognition", "biometric categorization", "emotion recognition", "identification"],
    },
    {
        "id": "annex_iii_4",
        "article": "AnnexIII", "paragraph": "4", "point": "",
        "title": "High-risk — Employment and worker management",
        "risk_tier": "high",
        "text": """Annex III, Category 4: Employment, worker management and access to self-employment: 
        (a) AI systems intended to be used for the recruitment or selection of natural persons, notably 
        for advertising vacancies, screening or filtering applications, evaluating candidates in the 
        course of interviews or tests; (b) AI systems intended to be used for making decisions on 
        promotion and termination of work-related contractual relationships, for task allocation and 
        for monitoring and evaluating performance and behavior of persons in such relationships.""",
        "keywords": ["recruitment", "hiring", "employment", "screening", "HR", "candidate", "performance monitoring"],
    },
    {
        "id": "annex_iii_5",
        "article": "AnnexIII", "paragraph": "5", "point": "",
        "title": "High-risk — Essential private services (credit, insurance)",
        "risk_tier": "high",
        "text": """Annex III, Category 5: Access to and enjoyment of essential private services and 
        essential public services and benefits: (a) AI systems intended to be used by financial 
        institutions subject to Union law in the creditworthiness assessment of natural persons or 
        establish their credit score, with the exception of AI systems put into service by small 
        scale providers for their own use; (b) AI systems intended to be used for risk assessment 
        and pricing in relation to natural persons in the case of life and health insurance.""",
        "keywords": ["credit scoring", "creditworthiness", "insurance", "risk assessment", "financial", "loan"],
    },
    {
        "id": "art_50_1",
        "article": "50", "paragraph": "1", "point": "",
        "title": "Limited-risk — Chatbot transparency",
        "risk_tier": "limited",
        "text": """Article 50(1): Providers shall ensure that AI systems intended to interact directly 
        with natural persons are designed and developed in such a way that the natural persons 
        concerned are informed that they are interacting with an AI system, unless this is obvious 
        from the circumstances and the context of use. This obligation shall not apply where 
        AI systems authorised by law to detect, prevent, investigate and prosecute criminal offences.""",
        "keywords": ["chatbot", "virtual assistant", "disclosure", "interacting with AI", "transparency", "notice"],
    },
    {
        "id": "art_50_4",
        "article": "50", "paragraph": "4", "point": "",
        "title": "Limited-risk — AI-generated content labeling",
        "risk_tier": "limited",
        "text": """Article 50(4): Deployers of an AI system that generates or manipulates image, audio 
        or video content constituting a deep fake, shall disclose that the content has been artificially 
        generated or manipulated. The disclosure obligation shall not apply where the use is authorised 
        by law to detect, prevent, investigate and prosecute criminal offences, or it is necessary 
        for the exercise of the right to freedom of expression and the right to freedom of the arts 
        and sciences guaranteed in the Charter.""",
        "keywords": ["deepfake", "synthetic content", "AI-generated", "labeling", "image", "video", "audio"],
    },
    {
        "id": "art_9_1",
        "article": "9", "paragraph": "1", "point": "",
        "title": "High-risk obligation — Risk management system",
        "risk_tier": "high",
        "text": """Article 9(1): A risk management system shall be established, implemented, documented 
        and maintained in relation to high-risk AI systems. The risk management system shall consist 
        of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, 
        requiring regular systematic review and updating. It shall comprise the following steps: 
        (a) the identification and analysis of the known and reasonably foreseeable risks that the 
        high-risk AI system can pose to health, safety or fundamental rights when the high-risk AI 
        system is used in accordance with its intended purpose.""",
        "keywords": ["risk management", "risk assessment", "lifecycle", "systematic", "fundamental rights"],
    },
    {
        "id": "art_4",
        "article": "4", "paragraph": "", "point": "",
        "title": "All AI — AI literacy",
        "risk_tier": "minimal",
        "text": """Article 4: Providers and deployers of AI systems shall take measures to ensure, 
        to their best extent, a sufficient level of AI literacy of their staff and other persons 
        dealing with the operation and use of AI systems on their behalf, taking into account 
        their technical knowledge, experience, education and training and the context the AI 
        systems are to be used in, and considering the persons or groups of persons on whom 
        the AI systems are to be used.""",
        "keywords": ["AI literacy", "training", "education", "staff", "competency"],
    },
]


def embed_text(text: str) -> list[float]:
    """Get embedding from Gemini text-embedding-004 (768 dimensions, free)."""
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def main():
    print("🚀 Seeding Pinecone with EU AI Act regulations...")

    # Init Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Create index if it doesn't exist
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX not in existing:
        print(f"Creating index '{PINECONE_INDEX}'...")
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=768,  # Gemini text-embedding-004
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        print(f"✅ Index '{PINECONE_INDEX}' created")
    else:
        print(f"✅ Index '{PINECONE_INDEX}' already exists")

    index = pc.Index(PINECONE_INDEX)

    # Embed and upsert each regulation
    vectors = []
    for reg in REGULATIONS:
        print(f"  Embedding {reg['id']}...")
        embedding = embed_text(reg["text"])
        vectors.append({
            "id": reg["id"],
            "values": embedding,
            "metadata": {
                "regulation": "eu_ai_act",
                "article": reg["article"],
                "paragraph": reg.get("paragraph", ""),
                "point": reg.get("point", ""),
                "title": reg["title"],
                "risk_tier": reg["risk_tier"],
                "keywords": reg["keywords"],
                "text": reg["text"][:500],  # Store snippet for retrieval
            },
        })

    # Upsert in batches of 10
    batch_size = 10
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch)
        print(f"  ✅ Upserted batch {i//batch_size + 1}/{(len(vectors)-1)//batch_size + 1}")

    stats = index.describe_index_stats()
    print(f"\n✅ Done! Index '{PINECONE_INDEX}' now has {stats['total_vector_count']} vectors")


if __name__ == "__main__":
    main()
