// 파일 업로드 body
export const filesBody = {
  description: 'File upload',
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
} as const;

// 파일 단건 업로드 body
export const fileBody = {
  description: 'File upload',
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
} as const;

// 인증실패
export const authFailureResponse = {
  status: 401,
  description: '인증실패',
} as const;
