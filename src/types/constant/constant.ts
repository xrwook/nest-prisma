// 상수들
export const front = 'front-end';
export const runner = 'runner-engine';

// 날짜 포맷 상수
export const DATE_FORMATS = {
  FULL_DATETIME: 'yyyy-MM-dd HH:mm:ss',
  KOREAN_DATETIME: 'yyyy년 MM월 dd일 HH:mm:ss',
  ISO_STRING: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss',
} as const;

// 파일 path 관련 상수
export const FILE_PATHS = {
  VIDEO: 'files/video',
  SPEC_FILE: 'files/specFile',
  RAG: 'files/rag',
} as const;
