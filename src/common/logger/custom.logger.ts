import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(message: unknown, stack?: string, context?: string): void;
  error(message: unknown, ...optionalParams: unknown[]): void;
  error(message: unknown, ...optionalParams: unknown[]): void {
    // if (process.env.ENVIRONMENT === 'production') {
    // 에러 객체인 경우 메시지만 추출
    if (message instanceof Error) {
      super.error(message.message, optionalParams[1] as string);
    } else if (typeof message === 'object' && message !== null) {
      // 200자 이상인 경우 자름
      const errorMsg = JSON.stringify(message);
      if (errorMsg.length > 200) {
        super.error(errorMsg.substring(0, 200) + '...', optionalParams[1] as string);
      } else {
        super.error(errorMsg, optionalParams[1] as string);
      }
    } else {
      super.error(message, optionalParams[0] as string, optionalParams[1] as string);
    }
    // } else {
    // super.error(message, ...optionalParams);
    // }
  }
}
