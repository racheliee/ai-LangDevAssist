import google.generativeai as genai
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import os

def load_and_split_document(file_path):
    """문서를 로드하고 텍스트를 분할합니다."""
    loader = PyMuPDFLoader(file_path)
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)
    return splits

def create_vectorstore(splits):
    """문서 스플릿을 사용하여 벡터스토어를 생성합니다."""
    vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
    retriever = vectorstore.as_retriever()
    return retriever

def create_prompt_template():
    """프롬프트 템플릿을 생성합니다."""
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
    return PromptTemplate.from_template(text)

def initialize_rag_chain(retriever, prompt, llm):
    """RAG 체인을 초기화합니다."""
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain

def analyze_audio_file(audio_path):
    """음성 파일을 분석합니다."""
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    file = genai.upload_file(path=audio_path)
    response = model.generate_content(["이 음성의 발음이 어때? 부족한 부분이 있으면 알려주세요.", file])
    return response.text

def generate_rag_feedback(feedback, rag_chain):
    """RAG 체인을 통해 피드백을 생성합니다."""
    RAG_feedback = rag_chain.invoke(feedback)
    return RAG_feedback

def start_analysis():
    '''document_path: RAG문서의 경로
    audio_path: 분석할 음성 파일의 경로
    '''
    document_path = os.path.join(os.path.dirname(__file__), "static/발음교육.pdf")
    audio_path = os.path.join(os.path.dirname(__file__), "static/Test1.m4a")
    
    splits = load_and_split_document(document_path)
    retriever = create_vectorstore(splits)
    prompt = create_prompt_template()
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)
    rag_chain = initialize_rag_chain(retriever, prompt, llm)

    feedback = analyze_audio_file(audio_path)
    RAG_feedback = generate_rag_feedback(feedback, rag_chain)

    #print(f"\n피드백: {feedback}")
    print(f"{RAG_feedback}")

if __name__ == "__main__":
    start_analysis()
