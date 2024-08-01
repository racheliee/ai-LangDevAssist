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
    response = model.generate_content([f"""기존 스크립트와 비교해서 {accuracy}의 정확도를 가지고 있어요,
                                       뭐라고 말하고 있어요? 또, 이 음성의 발음이 어때요? {user} 기반으로 부족한 부분이 있으면 형식에 따라 쉽고 자세히 알려주세요.
                                       단, 조심해야될 게 있어요.
                                        1. 잘못 발음한 단어를 지적하지 마세요
                                        2. 아이의 말을 존중해 주세요.
                                        3. 정확한 발음을 자주 들려주세요.
                                        4. 뻔한 말은 빼주세요.
                                        5. 이모티콘도 빼주세요.
                                        6. 정확한 발음을 말해서 자연스럽게 틀린걸 알게 되새겨 주세요.
                                       """, file])
    
    feedbacks = response.text

    return feedbacks