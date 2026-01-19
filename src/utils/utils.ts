import { v7 as uuid, parse as uuidParse } from 'uuid';
import { TsidUtils } from './tsid.utils';
import { endOfDay, startOfDay, toDate } from 'date-fns';

export class Utils {
  /**
   * @deprecated
   * UUID 128비트를 base64url로 바꿔서 22 자리로
   * @returns A short, URL-safe UUID.
   * @example
   * const shortId = Utils.shortUUID();
   * console.log(shortId); // e.g., '3f8b9c2e-4d5f-4c3a-9b2e-1f2d3e4f5a6b' -> 'P4tnLg1NX0Ombi4fLT5PWms'
   */
  static shortUUID() {
    const bytes = uuidParse(uuid()); // Uint8Array(16)
    return Buffer.from(bytes).toString('base64url'); // 22 chars, URL-safe
  }

  /**
   * TSID를 base62로 생성
   * @returns  A short TSID string.
   * @example
   * const shortTsid = Utils.shortTSID();
   * console.log(shortTsid); // e.g., '4f5a6b7c8d9e0f1a2b3c'
   */
  static shortTSID() {
    return TsidUtils.generateBase62();
  }

  /**
   * 빈 값 필터링: undefined, null, 빈 문자열 제거
   * Prisma where 조건에서 빈 값을 제외하고 싶을 때 사용
   * @param data - 필터링할 객체
   * @returns 빈 값이 제거된 객체
   * @example
   * const filtered = Utils.filterEmptyValues({ name: '', email: 'test@test.com' });
   * // { email: 'test@test.com' }
   */
  static filterEmptyValues<T extends Record<string, unknown>>(
    data: T | null | undefined,
  ): Partial<T> {
    if (!data) return {};

    return Object.entries(data).reduce((acc, [key, value]) => {
      // undefined, null, 빈 문자열 제외
      if (value !== undefined && value !== null && value !== '') {
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as Partial<T>);
  }

  /**
   * where 절 날짜 범위 필터 생성
   * @param startDate - start 날짜
   * @param endDate - end 날짜
   * @returns 날짜 범위 필터 객체
   * @example
   * const dateFilter = Utils.createDateRangeFilter(new Date('2023-01-01'), new Date('2023-01-31'));
   * // { gte: 2023-01-01T00:00:00.000Z, lte: 2023-01-31T23:59:59.999Z }
   */
  static createDateRangeFilter(startDate: Date, endDate: Date) {
    return {
      gte: startOfDay(toDate(startDate)),
      lte: endOfDay(toDate(endDate)),
    };
  }
}
