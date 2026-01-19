/**
 * LangGraph SSE Client Example (Node.js)
 * 
 * LangGraph 서버의 SSE 스트리밍 엔드포인트를 호출하는 예제입니다.
 * 
 * 실행 방법:
 *   node examples/sse-client.js
 * 
 * 필수 조건:
 *   - LangGraph 서버가 http://127.0.0.1:2024 에서 실행 중이어야 합니다
 *   - langgraph dev 명령으로 서버를 먼저 시작하세요
 */

const http = require('http');

/**
 * LangGraph SSE 스트리밍 요청
 * 
 * @param {Object} options - 요청 옵션
 * @param {string} options.threadId - Thread ID (선택사항)
 * @param {string} options.assistantId - Assistant ID (기본값: 'agent')
 * @param {Array} options.messages - 메시지 배열
 * @param {string} options.streamMode - 스트림 모드 (기본값: 'values')
 */
async function streamLangGraph(options = {}) {
  const {
    threadId = null,
    assistantId = 'agent',
    messages = [],
    streamMode = 'values'
  } = options;

  // URL 구성
  const path = threadId 
    ? `/threads/${threadId}/runs/stream`
    : '/runs/stream';

  // 요청 바디
  const requestBody = JSON.stringify({
    assistant_id: assistantId,
    input: {
      messages: messages
    },
    stream_mode: streamMode,
    config: threadId ? { configurable: { thread_id: threadId } } : {}
  });

  console.log('\n📡 LangGraph SSE 연결 시작...');
  console.log(`🔗 경로: ${path}`);
  console.log(`📝 메시지:`, messages);
  console.log('');

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 2024,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      console.log(`✅ 연결 성공! (상태 코드: ${res.statusCode})\n`);

      let buffer = '';
      let eventCount = 0;

      res.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 마지막 불완전한 줄은 버퍼에 보관

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            // [DONE] 신호 확인
            if (data === '[DONE]') {
              console.log('\n✅ 스트림 완료');
              resolve();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              eventCount++;
              
              console.log(`\n━━━ 이벤트 #${eventCount} ━━━`);
              
              // 이벤트 타입별 처리
              if (parsed.event) {
                console.log(`📌 이벤트: ${parsed.event}`);
              }

              // 메시지 데이터 출력
              if (parsed.messages) {
                console.log('💬 메시지:');
                parsed.messages.forEach((msg, idx) => {
                  console.log(`  [${idx + 1}] ${msg.type}: ${msg.content?.substring(0, 100)}${msg.content?.length > 100 ? '...' : ''}`);
                });
              }

              // 도구 호출 출력
              if (parsed.tool_calls) {
                console.log('🔧 도구 호출:');
                parsed.tool_calls.forEach((tool, idx) => {
                  console.log(`  [${idx + 1}] ${tool.name}(${JSON.stringify(tool.args).substring(0, 50)}...)`);
                });
              }

              // 전체 데이터 (디버깅용)
              if (process.env.DEBUG) {
                console.log('📦 전체 데이터:', JSON.stringify(parsed, null, 2));
              }

            } catch (err) {
              console.error('⚠️  JSON 파싱 실패:', data);
            }
          } else if (line.startsWith('event: ')) {
            console.log(`📡 SSE 이벤트: ${line.slice(7)}`);
          } else if (line.trim() === '') {
            // 빈 줄 무시
          }
        }
      });

      res.on('end', () => {
        console.log(`\n✅ 연결 종료 (총 ${eventCount}개 이벤트 수신)`);
        resolve();
      });

      res.on('error', (err) => {
        console.error('\n❌ 응답 에러:', err.message);
        reject(err);
      });
    });

    req.on('error', (err) => {
      console.error('\n❌ 요청 에러:', err.message);
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * 예제 1: 단순 메시지 전송
 */
async function example1() {
  console.log('═══════════════════════════════════════');
  console.log('예제 1: 단순 메시지 전송');
  console.log('═══════════════════════════════════════');

  await streamLangGraph({
    messages: [
      { role: 'user', content: '안녕하세요! 테스트 메시지입니다.' }
    ]
  });
}

/**
 * 예제 2: Thread ID를 사용한 메시지 전송
 */
async function example2() {
  console.log('\n═══════════════════════════════════════');
  console.log('예제 3: Thread ID 사용');
  console.log('═══════════════════════════════════════');

  const threadId = `test-thread-${Date.now()}`;
  
  await streamLangGraph({
    threadId: threadId,
    messages: [
      { role: 'user', content: 'https://www.google.com 열어줘' }
    ]
  });
}

/**
 * 예제 3: 웹 자동화 요청
 */
async function example3() {
  console.log('\n═══════════════════════════════════════');
  console.log('예제 3: 웹 자동화 요청');
  console.log('═══════════════════════════════════════');

  await streamLangGraph({
    threadId: `automation-${Date.now()}`,
    messages: [
      { 
        role: 'user', 
        content: '네이버(https://www.naver.com)에 접속해서 스크린샷 찍어줘' 
      }
    ]
  });
}

// 메인 실행
async function main() {
  try {
    // 명령줄 인자로 예제 선택
    const exampleNum = '3';//process.argv[2] || '1';

    switch (exampleNum) {
      case '1':
        await example1();
        break;
      case '2':
        await example2();
        break;
      case '3':
        await example3();
        break;
      default:
        console.log('사용법: node sse-client.js [1|2|3]');
        console.log('  1: 단순 메시지 전송');
        console.log('  2: Thread ID 사용');
        console.log('  3: 웹 자동화 요청');
        return;
    }

    console.log('\n✅ 완료!');
  } catch (err) {
    console.error('\n❌ 에러 발생:', err.message);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

// 모듈로 사용할 수 있도록 export
module.exports = { streamLangGraph };
