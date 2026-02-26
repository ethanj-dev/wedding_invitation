# 웨딩 청첩장 — Docker + Synology 외부 공유 배포 가이드

## 전체 구조 개요

```
[인터넷 사용자] → https://wedding.yourname.synology.me
       ↓
[공유기 포트포워딩] 443 → NAS:443
       ↓
[Synology 리버스 프록시] → localhost:8080
       ↓
[Docker 컨테이너 (nginx)] → 정적 파일 서빙
```

---

## STEP 1. 로컬 PC에서 React 프로젝트 세팅

### 1-1. 프로젝트 생성

```bash
# 프로젝트 생성
npm create vite@latest wedding-invitation -- --template react
cd wedding-invitation

# Tailwind CSS 설치
npm install -D tailwindcss @tailwindcss/vite
```

### 1-2. Vite 설정 수정

`vite.config.js`를 아래 내용으로 교체:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 1-3. CSS 설정

`src/index.css` 파일 내용을 아래로 교체:

```css
@import "tailwindcss";

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #EBC8C8;
  border-radius: 20px;
}
```

### 1-4. 컴포넌트 배치

1. 제공된 `wedding-invitation.jsx` 파일을 `src/WeddingInvitation.jsx`로 복사
2. `src/App.jsx`를 아래로 교체:

```jsx
import WeddingInvitation from './WeddingInvitation'

function App() {
  return <WeddingInvitation />
}

export default App
```

3. `src/App.css` 파일이 있다면 삭제해도 됨

### 1-5. 로컬 테스트

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속하여 정상 동작 확인.

### 1-6. 프로덕션 빌드

```bash
npm run build
```

`dist/` 폴더가 생성됨. 이 안의 파일들이 실제 배포될 정적 파일.

---

## STEP 2. Docker 이미지 만들기

### 2-1. Nginx 설정 파일 생성

프로젝트 루트에 `nginx.conf` 파일 생성:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 라우팅 지원 (모든 경로 → index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱 (JS, CSS, 이미지)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;
}
```

### 2-2. Dockerfile 생성

프로젝트 루트에 `Dockerfile` 생성:

```dockerfile
# ── Stage 1: Build ──
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Serve ──
FROM nginx:alpine
# 커스텀 nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 빌드 결과물 복사
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2-3. .dockerignore 생성

프로젝트 루트에 `.dockerignore` 파일 생성:

```
node_modules
dist
.git
*.md
```

### 2-4. 이미지 빌드 & 내보내기

```bash
# 이미지 빌드
docker build -t wedding-invitation .

# (선택) 로컬 테스트
docker run -p 8080:80 wedding-invitation
# → http://localhost:8080 에서 확인

# tar 파일로 내보내기
docker save wedding-invitation -o wedding-invitation.tar
```

> **Docker가 로컬에 없는 경우:**
> `dist/` 폴더, `nginx.conf`, `Dockerfile`만 NAS에 업로드해서
> NAS의 Container Manager에서 직접 빌드할 수도 있습니다.
> 이 방법은 STEP 3 에서 '대안' 으로 설명합니다.

---

## STEP 3. Synology NAS에 Docker 컨테이너 올리기

### 3-1. tar 파일 업로드

1. File Station 열기
2. 아무 폴더(예: `/docker/`)에 `wedding-invitation.tar` 업로드

### 3-2. 이미지 가져오기

1. **Container Manager** (구 Docker) 열기
2. 왼쪽 메뉴 → **이미지**
3. **추가** → **파일에서 추가** → `wedding-invitation.tar` 선택
4. 이미지 목록에 `wedding-invitation:latest` 표시 확인

### 3-3. 컨테이너 생성

1. **컨테이너** → **생성**
2. 이미지 선택: `wedding-invitation:latest`
3. 컨테이너 이름: `wedding`
4. **포트 설정**:
   - 로컬 포트: `8080`
   - 컨테이너 포트: `80`
   - 프로토콜: TCP
5. **자동 재시작** 활성화 (NAS 재부팅 시 자동 실행)
6. 나머지는 기본값 → **완료**

### 3-4. 컨테이너 확인

1. 컨테이너 목록에서 `wedding` 이 **실행 중** 상태인지 확인
2. 같은 네트워크에서 `http://NAS내부IP:8080` 접속하여 확인

> **대안: NAS에서 직접 빌드하기**
>
> SSH로 NAS 접속 후:
> ```bash
> cd /volume1/docker/wedding-invitation
> # (여기에 전체 프로젝트 파일이 업로드되어 있어야 함)
> docker build -t wedding-invitation .
> ```
> 이후 Container Manager에서 해당 이미지로 컨테이너 생성.

---

## STEP 4. DDNS 설정 (외부 접속용 도메인)

NAS에 고정 도메인을 부여합니다.

### 4-1. Synology DDNS 등록

1. DSM → **제어판** → **외부 액세스** → **DDNS** 탭
2. **추가** 클릭
3. 설정:
   - 서비스 제공 업체: **Synology**
   - 호스트 이름: 원하는 이름 입력 (예: `mywedding`)
   - 완성 주소: `mywedding.synology.me`
4. **테스트 연결** → 정상 확인 → **확인**

> 다른 DDNS 서비스 (No-IP, DuckDNS 등)도 사용 가능합니다.
> 자체 도메인이 있다면 CNAME 레코드로 연결할 수 있습니다.

---

## STEP 5. SSL 인증서 발급 (HTTPS)

외부 공유 시 HTTPS는 필수입니다.

### 5-1. Let's Encrypt 인증서 발급

1. DSM → **제어판** → **보안** → **인증서** 탭
2. **추가** → **새 인증서 추가** → **Let's Encrypt에서 인증서 얻기**
3. 설정:
   - 도메인 이름: `mywedding.synology.me`
   - 이메일: 본인 이메일
   - 주제 대체 이름: 비워두기
4. **완료**

> ⚠️ 인증서 발급 전에 공유기에서 **80번 포트**가 NAS로 포워딩되어 있어야 합니다.
> (Let's Encrypt 인증 과정에서 80번 포트를 사용)
> 인증서 발급 후 80번 포워딩은 제거해도 됩니다.

### 5-2. 인증서를 기본값으로 설정

1. **인증서** 탭 → 방금 만든 인증서 선택
2. **편집** → **기본 인증서로 설정** 체크

---

## STEP 6. 리버스 프록시 설정

외부에서 `https://mywedding.synology.me` 로 접속하면
내부 Docker 컨테이너 (`localhost:8080`)로 연결합니다.

### 6-1. 리버스 프록시 규칙 추가

1. DSM → **제어판** → **로그인 포털** → **고급** 탭 → **리버스 프록시**
2. **생성** 클릭
3. 설정:

**소스 (외부에서 들어오는 요청):**
| 항목 | 값 |
|------|-----|
| 설명 | Wedding Invitation |
| 프로토콜 | HTTPS |
| 호스트 이름 | mywedding.synology.me |
| 포트 | 443 |
| HSTS 활성화 | 체크 |

**대상 (내부 Docker로 전달):**
| 항목 | 값 |
|------|-----|
| 프로토콜 | HTTP |
| 호스트 이름 | localhost |
| 포트 | 8080 |

4. **확인**

### 6-2. 인증서 연결

1. **제어판** → **보안** → **인증서** → **설정**
2. `Wedding Invitation` 리버스 프록시 항목에 Let's Encrypt 인증서 선택
3. **확인**

---

## STEP 7. 공유기 포트포워딩

집 공유기에서 외부 → NAS로 트래픽을 전달합니다.

### 7-1. 포트포워딩 규칙 추가

공유기 관리 페이지에 접속 (보통 `192.168.0.1` 또는 `192.168.1.1`)

| 항목 | 값 |
|------|-----|
| 외부 포트 | 443 |
| 내부 IP | NAS의 내부 IP (예: 192.168.0.100) |
| 내부 포트 | 443 |
| 프로토콜 | TCP |

> **공유기별 메뉴 위치:**
> - **ipTIME**: 고급 설정 → NAT/라우터 관리 → 포트포워드 설정
> - **KT 공유기**: 장치 설정 → 트래픽 관리 → 포트 포워딩
> - **SKT/LG 공유기**: 고급 설정 → 포트 포워딩

### 7-2. NAS 방화벽 확인

1. DSM → **제어판** → **보안** → **방화벽**
2. 방화벽이 활성화되어 있다면 443 포트 허용 규칙 추가

---

## STEP 8. 최종 확인 & 공유

### 8-1. 접속 테스트

1. **내부 네트워크**: `http://NAS내부IP:8080`
2. **외부 (모바일 데이터 등)**: `https://mywedding.synology.me`

둘 다 청첩장이 정상적으로 표시되면 완료!

### 8-2. 공유 방법

하객에게 공유할 주소:
```
https://mywedding.synology.me
```

카카오톡, 문자 등으로 링크 전송.

> **팁:** 주소가 길다면 bit.ly, vo.la 등 단축 URL 서비스를 사용하세요.

---

## 업데이트 방법

청첩장 내용을 수정하고 싶을 때:

```bash
# 1. 로컬에서 코드 수정 후 다시 빌드
npm run build
docker build -t wedding-invitation .
docker save wedding-invitation -o wedding-invitation.tar

# 2. NAS에 새 tar 업로드

# 3. Container Manager에서:
#    - 기존 컨테이너 중지 & 삭제
#    - 기존 이미지 삭제
#    - 새 tar 이미지 추가
#    - 같은 설정으로 컨테이너 다시 생성
```

---

## 트러블슈팅

| 문제 | 확인 사항 |
|------|----------|
| 내부에서는 보이는데 외부에서 안 됨 | 공유기 포트포워딩 443 확인 |
| HTTPS 접속 시 인증서 경고 | Let's Encrypt 인증서가 리버스 프록시에 연결되었는지 확인 |
| Let's Encrypt 발급 실패 | 포트 80이 NAS로 포워딩되어 있는지 확인 |
| 컨테이너는 실행 중인데 페이지 안 뜸 | `docker logs wedding` 으로 nginx 에러 확인 |
| 페이지 로딩이 느림 | nginx.conf의 gzip, 캐싱 설정 확인 |
| DDNS 주소로 접속 안 됨 | `ping mywedding.synology.me` 로 IP 확인 |

---

## 전체 파일 구조 (최종)

```
wedding-invitation/
├── public/
├── src/
│   ├── App.jsx              ← 엔트리포인트
│   ├── WeddingInvitation.jsx ← 청첩장 메인 컴포넌트
│   ├── index.css            ← Tailwind + 커스텀 스타일
│   └── main.jsx             ← Vite 기본 (수정 불필요)
├── nginx.conf               ← nginx 설정
├── Dockerfile               ← Docker 빌드 설정
├── .dockerignore
├── package.json
├── vite.config.js           ← Vite + Tailwind 설정
└── index.html               ← Vite 기본 (수정 불필요)
```
