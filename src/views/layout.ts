export const CDN = {
  tailwind: 'https://cdn.tailwindcss.com',
  fa: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
  chartjs: 'https://cdn.jsdelivr.net/npm/chart.js',
  axios: 'https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js',
  fonts: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap',
}

export function layout(title: string, body: string, extraHead = ''): string {
  return /* html */`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | CosmoFactory MES</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${CDN.fonts}" rel="stylesheet">
  <link href="${CDN.fa}" rel="stylesheet">
  <script src="${CDN.tailwind}"></script>
  <script src="${CDN.chartjs}"></script>
  <script src="${CDN.axios}"></script>
  ${extraHead}
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; }
    .pulse-dot { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fade-in { animation: fadeIn .4s ease-out; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #1e293b; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">

  <!-- ── 사이드바 ── -->
  <div class="flex h-screen overflow-hidden">
    <aside class="w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
      <div class="p-4 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-industry text-white text-sm"></i>
          </div>
          <div>
            <div class="font-bold text-white text-sm">CosmoFactory</div>
            <div class="text-xs text-slate-400">MES v2.0 · D1 연동</div>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <a href="/" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-gauge-high w-4 text-center"></i> 통합 대시보드
        </a>
        <a href="/factory" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-map-location-dot w-4 text-center"></i> 공장 레이아웃
        </a>
        <a href="/robots" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-robot w-4 text-center"></i> 로봇 현황
        </a>
        <a href="/production" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-chart-line w-4 text-center"></i> 생산 모니터링
        </a>
        <a href="/orders" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-clipboard-list w-4 text-center"></i> MES 주문 관리
        </a>
        <div class="border-t border-slate-700 my-2"></div>
        <a href="/plc/mixing" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-flask w-4 text-center text-cyan-400"></i>
          <span class="text-cyan-400">PLC 원료 혼합</span>
        </a>
        <a href="/plc/filling" class="nav-link flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm">
          <i class="fas fa-fill-drip w-4 text-center text-cyan-400"></i>
          <span class="text-cyan-400">PLC 충진 라인</span>
        </a>
      </nav>
      <div class="p-3 border-t border-slate-700">
        <div class="text-xs text-slate-500">
          <div id="sidebar-clock" class="font-mono text-slate-400"></div>
          <div>Cloudflare D1 · Workers</div>
        </div>
      </div>
    </aside>

    <!-- ── 메인 콘텐츠 ── -->
    <main class="flex-1 overflow-y-auto bg-slate-900">
      <div class="p-6 fade-in">
        ${body}
      </div>
    </main>
  </div>

  <script>
    // 사이드바 시계
    function updateClock(){
      const el=document.getElementById('sidebar-clock')
      if(el) el.textContent=new Date().toLocaleString('ko-KR',{hour12:false})
    }
    updateClock(); setInterval(updateClock, 1000)

    // 현재 페이지 nav 하이라이트
    const cur = location.pathname
    document.querySelectorAll('.nav-link').forEach(a=>{
      if(a.getAttribute('href')===cur) {
        a.classList.add('bg-slate-700','text-white')
        a.classList.remove('text-slate-300')
      }
    })
  </script>
</body>
</html>`
}

export function errorPage(msg: string): string {
  return layout('오류', `
    <div class="flex flex-col items-center justify-center h-64 gap-4">
      <i class="fas fa-triangle-exclamation text-5xl text-yellow-500"></i>
      <h2 class="text-xl font-bold text-white">오류가 발생했습니다</h2>
      <p class="text-slate-400">${msg}</p>
      <a href="/" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">대시보드로</a>
    </div>
  `)
}
