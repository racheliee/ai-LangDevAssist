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
        옛날부터 인디언들에게는 말이 무척 중요한 동물이었습니다.
        작은 냇가에 살고 있는 꼬마 인디언의 아빠, 엄마, 누나, 형도 역시 자신의 말을 갖고 있었습니다. 
        그래서 꼬마 인디언의 가장 큰 소망도 말을 한 마리 갖는 것이었습니다. 
        어느 날, 아침을 먹을 때 아빠가 말하였습니다. 
        "돌판에 말 한 마리가 누워있는 것처럼 보이더구나." 
        꼬마 인디언은 아침을 먹은 후 말이 있는지 알고 싶어 점을 나섰습니다. 
        꼬마 인디언은 운동하 안 마가렛 꽃으로 뒤덮인 돌판까지 걸어갔습니다. 
        바로 그 곳의 한 가운데에는 정말로 커다란 흰말이 누워있었습니다. 
        꼬마 인디언은 말에게 다가가 말의 주둥이를 부드럽게 쓰다듬어 주었습니다. 
        꼬마 인디언은 토끼몰을 닮아 말에게 주었습니다. 
        밤이 가까워서 꼬마 인디언은 집으로 돌아왔습니다. 
        밤이 되었고, 식구들 모두가 잠이 들었지만, 꼬마 인디언은 잠을 이룰 수가 없었습니다. 
        해가 지고, 말이 뜨면 날씨가 추워졌습니다. 꼬마 인디언은 어둠 속에서 말이 혼자 누워 고생을 하고 있을지 모른다는 생각이 들자 몹시 걱정되었습니다. 
        꼬마 인디언은 일어나 자기가 덮고 있던 따뜻한 양털 이불을 들고 친밀을 빼서 나왔습니다. 
        꼬마 인디언은 걸어 나갔습니다. 그렇지만 흰말을 생각하며 발길을 계속해서 나갔습니다. 
        꼬마 인디언은 말을 발견하자 곧가가 말의 주둥이를 어루만졌습니다. 
        말은 덜고 있었습니다. 꼬마 인디언은 말에게 자기 이름을 덮어주며 그 속에 들어가 말과 함께 잠이 들었습니다.

      이정도 길이로 한국어로 만들어줘.
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
    
    scripts = llm.invoke(messages)
          
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
