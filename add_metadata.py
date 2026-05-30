#!/usr/bin/env python3
"""메타 데이터가 없는 페이지에 메타 데이터를 추가하는 스크립트"""

import os
import json

# 메타 데이터 정의
metadata = {
    "age": {
        "en": {"title": "Age Calculator - Calculate Your Age in Years, Months, Days", "desc": "Free online age calculator. Calculate your exact age in years, months, days, hours, and seconds from your date of birth."},
        "ko": {"title": "나이 계산기 - 나이 계산하기", "desc": "무료 온라인 나이 계산기. 생년월일로 정확한 나이를 계산하세요."},
    },
    "average": {
        "en": {"title": "Average Calculator - Calculate Mean, Median, Mode", "desc": "Free online average calculator. Calculate mean, median, mode, and range for any set of numbers."},
        "ko": {"title": "평균 계산기 - 평균, 중앙값, 최빈값 계산", "desc": "무료 온라인 평균 계산기. 숫자 세트의 평균, 중앙값, 최빈값을 계산하세요."},
    },
    "bmi": {
        "en": {"title": "BMI Calculator - Body Mass Index Calculator", "desc": "Free online BMI calculator. Calculate your Body Mass Index and check your weight status."},
        "ko": {"title": "BMI 계산기 - 체질량지수 계산", "desc": "무료 온라인 BMI 계산기. 체질량지수를 계산하고 체중 상태를 확인하세요."},
    },
    "compound": {
        "en": {"title": "Compound Interest Calculator - Calculate Investment Returns", "desc": "Free online compound interest calculator. Calculate your investment returns with compound interest."},
        "ko": {"title": "복리 계산기 - 투자 수익 계산", "desc": "무료 온라인 복리 계산기. 복리로 투자 수익을 계산하세요."},
    },
    "date": {
        "en": {"title": "Date Calculator - Days Between Dates", "desc": "Free online date calculator. Calculate the number of days between two dates."},
        "ko": {"title": "날짜 계산기 - 날짜 사이 일수 계산", "desc": "무료 온라인 날짜 계산기. 두 날짜 사이의 일수를 계산하세요."},
    },
    "discount": {
        "en": {"title": "Discount Calculator - Calculate Sale Price", "desc": "Free online discount calculator. Calculate the sale price after discount."},
        "ko": {"title": "할인 계산기 - 할인가 계산", "desc": "무료 온라인 할인 계산기. 할인后的 판매가를 계산하세요."},
    },
    "emi": {
        "en": {"title": "EMI Calculator - Loan EMI Calculator", "desc": "Free online EMI calculator. Calculate your loan EMI, total interest, and total payment."},
        "ko": {"title": "EMI 계산기 - 대출 EMI 계산", "desc": "무료 온라인 EMI 계산기. 대출 EMI, 총 이자, 총 상환액을 계산하세요."},
    },
    "investment": {
        "en": {"title": "Investment Calculator - Calculate Investment Returns", "desc": "Free online investment calculator. Calculate your investment returns and future value."},
        "ko": {"title": "투자 계산기 - 투자 수익 계산", "desc": "무료 온라인 투자 계산기. 투자 수익과 미래 가치를 계산하세요."},
    },
    "loan": {
        "en": {"title": "Loan Calculator - Calculate Monthly Payments", "desc": "Free online loan calculator. Calculate monthly payments, total interest, and total cost of loan."},
        "ko": {"title": "대출 계산기 - 월 상환액 계산", "desc": "무료 온라인 대출 계산기. 월 상환액, 총 이자, 총 대출 비용을 계산하세요."},
    },
    "mortgage": {
        "en": {"title": "Mortgage Calculator - Calculate Mortgage Payments", "desc": "Free online mortgage calculator. Calculate monthly mortgage payments and total interest."},
        "ko": {"title": "주택담보대출 계산기 - 월 상환액 계산", "desc": "무료 온라인 주택담보대출 계산기. 월 상환액과 총 이자를 계산하세요."},
    },
    "percent": {
        "en": {"title": "Percentage Calculator - Calculate Percentages", "desc": "Free online percentage calculator. Calculate percentages, percentage change, and more."},
        "ko": {"title": "퍼센트 계산기 - 퍼센트 계산", "desc": "무료 온라인 퍼센트 계산기. 퍼센트, 퍼센트 변화 등을 계산하세요."},
    },
    "salary": {
        "en": {"title": "Salary Calculator - Calculate Hourly, Weekly, Monthly Salary", "desc": "Free online salary calculator. Convert between hourly, weekly, monthly, and annual salary."},
        "ko": {"title": "급여 계산기 - 시급, 주급, 월급 계산", "desc": "무료 온라인 급여 계산기. 시급, 주급, 월급, 연봉을 변환하세요."},
    },
    "tip": {
        "en": {"title": "Tip Calculator - Calculate Restaurant Tips", "desc": "Free online tip calculator. Calculate tips for restaurants and split the bill."},
        "ko": {"title": "팁 계산기 - 레스토랑 팁 계산", "desc": "무료 온라인 팁 계산기. 레스토랑 팁을 계산하고 계산서를 분할하세요."},
    },
}

def generate_metadata_js(tool_name, data):
    """메타 데이터 JS 파일 생성"""
    titles = json.dumps(data.get("en", {}).get("title", ""), ensure_ascii=False)
    descs = json.dumps(data.get("en", {}).get("desc", ""), ensure_ascii=False)
    
    return f'''export default async function generateMetadata({{ params }}) {{
  const {{ locale }} = await params;
  const titles = {{
    en: {json.dumps(data.get("en", {}).get("title", ""), ensure_ascii=False)},
    ko: {json.dumps(data.get("ko", {}).get("title", ""), ensure_ascii=False)},
  }};
  const descs = {{
    en: {json.dumps(data.get("en", {}).get("desc", ""), ensure_ascii=False)},
    ko: {json.dumps(data.get("ko", {}).get("desc", ""), ensure_ascii=False)},
  }};
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {{
    title,
    description,
    openGraph: {{
      title,
      description,
      type: 'website',
      url: `https://oxoxox1.com/${{locale}}/{tool_name}`,
    }},
    alternates: {{
      canonical: `https://oxoxox1.com/${{locale}}/{tool_name}`,
    }},
  }};
}}
'''

# 메타 데이터 파일 생성
for tool_name, data in metadata.items():
    filepath = f"src/app/[locale]/{tool_name}/metadata.js"
    if not os.path.exists(filepath):
        content = generate_metadata_js(tool_name, data)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created: {filepath}")
    else:
        print(f"Already exists: {filepath}")

print("\nDone!")
