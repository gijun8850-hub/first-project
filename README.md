# Weekly Body Composition Coach

주 1회 체성분 체크인을 저장하고, 그 숫자를 다음 주 운동 방향으로 번역해주는 정적 웹 앱입니다.

## What it does

- 체중, 골격근량, 체지방률 주간 체크인 저장
- 최근 4주 추이 시각화
- 이번 주 코치 카드와 액션 리스트 제공
- 최근 체크인 히스토리 보기
- `localStorage` 기반 브라우저 저장
- GitHub Pages 정적 배포

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

`main` 브랜치에 push 하면 `.github/workflows/deploy-pages.yml`을 통해 GitHub Pages로 정적 배포됩니다.
