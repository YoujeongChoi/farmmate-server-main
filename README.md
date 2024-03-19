# Farmmate Backend

## 프로젝트 설정 안내

이 문서는 NestJS 기반의 백엔드 프로젝트 설정 방법을 안내합니다.

### 필요 조건

- Node.js (v12 이상)
- PostgreSQL 데이터베이스
- AWS S3 버킷

### 환경 설정

1.  **저장소 클론**
    ```bash
    git clone [저장소 URL]


2. **의존성 설치**: 프로젝트 디렉토리에서 다음 명령어를 실행해주세요.

   ```bash
   npm install
   
3. **환경 변수 설정**:
   `.env` 파일을 프로젝트 루트에 생성하고 필요한 환경 변수를 설정합니다. 예시:
   ```
   DB_TYPE=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=username
    DB_PASSWORD=password
    DB_DATABASE=database_name
    AWS_BUCKET_NAME=your_bucket_name
    AWS_ACCESS_KEY_ID=your_access_key_id
    AWS_SECRET_ACCESS_KEY=your_secret_access_key
    AWS_BUCKET_REGION=your_bucket_region

4. **데이터베이스 마이그레이션** (선택적):
   ```
   npx typeorm migration:run

5. **애플리케이션 실행**:
   ```
   npm run start

## 사용 가능한 API 엔드포인트

### 식물 관리
- 식물 생성: `POST /api/plant`
- 식물 목록 조회: `GET /api/plant`
- 식물 상세 조회: `GET /api/plant/:plantUuid`
- 식물 수정: `PUT /api/plant/:plantUuid`
- 식물 삭제: `DELETE /api/plant/:plantUuid`

### 질병 진단
- 질병 진단 요청: `POST /api/plant/diagnose`
- 진단 결과 저장: `POST /api/plant/diagnose/result`
- 진단 결과 조회: `GET /api/plant/diagnose/result/:plantDiseaseUuid`
- 식물별 진단 결과 조회: `GET /api/plant/diagnose/result/plant/:plantUuid`

### 기기 관리
- 기기 생성: `POST /api/device`
- 기기 삭제: `DELETE /api/device/:deviceId`

### 다이어리
- 다이어리 생성: `POST /api/diary`
- 다이어리 조회: `GET /api/diary/:diaryUuid`
- 다이어리 수정: `PUT /api/diary/:diaryUuid`
- 다이어리 삭제: `DELETE /api/diary/:diaryUuid`

### 파일 관리
- 파일 업로드: `POST /api/files/upload`

## 개발자 정보
- Name: 최유정
- Email: yj91322@gmail.com

## 라이선스



   
