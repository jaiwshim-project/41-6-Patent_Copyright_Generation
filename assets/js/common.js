// AI-IP Strategy OS - Common Utilities

const GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ─────────────────────────────────────
// Gemini API Call
// ─────────────────────────────────────
async function callGemini(prompt, onStream = null) {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    showApiKeyModal();
    throw new Error('API KEY 없음');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:${onStream ? 'streamGenerateContent' : 'generateContent'}?key=${apiKey}${onStream ? '&alt=sse' : ''}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192
    }
  };

  if (onStream) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API 오류');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
              fullText += text;
              onStream(text, fullText);
            }
          } catch (e) {}
        }
      }
    }
    return fullText;
  } else {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API 오류');
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

// ─────────────────────────────────────
// API Key Modal
// ─────────────────────────────────────
function showApiKeyModal() {
  if (document.getElementById('apiKeyModal')) return;
  const modal = document.createElement('div');
  modal.id = 'apiKeyModal';
  modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;
    display:flex;align-items:center;justify-content:center;
  `;
  modal.innerHTML = `
    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:2rem;max-width:440px;width:90%;">
      <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;">Gemini API Key 설정</h3>
      <p style="color:#94a3b8;font-size:0.875rem;margin-bottom:1.5rem;">
        Google AI Studio에서 발급한 API Key를 입력하세요.<br>
        키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
      </p>
      <input type="password" id="apiKeyInput" placeholder="AIzaSy..."
        style="width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;
               padding:0.75rem 1rem;color:#f1f5f9;font-size:0.95rem;outline:none;margin-bottom:1rem;">
      <div style="display:flex;gap:0.75rem;">
        <button onclick="saveApiKey()"
          style="flex:1;background:#2563eb;color:white;border:none;border-radius:8px;
                 padding:0.75rem;font-weight:600;cursor:pointer;">저장 및 계속</button>
        <button onclick="document.getElementById('apiKeyModal').remove()"
          style="background:transparent;border:1px solid #334155;color:#94a3b8;border-radius:8px;
                 padding:0.75rem 1rem;cursor:pointer;">취소</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (key) {
    localStorage.setItem('gemini_api_key', key);
    document.getElementById('apiKeyModal').remove();
    location.reload();
  }
}

// ─────────────────────────────────────
// Project Data (localStorage)
// ─────────────────────────────────────
function saveProject(data) {
  const existing = getProject() || {};
  const merged = { ...existing, ...data, updatedAt: Date.now() };
  localStorage.setItem('ip_project', JSON.stringify(merged));
  return merged;
}

function getProject() {
  try {
    const raw = localStorage.getItem('ip_project');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearProject() {
  localStorage.removeItem('ip_project');
}

// ─────────────────────────────────────
// PSM Score Calculator
// ─────────────────────────────────────
function calcPSM(scores) {
  // scores: { novelty, inventive, industrial, effect, claims, defense, expansion }
  // each 1~5
  const w = { novelty:0.25, inventive:0.20, industrial:0.10, effect:0.10, claims:0.15, defense:0.10, expansion:0.10 };
  let total = 0;
  for (const [k, weight] of Object.entries(w)) {
    total += ((scores[k] || 0) / 5) * 100 * weight;
  }
  return Math.round(total * 10) / 10;
}

// ─────────────────────────────────────
// RSI Calculator
// ─────────────────────────────────────
function calcRSI(legal, tech, market, circumvention) {
  const rsi = (legal * tech * market) / Math.max(circumvention, 1);
  return Math.round(rsi * 10) / 10;
}

function getRSIGrade(rsi) {
  if (rsi >= 150) return { grade: '전략적 핵심', color: '#2563eb', pct: 95 };
  if (rsi >= 100) return { grade: '강함', color: '#059669', pct: 70 };
  if (rsi >= 50) return { grade: '보통', color: '#d97706', pct: 40 };
  return { grade: '약함', color: '#dc2626', pct: 15 };
}

function getPSMGrade(psm) {
  if (psm >= 80) return { grade: '우수', color: '#059669' };
  if (psm >= 60) return { grade: '양호', color: '#d97706' };
  if (psm >= 40) return { grade: '보통', color: '#f59e0b' };
  return { grade: '미흡', color: '#dc2626' };
}

// ─────────────────────────────────────
// Rejection Probability (simplified ML simulation)
// ─────────────────────────────────────
function calcRejectionProb(similarity, psmScore, claimsCount) {
  // Simplified model based on heuristics
  let prob = 0;
  prob += similarity * 0.4;
  prob += Math.max(0, (70 - psmScore) / 100) * 0.35;
  prob += Math.max(0, (10 - claimsCount) / 50) * 0.25;
  return Math.min(0.95, Math.max(0.05, Math.round(prob * 100) / 100));
}

// ─────────────────────────────────────
// PDF Generation
// ─────────────────────────────────────
function generatePDF(title, content) {
  // Uses browser print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Noto Sans KR', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #111; line-height: 1.8; }
        h1 { font-size: 1.5rem; border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        h2 { font-size: 1.1rem; color: #1e40af; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        h3 { font-size: 1rem; margin-top: 1rem; }
        p { margin-bottom: 0.75rem; }
        .section { margin-bottom: 1.5rem; }
        .meta { color: #666; font-size: 0.875rem; }
        @media print { body { margin: 0; padding: 1rem; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">생성일: ${new Date().toLocaleDateString('ko-KR')} | AI-IP Strategy OS</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:1rem 0">
      <div>${content.replace(/\n/g, '<br>')}</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

// ─────────────────────────────────────
// Toast notification
// ─────────────────────────────────────
function showToast(msg, type = 'info') {
  const colors = { info: '#2563eb', success: '#059669', warning: '#d97706', error: '#dc2626' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:1.5rem;right:1.5rem;z-index:9998;
    background:#1e293b;border-left:3px solid ${colors[type]};
    border-radius:8px;padding:0.75rem 1.25rem;
    font-size:0.875rem;color:#f1f5f9;
    animation:slideIn 0.3s ease;max-width:320px;
    box-shadow:0 4px 24px rgba(0,0,0,0.4);
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─────────────────────────────────────
// Format text for display
// ─────────────────────────────────────
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*)/gm, '<h3 style="font-size:1rem;font-weight:700;margin:1rem 0 0.5rem;color:#60a5fa">$1</h3>')
    .replace(/^# (.*)/gm, '<h2 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 0.5rem;color:#93c5fd">$1</h2>')
    .replace(/^- (.*)/gm, '<li style="margin-left:1rem;margin-bottom:0.25rem">• $1</li>')
    .replace(/\n/g, '<br>');
}

// Check API key on load
window.addEventListener('DOMContentLoaded', () => {
  // Render API key status in navbar if element exists
  const keyStatus = document.getElementById('apiKeyStatus');
  if (keyStatus) {
    const hasKey = !!localStorage.getItem('gemini_api_key');
    keyStatus.innerHTML = hasKey
      ? `<span style="color:#34d399;font-size:0.8rem">● API 연결됨</span>`
      : `<button onclick="showApiKeyModal()" class="btn btn-outline" style="padding:0.3rem 0.75rem;font-size:0.8rem">API Key 설정</button>`;
  }
});
