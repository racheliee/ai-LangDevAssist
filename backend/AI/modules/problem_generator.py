import re
import requests
from io import BytesIO
from PIL import Image
from langchain_community.utilities.dalle_image_generator import DallEAPIWrapper
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import os

api_key = os.getenv("OPENAI_API_KEY").strip("'")
if not api_key:
  raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")

OpenAI.api_key = api_key
ChatOpenAI.api_key = api_key

def generate_language_diagnosis_question(user_info):
    '''
    user_info를 입력받아, 이를 바탕으로 문제를 생성하는 함수이다.
    return: 
    1. whole_text: 생성된 문제 전체 텍스트(문제와 보기를 포함함)
    2. question: 문제(이를 참고해 이미지를 생성)
    3. answer: 정답(유저가 답하는 문장과 비교함으로써, 문제를 맞췄는지 파악)
    '''
    
    prompt = f"""
    사용자 정보:
    - 연령: {user_info['age']}개월
    - 언어 발달 수준: {user_info['languageLevel']}
    - 주요 언어 목표: {user_info['languageGoals']}
    - 관심 분야: {user_info['interests']}
    - 직전 정답률: {user_info['accuracy']}
    - 부모 피드백: {user_info['feedback']}
    
    API 요청:
    1. 사용자 정보에 기반 언어 발달 장애 조기 진단을 위한 P-FA, PPVT, REEL-R 기반의 언어발달지연 진단 테스트 문항을 1문제 생성해줘

    다음은 예시의 규칙이야
      1. 문법은 꼭지켜줘!
      2. 선택지가 명확해야 돼 (질문의 오답과 정답이 명확해야 돼)
      3. 선택지는 3개로 제한해줘!
      4. 사용자의 연령에 맞게 문제를 이해하기 쉽게 만들어줘.
      5. 관심 분야 쪽으로 문제를 생성해줘!
      6. 문제가 특정상황을 잘 묘사하고 있어야 돼.
      7. 문제속에 답안이 포함되어있으면 안돼.
    
    다음은 우수 대답 예시야. 비슷하게 생성해줘.
      1. 문제 1: 캐릭터가 사과를 들고 있습니다. 사과는 어떤 색이에요?
        - A) 파란색이에요.
        - B) 빨간색이에요.
        - C) 노란색이에요.
        - 정답: B) 빨간색이에요.

      2. 문제 2: 강아지가 뛰어다니고 있어요. 강아지가 어떤 소리를 낼까요?
        - A) 멍멍!
        - B) 야옹!
        - C) 삐약삐약!
        - 정답: A) 멍멍!

      3. 문제 3: 친구들이 공원에서 놀고 있어요. 친구는 어떤 장난감을 가지고 놀까요?
        - A) 공이에요.
        - B) 나무에요.
        - C) 책이에요.
        - 정답: A) 공이에요.
    ...
    """
    
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.6,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
    
    messages = [
        {"role": "system", "content": "You are a friendly and helpful Child Language Development Disorder Therapist."},
        {"role": "user", "content": prompt}
    ]
    
    ai_msg = llm.invoke(messages)
    
    print(ai_msg.content)
    
    question_pattern = re.compile(r'문제 \d+:\s(.*?)\.\s', re.DOTALL)
    answer_pattern = re.compile(r'정답: [A-C]\)\s(.+)')
    
    whole_text = ai_msg.content
    question = question_pattern.findall(ai_msg.content)
    print(question)
    if question:
        question = question[0]
    answer = answer_pattern.findall(ai_msg.content)
    if answer:
        answer = answer[0]
    
    return whole_text, question, answer


def extract_question_with_choices(text):
  pattern = re.compile(r"문제 1:.*?(?=정답)", re.DOTALL)
  match = pattern.search(text)

  if match:
      question_text = match.group().strip()
      print(question_text)
      return question_text
  else:
      print("문제를 찾을 수 없습니다.")
      return None


def generate_image_from_description(description):
    '''
    generate_language_diagnosis_question()의 question을 입력받아, 이를 바탕으로 이미지를 생성하는 함수이다.
    return:
    1. img: 생성된 이미지
    '''
    llm = OpenAI(temperature=0.9)
    prompt = PromptTemplate(
        input_variables=["image_desc"],
        template='''주제:{image_desc}. 주제와 100%일치하는 그림을 만들려고해. 
        이에 해당하는 귀여운이미지 생성프롬프트를 영어로 한줄 만들어줘.
        다음의 예시를 보고 참고해줘.
        예시 : cute Turtles playing in the blue ocean'''
    )
    chain = LLMChain(llm=llm, prompt=prompt)

    image_url = DallEAPIWrapper(size="256x256").run(chain.run(description))
    image_response = requests.get(image_url)
    img = Image.open(BytesIO(image_response.content))
    return img



