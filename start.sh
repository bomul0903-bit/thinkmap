#!/bin/bash
# 퍼플에그 홈페이지 실행 스크립트

echo "🥚 퍼플에그 홈페이지를 시작합니다..."
echo ""

# 백엔드 시작
echo "⚙️  백엔드 서버를 시작합니다 (포트 8000)..."
cd backend
pip install -r requirements.txt -q
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "   .env 파일이 생성되었습니다. 이메일 설정을 완료해주세요."
fi
python main.py &
BACKEND_PID=$!
cd ..

echo "   백엔드 PID: $BACKEND_PID"
sleep 2

# 프론트엔드 시작
echo ""
echo "🎨  프론트엔드 서버를 시작합니다 (포트 3000)..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅  서버가 시작되었습니다!"
echo ""
echo "   🌐 홈페이지:       http://localhost:3000"
echo "   🔧 관리자 페이지:  http://localhost:3000/admin"
echo "   📡 API 문서:       http://localhost:8000/docs"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."

# 종료 시 프로세스 정리
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '서버가 종료되었습니다.'" EXIT

wait
