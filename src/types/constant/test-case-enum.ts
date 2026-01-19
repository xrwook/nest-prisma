/**
 * 테스트 케이스 상태 Enum
 * PENDING: 대기, IN_PROGRESS: 진행중, COMPLETED: 완료, FAILED: 실패, ERROR: 에러
 */
export const testCaseStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
} as const;

export type TestCaseStatus = (typeof testCaseStatus)[keyof typeof testCaseStatus];

/**
 * 스텝 케이스 상태 Enum
 * OK: 성공, ERROR: 실패, NONE: 미실행
 */
export const stepCaseStatus = {
  OK: 'OK', // 성공
  ERROR: 'ERROR', // 실패
  NONE: 'NONE', // 미실행
} as const;

export type StepCaseStatus = (typeof stepCaseStatus)[keyof typeof stepCaseStatus];

/**
 * 뷰포트 타입 Enum
 * width x height
 * 1: 1280x720, 2: 1920x1080, 3: 2560x1440, 4: 3840x2160
 */
export const viewPortType = {
  '1': { width: 1280, height: 720 },
  '2': { width: 1920, height: 1080 },
  '3': { width: 2560, height: 1440 },
  '4': { width: 3840, height: 2160 },
} as const;
export type ViewPortType = (typeof viewPortType)[keyof typeof viewPortType];
export type ViewPortKeyType = keyof typeof viewPortType;

/**
 * 테스트 케이스 생성 저장 Enum
 * MANUAL: 수동 생성, AI_GENERATED: AI 생성
 */
export const testCaseFrom = {
  MANUAL: 'MANUAL',
  AI_GENERATED: 'AI_GENERATED',
} as const;
export type TestCaseFrom = (typeof testCaseFrom)[keyof typeof testCaseFrom];
