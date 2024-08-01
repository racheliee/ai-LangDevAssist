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

def generate_webtoon_script(user_info):
    '''
    user_info를 입력받아, 이를 바탕으로 스토리를 생성하는 함수이다.
    return: 
        scripts (동화 생성 스크립트)
    '''
    
    prompt_storytelling = f"""
      사용자 정보:
      - 연령: {user_info['age']}개월
      - 언어 발달 수준: {user_info['languageLevel']}
      - 관심 분야: {user_info['interests']}
      - 직전 정답률: {user_info['accuracy']}
      - 부모 피드백: {user_info['feedback']}

      
      API 요청:
      1. Creating stories for early diagnosis of language development disorders based on user information.
      2. After listening to the story, look at the picture and replay the story for therapeutic purposes.
      3. After creating the story, you need to create a 4-cut webtoon.
      4. 다음은 이야기 예시야:
        **이야기 제목: 소피와 작은 새**
    
        옛날에 작은 마을에 소피라는 친구가 살고 있었어요. 
    
        소피는 만화를 아주 좋아했어요. 
    
        소피는 항상 만화 속 작은 새들을 보며 행복해 했어요.
    
        어느 날, 소피는 마당에서 놀다가 아주 귀여운 작은 새를 발견했어요. 
        
        이정도 길이로 작성해줘.
      5. 4컷 웹툰 설계는 적지 말아줘.
      6. 고유명사도 적지 말아줘 ex) 주인공 이름, 동물 사물 이름
      7. 치료 발달 팁도 적지 말아줘!
    """
    
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

    messages=[
        {"role": "system", "content": "You are a friendly and helpful Korean Child Language Development Disorder Therapist webtoon artists with 15 years of experience."},
        {"role": "user", "content": prompt_storytelling}
    ]
    
    msg = llm.invoke(messages)
    scripts = msg.choices[0].message.content
  
    return scripts

def generate_webtoon(scripts):
    '''
    generate_webtoon의 scripts을 입력받아, 이를 바탕으로 웹툰을 생성하는 함수이다.
    return:
    1. img: 생성된 웹툰, 6컷
    '''
    prompt_webtoon = scripts + "무조건 4컷의 이미지만 있어야 하고, 이미지 안에 어느 텍스트도 없어야해." 
    # 이미지 생성 및 다운로드(DALL-E사용)
    response_webtoon = openai.Image.create(
        prompt= prompt_webtoon,
        model="dall-e-3",
        n=1,
        size="1792x1024"
    )
    image_url = response_webtoon['data'][0]['url']
    image_response = requests.get(image_url)
    img = Image.open(BytesIO(image_response.content))
    
    return img
