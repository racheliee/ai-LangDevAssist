import google.generativeai as genai
import PIL.Image
from pydub import AudioSegment
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 단계 1: 문서 로드(Load Documents)
loader = PyMuPDFLoader(r"C:\Users\wjg\Desktop\sasak\발음교육.pdf")
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
splits = text_splitter.split_documents(docs)
vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
#벡터스토어를 retriever로 변환
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

#ChatGPT 모델 초기화
llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

# RAG 체인 구성
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

audio=r'C:\Users\wjg\Desktop\sasak\Test1.m4a'
file = genai.upload_file(path=audio)
response = model.generate_content(["이 음성의 발음이 어때? 부족한 부분이 있으면 알려주세요.", file])

feedback = response.text
RAG_feedback= rag_chain.invoke(feedback)

print(f"\n피드백: {feedback}")
print(f"RAG피드백: {RAG_feedback}")