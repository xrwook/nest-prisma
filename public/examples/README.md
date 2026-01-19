# LangGraph SSE Client Examples

LangGraph 서버의 SSE(Server-Sent Events) 스트리밍 API를 호출하는 예제들입니다.

## 사전 준비

### 1. LangGraph 서버 시작

```bash
# 프로젝트 루트에서 실행
cd /Users/wookhuh/Desktop/project/jaebau/mcp
langgraph dev
```

서버가 `http://127.0.0.1:2024`에서 실행되어야 합니다.

### 2. Node.js 설치 확인

```bash
node --version  # v14 이상 권장
```

## 예제 실행

### 예제 1: 단순 메시지 전송

```bash
node examples/sse-client.js 1
```

간단한 메시지를 전송하고 응답을 스트리밍으로 받습니다.

### 예제 2: Thread ID 사용

```bash
node examples/sse-client.js 2
```

Thread ID를 지정하여 세션을 관리하며 메시지를 전송합니다.

### 예제 3: 웹 자동화 요청

```bash
node examples/sse-client.js 3
```

웹 페이지를 열고 스크린샷을 찍는 자동화 작업을 요청합니다.

## 디버그 모드

전체 JSON 데이터를 보려면 DEBUG 환경 변수를 설정하세요:

```bash
DEBUG=1 node examples/sse-client.js 1
```

## API 엔드포인트

### 1. Thread 없이 실행

```
POST http://127.0.0.1:2024/runs/stream
```

**요청 바디:**
```json
{
  "assistant_id": "agent",
  "input": {
    "messages": [
      {"role": "user", "content": "안녕하세요"}
    ]
  },
  "stream_mode": "values"
}
```

### 2. Thread ID로 실행

```
POST http://127.0.0.1:2024/threads/{thread_id}/runs/stream
```

**요청 바디:**
```json
{
  "assistant_id": "agent",
  "input": {
    "messages": [
      {"role": "user", "content": "안녕하세요"}
    ]
  },
  "stream_mode": "values",
  "config": {
    "configurable": {
      "thread_id": "your-thread-id"
    }
  }
}
```

## 응답 형식

SSE 스트림은 다음 형식으로 데이터를 전송합니다:

```
data: {"event": "on_chain_start", ...}

data: {"messages": [...], ...}

data: {"event": "on_tool_start", "name": "open_url", ...}

data: {"event": "on_tool_end", "output": "...", ...}

data: [DONE]
```

## 주요 파라미터

- **assistant_id**: 그래프 이름 (기본값: `"agent"`)
- **stream_mode**: 스트리밍 모드
  - `"values"`: 전체 상태 값
  - `"updates"`: 업데이트만
  - `"messages"`: 메시지만
  - `"events"`: 이벤트만
- **thread_id**: 세션 식별자 (선택사항)

## 문제 해결

### 연결 실패 (ECONNREFUSED)

LangGraph 서버가 실행 중인지 확인하세요:

```bash
curl http://127.0.0.1:2024/ok
```

응답: `{"ok":true}`

### 405 Method Not Allowed

POST 메서드를 사용하고 있는지 확인하세요. EventSource는 GET만 지원하므로 사용할 수 없습니다.

### JSON 파싱 에러

스트림 데이터가 불완전할 수 있습니다. 버퍼링 로직이 올바르게 구현되어 있는지 확인하세요.

## 참고 자료

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Server-Sent Events (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
