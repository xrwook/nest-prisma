import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { TsidUtils } from './tsid.utils';

/**
 * 파일 저장 관련 유틸리티
 */
export class FileUtil {
  /**
   * 기본 업로드 디렉터리
   */
  private static readonly DEFAULT_UPLOAD_DIR = 'files';

  /**
   * 디렉터리가 존재하지 않으면 생성
   */
  private static ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 고유한 파일명 생성
   */
  static generateUniqueFilename(): string {
    const timestamp = Date.now();
    const tsid = TsidUtils.generateBase62();

    return `${timestamp}_${tsid}`;
  }

  /**
   * 버퍼를 파일로 저장
   */
  static saveFile(
    buffer: Buffer,
    filename: string,
    directory: string = this.DEFAULT_UPLOAD_DIR,
  ): { filePath: string; fileName: string } {
    const uploadDir = join(directory);
    this.ensureDirectoryExists(uploadDir);

    const filePath = join(uploadDir, filename);
    writeFileSync(filePath, buffer);

    return {
      filePath,
      fileName: filename,
    };
  }

  /**
   * 파일 읽기
   */
  static readFile(filePath: string): Buffer {
    if (!existsSync(filePath)) {
      throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
    }

    return readFileSync(filePath);
  }

  /**
   * 파일 존재 여부 확인
   */
  static fileExists(filePath: string): boolean {
    return existsSync(filePath);
  }

  /**
   * 업로드 디렉터리 경로 생성
   */
  static getUploadPath(
    filename: string,
    directory: string = this.DEFAULT_UPLOAD_DIR,
  ): string {
    return join(directory, filename);
  }

  /**
   * 파일 버퍼 가져오기
   */
  static getFileBuffer(directory: string, filename: string): Buffer {
    const filePath = join(directory, filename);
    if (!existsSync(filePath)) {
      throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
    }
    return readFileSync(filePath);
  }

  /**
   * baseDirectory디렉토리 밑에 년 / 월 / 일 디렉터리 경로 생성
   * @param baseDirectory
   * @returns
   */
  static createDatedDirectory(baseDirectory: string): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const datedDir = join(baseDirectory, year, month, day);
    FileUtil.ensureDirectoryExists(datedDir);

    return datedDir;
  }

  /**
   * 파일 삭제
   */
  static deleteFile(filePath: string): void {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  /**
   * buffer에서 File 객체 생성
   */
  static bufferToFile(buffer: Buffer, originalName: string): Express.Multer.File {
    return {
      fieldname: 'file',
      originalname: originalName,
      encoding: '7bit',
      mimetype: 'application/octet-stream',
      size: buffer.length,
      buffer: buffer,
    } as Express.Multer.File;
  }
}
