import re
import difflib
import google.generativeai as genai
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import os
import base64
import httpx

openai_api_key = os.getenv("OPENAI_API_KEY").strip("'")
google_api_key = os.getenv("GOOGLE_API_KEY").strip("'")
if not openai_api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
if not google_api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

ChatOpenAI.api_key = openai_api_key
genai.configure(api_key=google_api_key)

def accuracy_webtoon(script, audio_path):
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    file = genai.upload_file(path=audio_path, mime_type='audio/m4a')
    response = model.generate_content(['음성을 텍스트로 변환', file])
    user = response.text
    response_storytelling = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a friendly and helpful Korean Child Language Development Disorder Therapist webtoon artists with 15 years of experience."},
            {"role": "user", "content": f"""{script}와 {user}문장이 문맥상으로 얼마나 일치하는지 수치%로만 출력해줘"""}
        ]
    )
    accuracy = response_storytelling.choices[0].message.content

    return accuracy


def feedback_webtoon(script, audio_path):
    accuracy = accuracy_webtoon(script, audio_path)
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    file = genai.upload_file(path=audio_path, mime_type='audio/m4a')
    response = model.generate_content(['음성을 텍스트로 변환', file])
    user = response.text
    response = model.generate_content([f"""
                사용자가 제공한 스크립트: {user},
                원래 스크립트: {script},
                아이에게 잘못된 부분을 지적하고, 올바르게 말하는 방법을 알려주세요. 가능한 한 친절하고 격려하는 방식으로 피드백을 제공해주세요.
                이모티콘은 빼주세요.
                '물론이죠! 아이에게 피드백을 주는 것은 중요한 일이고, 긍정적으로 격려하면서 잘못된 부분을 고칠 수 있도록 돕겠습니다.와 같은 시작 메세지는 빼주세요,
                실제로 얘기해줄 대화 내용만 작성해주세요.
                """, file])
    
    feedbacks = response.text

    return feedbacks
