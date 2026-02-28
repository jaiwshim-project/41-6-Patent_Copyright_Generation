/* ═══════════════════════════════════════════════════════════
   AI-IP Strategy OS — Shared Layout (Navbar + Footer)
   ═══════════════════════════════════════════════════════════ */

(function () {
  /* ─── Active page detection ─── */
  const path = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return path === href ? 'active' : '';
  }

  /* ─── Inject Navbar ─── */
  const navHTML = `
<nav class="navbar" id="mainNav">
  <a href="index.html" class="nav-logo">
    <span style="margin-right:0.35rem">⚡</span>AI-IP Strategy OS
  </a>

  <div class="nav-links" id="navLinks">
    <a href="patent.html"    class="nav-item ${isActive('patent.html')}">
      <span class="nav-icon">⚙️</span><span class="nav-label">특허</span>
    </a>
    <a href="copyright.html" class="nav-item ${isActive('copyright.html')}">
      <span class="nav-icon">©️</span><span class="nav-label">저작권</span>
    </a>
    <a href="dashboard.html" class="nav-item ${isActive('dashboard.html')}">
      <span class="nav-icon">📊</span><span class="nav-label">대시보드</span>
    </a>
    <a href="portfolio.html" class="nav-item ${isActive('portfolio.html')}">
      <span class="nav-icon">🗂️</span><span class="nav-label">포트폴리오</span>
    </a>
    <a href="manual.html"    class="nav-item ${isActive('manual.html')}">
      <span class="nav-icon">📖</span><span class="nav-label">매뉴얼</span>
    </a>

    <div class="nav-divider"></div>
    <div id="apiKeyStatus"></div>
  </div>

  <!-- Mobile hamburger -->
  <button class="nav-hamburger" id="navHamburger" onclick="toggleMobileNav()">
    <span></span><span></span><span></span>
  </button>
</nav>
`;

  /* ─── Inject Footer ─── */
  const year = new Date().getFullYear();
  const footerHTML = `
<footer class="site-footer" id="siteFooter">
  <div class="footer-inner">
    <div class="footer-grid">

      <!-- Brand -->
      <div class="footer-brand">
        <div class="logo-text">⚡ AI-IP Strategy OS</div>
        <p>아이디어를 법적 권리로 변환하는 AI 기반 글로벌 지식재산권 전략 플랫폼.<br>
           특허 출원부터 저작권 등록까지, 전 과정을 자동 고도화합니다.</p>
        <div class="footer-badges">
          <span class="badge badge-blue">Gemini AI</span>
          <span class="badge badge-purple">PSM · RSI</span>
          <span class="badge badge-green">자동 명세서</span>
        </div>
      </div>

      <!-- Platform -->
      <div class="footer-col">
        <h4>플랫폼</h4>
        <a href="index.html">🏠 홈 · 시작하기</a>
        <a href="patent.html">⚙️ 특허 출원 고도화</a>
        <a href="copyright.html">©️ 저작권 등록 고도화</a>
        <a href="dashboard.html">📊 대시보드</a>
        <a href="portfolio.html">🗂️ 포트폴리오 관리</a>
      </div>

      <!-- Features -->
      <div class="footer-col">
        <h4>핵심 기능</h4>
        <span>🔍 선행기술 자동 분석</span>
        <span>📐 PSM 특허 점수화</span>
        <span>💎 RSI 권리 강도 지수</span>
        <span>⚠️ 거절 확률 예측</span>
        <span>📝 명세서 자동 완성</span>
      </div>

      <!-- Help -->
      <div class="footer-col">
        <h4>도움말</h4>
        <a href="manual.html">📖 사용 매뉴얼</a>
        <a onclick="showApiKeyModal()" style="cursor:pointer">🔑 API Key 설정</a>
        <span>📧 문의 · 피드백</span>
        <span>⚖️ 법적 고지</span>
        <span style="color:var(--text-400);font-size:0.75rem;margin-top:0.5rem">v1.0.0 · ${year}</span>
      </div>

    </div><!-- /footer-grid -->

    <div class="footer-bottom">
      <div>© ${year} AI-IP Strategy OS. Powered by <strong style="color:var(--text-200)">Gemini AI</strong>.</div>
      <div style="display:flex;gap:1rem">
        <span>개인정보처리방침</span>
        <span>이용약관</span>
      </div>
    </div>

    <div class="footer-notice">
      ⚠ 본 플랫폼은 AI 기반 참고 자료 생성 서비스입니다. 최종 특허 출원 및 저작권 등록은 전문 변리사 또는 법무사의
      검토를 거친 후 진행하시기를 강력히 권장합니다. AI가 생성한 내용은 법적 조언을 대체하지 않습니다.
    </div>

  </div>
</footer>
`;

  /* ─── Additional navbar + footer styles ─── */
  const extraCSS = `
    /* Nav items */
    .nav-item {
      display: flex; align-items: center; gap: 0.4rem;
      color: #fce7f3; text-decoration: none;
      font-size: 0.83rem; font-weight: 600;
      padding: 0.45rem 0.9rem; border-radius: 8px;
      transition: all 0.2s; white-space: nowrap;
      letter-spacing: 0.01em;
    }
    .nav-item:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
    }
    .nav-item.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 200, 230, 0.4);
    }
    .nav-icon { font-size: 0.9rem; line-height: 1; flex-shrink: 0; }
    .nav-divider {
      width: 1px; height: 18px;
      background: rgba(255, 200, 230, 0.25);
      margin: 0 0.35rem;
    }

    /* Hamburger */
    .nav-hamburger {
      display: none; flex-direction: column; gap: 4px;
      background: none; border: none; cursor: pointer; padding: 6px;
    }
    .nav-hamburger span {
      display: block; width: 22px; height: 2px;
      background: #fce7f3; border-radius: 1px; transition: all 0.2s;
    }

    /* Footer badges row */
    .footer-badges { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
    .footer-badges .badge-blue   { background: rgba(255,255,255,0.12); color: #fce7f3; border-color: rgba(255,200,230,0.3); }
    .footer-badges .badge-purple { background: rgba(255,255,255,0.12); color: #f5d0fe; border-color: rgba(255,200,240,0.3); }
    .footer-badges .badge-green  { background: rgba(255,255,255,0.12); color: #d1fae5; border-color: rgba(200,255,220,0.3); }

    /* Mobile nav */
    @media (max-width: 860px) {
      .nav-hamburger { display: flex; }
      #navLinks {
        display: none;
        position: absolute; top: 100%; left: 0; right: 0;
        background: rgba(157, 23, 77, 0.99);
        backdrop-filter: blur(24px);
        border-bottom: 1px solid rgba(255,160,210,0.2);
        flex-direction: column;
        padding: 1rem 1.5rem;
        gap: 0.25rem;
        z-index: 199;
      }
      #navLinks.open { display: flex; }
      .nav-divider { display: none; }
      #apiKeyStatus { margin-top: 0.5rem; padding: 0.5rem 0; }
      .nav-item { padding: 0.6rem 0.875rem; }
    }
  `;

  /* ─── Mount on DOM ready ─── */
  function mount() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = extraCSS;
    document.head.appendChild(style);

    // Replace existing nav or prepend new nav
    const existingNav = document.querySelector('.navbar');
    const navContainer = document.createElement('div');
    navContainer.innerHTML = navHTML;
    if (existingNav) {
      existingNav.replaceWith(navContainer.firstElementChild);
    } else {
      document.body.prepend(navContainer.firstElementChild);
    }

    // Add footer before </body>
    const existingFooter = document.querySelector('.site-footer');
    if (!existingFooter) {
      const footerContainer = document.createElement('div');
      footerContainer.innerHTML = footerHTML;
      document.body.appendChild(footerContainer.firstElementChild);
    }

    // API key status
    const keyStatus = document.getElementById('apiKeyStatus');
    if (keyStatus) {
      const hasKey = !!localStorage.getItem('gemini_api_key');
      if (hasKey) {
        keyStatus.innerHTML = `<span style="font-size:0.75rem;color:#34d399;display:flex;align-items:center;gap:0.3rem">
          <span style="width:6px;height:6px;background:#34d399;border-radius:50%;display:inline-block"></span>API 연결됨
        </span>`;
      } else {
        keyStatus.innerHTML = `<button onclick="showApiKeyModal()"
          style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);
                 color:#fbbf24;border-radius:6px;padding:0.35rem 0.75rem;
                 font-size:0.75rem;font-weight:700;cursor:pointer;letter-spacing:0.02em">
          🔑 API Key 설정
        </button>`;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* ─── Mobile nav toggle ─── */
  window.toggleMobileNav = function () {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('open');
  };
})();
