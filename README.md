# 현스 9컷 교육용 만화 제작소 (Hyun's 9-Cut Webtoon Studio)

주제와 대상만 입력하면 **"스토리보드 기획 → 텍스트 수정 → 3×3 인포그래픽 만화 생성 → 텍스트 인라인 수동 편집 → standalone HTML 로컬 다운로드"**를 원스톱으로 지원하는 교육용 웹툰 제작 웹 서비스입니다.

---

## 🌟 주요 기능 및 워크플로우

### 1. 보안 관리자 로그인
- **관리자 ID**: `admin`
- **비밀번호**: `123jesus`
- 세션 기반 인증으로 승인된 사용자만 접근 가능

### 2. [1단계] 주제 & 대상 입력 → AI 9칸 스토리보드 기획
- **입력**: [주제] (예: *교파가 많은 이유?*), [대상 독자] (예: *청소년 및 성도*)
- **스토리 흐름**: `문제 제기 → 원인 → 설명 → 비교 → 핵심 원리 → 결론`
- 9개 패널별 자동 기획:
  1. 패널 제목
  2. 핵심 메시지
  3. 그림으로 보여줄 장면 (Prompt)
  4. 말풍선 대사
  5. 표나 도식 (사도신경 두루마리, 네트워크 다이어그램, 개혁자 카드, 2열 비교표, O/X 대조표, 인용구 등)
  6. 독자가 반드시 기억해야 할 한 문장

### 3. [2단계] 스토리보드 카드 검토 및 텍스트 수정
- 생성된 9개 패널의 각 항목을 자유롭게 직접 수정
- 상단 메인 제목, 부제, 좌우 캐릭터 말풍선 대사 커스터마이징
- [3×3 교육용 만화 생성하기 (진행)] 버튼으로 실시간 조립

### 4. [3단계] 3×3 인포그래픽 만화 캔버스 & 인라인 수동 수정
- 첨부 이미지 레이아웃을 완벽하게 재현한 3×3 그리드 인포그래픽 만화
- **완전한 인라인 수정 기능**: 만화 내부의 모든 텍스트(제목, 부제, 패널 번호/제목, 본문, 말풍선 대사, 비교표 셀 내용, 핵심 결론 등)를 화면에서 클릭하여 직접 타이핑 수정 가능
- 패널별 AI 일러스트 새로고침 지원

### 5. 내보내기 & Neon DB 연동
- **[HTML 다운로드]**: 폰트, CSS 스타일, 말풍선 꼬리표 등이 완벽히 포함된 단일 독립형 `.html` 파일로 로컬 다운로드 (더블 클릭 시 어떤 브라우저에서도 그대로 열림)
- **[PNG 다운로드]**: 고화질 이미지(2x) 저장 지원
- **[Neon DB 저장]**: 작업 중인 만화를 클라우드 데이터베이스에 영구 보관 및 언제든 [내 보관함]에서 다시 불러오기

---

## 🛠️ 기술 스택

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Next.js Serverless Route Handlers
- **Database**: Neon PostgreSQL (`@neondatabase/serverless` / `pg`)
- **Export Engine**: Standalone HTML Generator, `html-to-image`

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 브라우저 접속
# http://localhost:3000
```

---

## ☁️ GitHub & Vercel 배포 가이드

계정: `gaoyuanshanzi@gmail.com`

### 1) GitHub 레포지토리 생성 및 푸시
```bash
git add .
git commit -m "feat: 9-cut educational comic infographic studio with Neon DB"
git branch -M main
git remote add origin https://github.com/gaoyuanshanzi/<repository-name>.git
git push -u origin main
```

### 2) Vercel 배포
1. [Vercel](https://vercel.com)에 `gaoyuanshanzi@gmail.com` 계정으로 로그인합니다.
2. **Add New...** > **Project**를 클릭하고 위 GitHub 레포지토리를 Import합니다.
3. **Environment Variables**에 다음 환경변수를 등록합니다:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_n2hxPXvBUHY9@ep-crimson-shadow-b5s3bki4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - `ADMIN_USER`: `admin`
   - `ADMIN_PASSWORD`: `123jesus`
   - `AUTH_SECRET`: `hyuns-9cut-webtoon-secret-key-2026`
4. **Deploy** 버튼을 누르면 약 1분 내에 전 세계에 무료 배포가 완료됩니다!
