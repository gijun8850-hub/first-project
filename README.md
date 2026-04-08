# Yakitei Kiosk

`야키테이` 야끼소바 가게를 위한 시연용 키오스크 웹앱입니다.

## What it does

- `매장 식사` / `포장` 주문 시작
- 사진 중심 메뉴보드
- 야끼소바 2종 + 음료 4종 주문
- 토핑 선택과 실시간 인기 조합 추천
- 장바구니에서 `+ / - / 삭제` 조작
- 결제 후 추천 조합 순위 즉시 갱신
- GitHub Pages 배포용 정적 export

## Menu

- 기본 야끼소바 (데리야끼) - 11,000원
- 소금 야끼소바 - 11,000원
- 콜라 - 2,000원
- 사이다 - 2,000원
- 생맥주 - 5,000원
- 하이볼 - 7,000원

## Toppings

- 오징어새우 - 1,500원
- 비엔나 - 1,500원
- 면 추가 - 1,000원
- 계란 프라이 추가 - 1,000원
- 치즈 추가 - 1,000원

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test

```bash
npm test
npm run build
```

## Deploy

`main` 브랜치에 push 하면 `.github/workflows/deploy-pages.yml` 이 GitHub Pages용 정적 사이트를 배포하도록 설정되어 있습니다.
