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
from langchain_core.messages import HumanMessage

openai_api_key = os.getenv("OPENAI_API_KEY").strip("'")
google_api_key = os.getenv("GOOGLE_API_KEY").strip("'")
if not openai_api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")
if not google_api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

ChatOpenAI.api_key = openai_api_key
genai.configure(api_key=google_api_key)

def analyze_audio_and_provide_feedback(audio_path):
    '''
    audio_path를 입력받아, 이를 바탕으로 유저가 선택한 정답과, 발음 피드백을 제공하는 함수이다.
    return:
    1. sentence: 유저가 선택한 정답
    2. feedback: 유저의 발음 피드백
    '''
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    file = genai.upload_file(path=audio_path, mime_type='audio/m4a')
    response = model.generate_content(['''뭐라고 말하고 있어요? 또, 이 음성의 발음이 어때요? 부족한 부분이 있으면 형식에 따라 쉽고 자세히 알려주세요.
                                       (이모티콘 제외)
                                        예시형식 1:
                                        [문장:파랑색이에요, 피드백:'파랑'발음에 대한 피드백]
                                       
                                        예시형식 2:
                                        [문장:삐약삐약, 피드백: '삐약'발음에 대한 피드백]
                                       
                                        예시형식 3:
                                        [문장:걷고있어요, 피드백:'걷고'발음에 대한 피드백]
                                       
                                       ''', file])
    
    feedbacks = response.text
    
    sentence_pattern = re.compile(r"문장:\s*(.*?),\s*피드백:")
    feedback_pattern = re.compile(r"피드백:\s*(.*)]", re.DOTALL)
    
    sentence_match = sentence_pattern.search(feedbacks)
    feedback_match = feedback_pattern.search(feedbacks)
    
    sentence = sentence_match.group(1)
    feedback = feedback_match.group(1)
    
    return sentence, feedback


def create_rag_chain(pdf_path):
    """
    RAG 체인을 생성하는 함수
    """
    loader = PyMuPDFLoader(pdf_path)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)
    vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())

    retriever = vectorstore.as_retriever()

    text = """
    당신은 언어장애를 갖고있는 친구들을 친절하게 상담하는 상담사입니다. 당신의 임무는 이 친구들이 끝까지 낙담하지않고, 발음을 고칠 수 있도록 도와주는 것입니다.

    주어진 문맥(context)을 바탕으로 질문(question)에 답해주세요. 답변할 때는 다음 지침을 따라주세요:
    1. 항상 친절하고 이해하기 쉬운 말로 설명해주세요.
    2. 가능한 한 구체적인 정보를 제공하되, 불필요한 세부사항은 생략하세요.
    3. 어떻게 해야 발음이 좋아질 수 있는지 말해주세요.
    4. 기술적인 용어는 그대로 사용하되, 필요하다면 간단한 설명을 덧붙여주세요.

    기존 피드백에 대해 단계적으로 생각하고, 논리적으로 피드백을 보충해주세요.

    #피드백: 
    {question} 

    #제공된 정보: 
    {context}

    #답변:
    """
    
    prompt = PromptTemplate.from_template(text)
    
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)
    
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain

def is_similar(answer, sentence, threshold=0.8):
    """
    유저가 말한 문장과 정답이 유사한지 확인하는 함수
    return:
    1. True: 정답
    2. False: 오답
    """
    similarity = difflib.SequenceMatcher(None, answer, sentence).ratio()
    return similarity >= threshold

def provide_rag_feedback(rag_chain, feedback):
    '''
    RAG 체인을 이용해 피드백을 보충하는 함수
    '''
    return rag_chain.invoke(feedback)

def generate_vocab_feedback(image_url, answer, sentence):
    """
    사용자가 제공한 답변 및 이미지를 바탕으로 간접적인 피드백을 생성합니다.

    Parameters:
        image_url (str): 이미지 URL
        answer (str): 정답
        sentence (str): 사용자가 제공한 문장

    Returns:
        str: 생성된 피드백
    """
    # 이미지 데이터를 가져와 base64로 인코딩
    response = httpx.get(image_url)
    image_data = base64.b64encode(response.content).decode("utf-8")

    # HumanMessage 생성
    message = HumanMessage(
        content=[
            {"type": "image_url", "image_url": {"url": image_url}},
            {"type": "text", 
             "text": f'''
                        The user was asked to describe an image for {answer}, 
                        but they provided {sentence} as an answer. 
                        Provide feedback indirectly to help them get the right answer, {answer}. 
                        Explain why it's not a {sentence} as indirectly as possible.
                        {answer} should not be mentioned.
                        Exclude information that is not relevant to {answer}.
                        Please answer in Korean.
                      '''}
        ],
    )

    # ChatOpenAI 모델을 초기화하고 피드백 생성
    model = ChatOpenAI(model="gpt-4o")
    vocab_feedback = model.invoke([message]).content

    return vocab_feedback
