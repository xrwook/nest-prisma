import { Injectable } from '@nestjs/common';
import { TSID } from 'tsid-ts';

@Injectable()
export class TsidUtils {
  // Base62 문자셋 (0-9, A-Z, a-z)
  private static readonly BASE62_CHARS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  // Base36 문자셋 (0-9, a-z) - 대소문자 구분 없음
  private static readonly BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

  // TSID 생성 (숫자 문자열)
  static generate(): string {
    return TSID.create().toString();
    // 예시 출력: "288230376151711744" (18-19자리)
  }

  // TSID 생성 후 Base62로 인코딩 (추천)
  static generateBase62(): string {
    const id = BigInt(TSID.create().toBigInt());
    return this.encodeBase62(id);
    // 예시 출력: "3n2Kx8pQrS" (11자리)
  }

  // TSID 생성 후 Base36으로 인코딩
  static generateBase36(): string {
    const id = BigInt(TSID.create().toBigInt());
    return this.encodeBase36(id);
    // 예시 출력: "3xk5m8n2pq7" (13자리)
  }

  // BigInt를 Base62로 인코딩
  private static encodeBase62(num: bigint): string {
    if (num === 0n) return '0';

    let result = '';
    const base = BigInt(this.BASE62_CHARS.length);

    while (num > 0n) {
      const remainder = Number(num % base);
      result = this.BASE62_CHARS[remainder] + result;
      num = num / base;
    }

    return result;
  }

  // Base62를 BigInt로 디코딩
  private static decodeBase62(str: string): bigint {
    let result = 0n;
    const base = BigInt(this.BASE62_CHARS.length);

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = BigInt(this.BASE62_CHARS.indexOf(char));
      result = result * base + value;
    }

    return result;
  }

  // BigInt를 Base36으로 인코딩
  private static encodeBase36(num: bigint): string {
    if (num === 0n) return '0';

    let result = '';
    const base = BigInt(this.BASE36_CHARS.length);

    while (num > 0n) {
      const remainder = Number(num % base);
      result = this.BASE36_CHARS[remainder] + result;
      num = num / base;
    }

    return result;
  }

  // Base36을 BigInt로 디코딩
  private static decodeBase36(str: string): bigint {
    let result = 0n;
    const base = BigInt(this.BASE36_CHARS.length);

    for (let i = 0; i < str.length; i++) {
      const char = str[i].toLowerCase();
      const value = BigInt(this.BASE36_CHARS.indexOf(char));
      result = result * base + value;
    }

    return result;
  }

  // Base62 ID를 원래 숫자로 복원
  static decodeToNumber(base62Id: string): string {
    return this.decodeBase62(base62Id).toString();
  }

  // TSID를 타임스탬프로 변환
  static getTimestamp(id: string): Date {
    const bigIntId = BigInt(id);
    const timestamp = Number(bigIntId >> 22n) + 1640995200000;
    return new Date(timestamp);
  }

  // TSID 예제 생성 및 출력
  // static demonstrateTsid() {
  //   console.log('\n=== TSID 길이 비교 ===');

  //   for (let i = 0; i < 3; i++) {
  //     const numeric = this.generate();
  //     const base62 = this.generateBase62();
  //     const base36 = this.generateBase36();

  //     console.log(`\n[${i + 1}번째 ID]`);
  //     console.log(`숫자형 (19자): ${numeric}`);
  //     console.log(`Base62 (11자): ${base62}`);
  //     console.log(`Base36 (13자): ${base36}`);

  //     // 복원 테스트
  //     const decoded = this.decodeToNumber(base62);
  //     console.log(`복원 확인: ${decoded === numeric ? '✓' : '✗'}`);
  //   }

  //   console.log('\n=== 길이 요약 ===');
  //   console.log('UUID:   36자 (550e8400-e29b-41d4-a716-446655440000)');
  //   console.log('TSID:   19자 (288230376151711744)');
  //   console.log('Base36: 13자 (3xk5m8n2pq7)');
  //   console.log('Base62: 11자 (3n2Kx8pQrS) ⭐ 추천');
  // }
}
