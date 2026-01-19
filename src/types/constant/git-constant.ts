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

// GitLab 관련 상수
export const GITLAB_MESSAGES = {
  TOKEN_NOT_FOUND: 'GitLab token not found. GitLab integration disabled.',
  SERVICE_INITIALIZED: 'GitLab service initialized successfully',
  CLIENT_NOT_INITIALIZED:
    'GitLab client is not initialized. Please check GITLAB_TOKEN environment variable.',
  CLIENT_NOT_INITIALIZED_SHORT: 'GitLab client is not initialized.',
  ISSUE_CREATED_SUCCESS: 'GitLab issue created successfully',
  ISSUE_CREATE_FAILED: 'Failed to create GitLab issue',
  PROJECTS_LIST_FAILED: 'Failed to list GitLab projects',
} as const;

export const GITLAB_LABELS = {
  BUG: 'bug',
  TEST_FAILURE: 'test-failure',
  AUTO_GENERATED: 'auto-generated',
} as const;
