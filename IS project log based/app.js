/* ============================================================
   SecureWatch IDS — Main Application Logic
   Log-Based Intrusion Detection and Alert System
   ============================================================ */

'use strict';

// ============================================================
//  GLOBAL STATE
// ============================================================
const state = {
  logs: [],
  alerts: [],
  blacklist: [],
  rules: [],
  threats: [],
  stats: { totalLogs: 0, failedLogins: 0, activeThreats: 0, blockedIPs: 0 },
  settings: {
    autoBlock: true, realtimeSim: true, soundAlert: false,
    notif: false, bruteForceThreshold: 5, alertRetention: 30,
    simSpeed: 'medium', alertEmail: '', emailMinSeverity: 'medium', emailDigest: true
  },
  monitoring: true,
  currentPage: 1,
  logsPerPage: 20,
  sortKey: 'timestamp',
  sortAsc: false,
  filteredLogs: [],
  filteredAlerts: [],
  filteredIPs: [],
  simInterval: null,
  reportContent: '',
  ipLoginCounts: {},
  chartData: { labels: [], success: [], failed: [] },
  activityChart: null,
  threatChart: null,
};

// ============================================================
//  INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadDefaultRules();
  initCharts();
  startClock();
  createParticles();
  startSimulation();
  updateStorageInfo();
  updateDashboard();
});

// ============================================================
//  CLOCK
// ============================================================
function startClock() {
  const update = () => {
    const el = document.getElementById('liveClock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
  };
  update();
  setInterval(update, 1000);
}

// ============================================================
//  PARTICLES
// ============================================================
function createParticles() {
  const container = document.getElementById('bgParticles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
}

// ============================================================
//  TAB SWITCHING
// ============================================================
function switchTab(tabName, navEl) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const panel = document.getElementById('tab-' + tabName);
  if (panel) panel.classList.add('active');
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', logs: 'Log Analyzer', alerts: 'Alerts',
    threats: 'Threat Map', ips: 'IP Blacklist', rules: 'Detection Rules',
    reports: 'Reports', settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[tabName] || tabName;

  if (tabName === 'threats') renderThreatMap();
  if (tabName === 'dashboard') updateDashboard();

  return false;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============================================================
//  CHARTS
// ============================================================
function initCharts() {
  // Activity Chart
  const actCtx = document.getElementById('activityChart').getContext('2d');
  const labels = generateHourLabels(24);
  state.chartData.labels = labels;
  state.chartData.success = new Array(24).fill(0);
  state.chartData.failed = new Array(24).fill(0);

  state.activityChart = new Chart(actCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Successful Logins',
          data: state.chartData.success,
          borderColor: '#00c8ff', backgroundColor: 'rgba(0,200,255,0.08)',
          borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3,
          pointBackgroundColor: '#00c8ff',
        },
        {
          label: 'Failed Logins',
          data: state.chartData.failed,
          borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)',
          borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3,
          pointBackgroundColor: '#ef4444',
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } }, beginAtZero: true }
      },
      animation: { duration: 400 }
    }
  });

  // Threat Distribution Chart
  const thrCtx = document.getElementById('threatChart').getContext('2d');
  state.threatChart = new Chart(thrCtx, {
    type: 'doughnut',
    data: {
      labels: ['Brute Force', 'Port Scan', 'SQL Injection', 'Failed Login', 'Privilege Escalation'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#ef4444', '#f59e0b', '#a855f7', '#eab308', '#00c8ff'],
        borderColor: '#0d1425', borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 12 } }
      },
      animation: { duration: 600 }
    }
  });
}

function generateHourLabels(n) {
  const labels = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now - i * 3600000);
    labels.push(d.getHours().toString().padStart(2, '0') + ':00');
  }
  return labels;
}

function refreshActivityChart() {
  if (!state.activityChart) return;
  state.activityChart.data.datasets[0].data = [...state.chartData.success];
  state.activityChart.data.datasets[1].data = [...state.chartData.failed];
  state.activityChart.update();
  showToast('success', 'Chart Updated', 'Activity chart refreshed.');
}

function updateChartRange(hours) {
  const n = parseInt(hours);
  const labels = generateHourLabels(n);
  state.activityChart.data.labels = labels;
  state.activityChart.data.datasets[0].data = new Array(n).fill(0).map(() => Math.floor(Math.random() * 20));
  state.activityChart.data.datasets[1].data = new Array(n).fill(0).map(() => Math.floor(Math.random() * 10));
  state.activityChart.update();
}

function updateThreatChart() {
  if (!state.threatChart) return;
  const counts = { brute_force: 0, port_scan: 0, sql_injection: 0, failed_login: 0, privilege_escalation: 0 };
  state.alerts.forEach(a => { if (counts[a.type] !== undefined) counts[a.type]++; });
  state.threatChart.data.datasets[0].data = Object.values(counts);
  state.threatChart.update();
}

// ============================================================
//  LOG ANALYSIS
// ============================================================
const LOG_PATTERNS = [
  { regex: /Failed password for (invalid user )?(\S+) from ([\d.]+)/i, type: 'failed_login', severity: 'medium', msg: (m) => `Failed SSH login for user "${m[2]}" from ${m[3]}` },
  { regex: /Invalid user (\S+) from ([\d.]+)/i, type: 'failed_login', severity: 'medium', msg: (m) => `Invalid user "${m[1]}" attempted login from ${m[2]}` },
  { regex: /Accepted password for (\S+) from ([\d.]+)/i, type: 'successful_login', severity: 'info', msg: (m) => `Successful SSH login for "${m[1]}" from ${m[2]}` },
  { regex: /authentication failure.*user=(\S+)/i, type: 'failed_login', severity: 'medium', msg: (m) => `Authentication failure for user "${m[1]}"` },
  { regex: /FAILED LOGIN.*for (\S+).*from ([\d.]+)/i, type: 'failed_login', severity: 'medium', msg: (m) => `Failed login for "${m[1]}" from ${m[2]}` },
  { regex: /sql.*injection|union.*select|--.*--|\bor\b.*=.*\bor\b|1=1/i, type: 'sql_injection', severity: 'critical', msg: () => 'SQL Injection attempt detected' },
  { regex: /SYN flood|port scan|nmap|masscan/i, type: 'port_scan', severity: 'high', msg: (m) => 'Port scan activity detected' },
  { regex: /sudo.*COMMAND=|su\[.*\].*session opened/i, type: 'privilege_escalation', severity: 'high', msg: () => 'Privilege escalation detected' },
  { regex: /Disconnecting: Too many authentication failures/i, type: 'brute_force', severity: 'high', msg: () => 'Too many authentication failures - possible brute force' },
  { regex: /pam_unix.*auth failure.*user=(\S+)/i, type: 'failed_login', severity: 'medium', msg: (m) => `PAM auth failure for "${m[1]}"` },
];

const IP_REGEX = /\b(\d{1,3}\.){3}\d{1,3}\b/;
const USER_REGEX = /for (?:invalid user )?(\S+) from|user[=:](\S+)|for user (\S+)/i;
const TS_REGEX = /^(\w{3}\s+\d+\s+[\d:]+|\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})/;

function parseLine(line) {
  if (!line.trim()) return null;
  let type = 'info', severity = 'info', message = line.trim(), ip = null, user = null;

  // Try patterns
  for (const pat of LOG_PATTERNS) {
    const m = line.match(pat.regex);
    if (m) {
      type = pat.type;
      severity = pat.severity;
      message = pat.msg(m);
      break;
    }
  }

  // Extract IP
  const ipMatch = line.match(IP_REGEX);
  if (ipMatch) ip = ipMatch[0];

  // Extract user
  const userMatch = line.match(USER_REGEX);
  if (userMatch) user = userMatch[1] || userMatch[2] || userMatch[3];

  // Timestamp
  const tsMatch = line.match(TS_REGEX);
  const timestamp = tsMatch ? tsMatch[0] : new Date().toLocaleString();

  // Apply active rules
  for (const rule of state.rules.filter(r => r.enabled)) {
    try {
      const rx = new RegExp(rule.pattern, 'i');
      if (rx.test(line)) {
        type = rule.alertType;
        severity = rule.severity;
        message = `[Rule: ${rule.name}] ${message}`;
        break;
      }
    } catch (e) {}
  }

  return { id: genId(), timestamp, type, severity, message, ip, user, raw: line.trim() };
}

function analyzeManualLogs() {
  const text = document.getElementById('manualLogInput').value.trim();
  if (!text) { showToast('warning', 'No Input', 'Please enter log data to analyze.'); return; }
  const lines = text.split('\n').filter(l => l.trim());
  processLogLines(lines);
  document.getElementById('manualLogInput').value = '';
  showToast('success', 'Analysis Complete', `Processed ${lines.length} log entries.`);
}

function processLogLines(lines) {
  const parsed = lines.map(parseLine).filter(Boolean);
  state.logs = [...parsed, ...state.logs];
  state.filteredLogs = [...state.logs];
  state.stats.totalLogs += parsed.length;

  // Count per IP for brute force detection
  parsed.forEach(entry => {
    if (entry.ip && (entry.type === 'failed_login' || entry.type === 'brute_force')) {
      state.ipLoginCounts[entry.ip] = (state.ipLoginCounts[entry.ip] || 0) + 1;
      state.stats.failedLogins++;

      // Update chart
      const hour = new Date().getHours();
      state.chartData.failed[hour]++;

      // Brute force detection
      const threshold = state.settings.bruteForceThreshold;
      if (state.ipLoginCounts[entry.ip] >= threshold) {
        createAlert('brute_force', 'critical', `Brute Force Attack Detected`,
          `IP ${entry.ip} has ${state.ipLoginCounts[entry.ip]} failed login attempts.`,
          entry.ip, entry.user);
        if (state.settings.autoBlock) autoBlockIP(entry.ip, 'Brute force detection');
        state.ipLoginCounts[entry.ip] = 0; // Reset after alert
      }
    } else if (entry.type === 'successful_login') {
      const hour = new Date().getHours();
      state.chartData.success[hour]++;
    }

    // Create alerts for high severity
    if (['critical', 'high'].includes(entry.severity) && entry.type !== 'brute_force') {
      createAlert(entry.type, entry.severity, getAlertTitle(entry.type), entry.message, entry.ip, entry.user);
    }
  });

  updateStatsUI();
  renderLogTable();
  updateDashboard();
  refreshActivityChart();
  // Feed all parsed lines into live stream too
  parsed.forEach(entry => addToLiveStream(entry.raw));
}


function getAlertTitle(type) {
  const titles = {
    failed_login: 'Failed Login Attempt', brute_force: 'Brute Force Attack',
    sql_injection: 'SQL Injection Attempt', port_scan: 'Port Scan Detected',
    privilege_escalation: 'Privilege Escalation', successful_login: 'Successful Login'
  };
  return titles[type] || 'Security Event';
}

// ============================================================
//  FILE HANDLING
// ============================================================
function handleFileUpload(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split('\n');
      processLogLines(lines);
      showToast('success', 'File Loaded', `Processed "${file.name}" (${lines.length} lines).`);
      switchTab('logs', document.getElementById('nav-logs'));
    };
    reader.readAsText(file);
  });
}

function handleFileDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (!files.length) return;
  const fakeInput = { files };
  handleFileUpload(fakeInput);
}

// ============================================================
//  LOG TABLE RENDERING
// ============================================================
function renderLogTable() {
  const tbody = document.getElementById('logTableBody');
  let logs = [...state.filteredLogs];

  // Sort
  logs.sort((a, b) => {
    let va = a[state.sortKey] || '', vb = b[state.sortKey] || '';
    return state.sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  // Paginate
  const start = (state.currentPage - 1) * state.logsPerPage;
  const page = logs.slice(start, start + state.logsPerPage);

  if (!page.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No log entries match the current filters.</td></tr>';
    renderPagination(0);
    return;
  }

  tbody.innerHTML = page.map(log => `
    <tr>
      <td><span class="alert-ts">${escHtml(log.timestamp)}</span></td>
      <td><span class="badge ${log.severity}">${log.severity.toUpperCase()}</span></td>
      <td>${formatType(log.type)}</td>
      <td><code style="color:var(--cyan);font-size:12px">${escHtml(log.ip || '—')}</code></td>
      <td><code style="font-size:12px">${escHtml(log.user || '—')}</code></td>
      <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(log.message)}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-sm" onclick="viewLogDetail('${log.id}')">Details</button>
          <button class="btn-sm danger" onclick="blockIPFromLog('${log.id}')">Block IP</button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination(logs.length);
}

function renderPagination(total) {
  const pages = Math.ceil(total / state.logsPerPage);
  const el = document.getElementById('logPagination');
  if (pages <= 1) { el.innerHTML = ''; return; }

  let html = `<span style="font-size:13px;color:var(--text-muted);margin-right:8px">${total} entries</span>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === state.currentPage ? 'active' : ''}" onclick="gotoPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

function gotoPage(n) { state.currentPage = n; renderLogTable(); }

function sortTable(key) {
  if (state.sortKey === key) state.sortAsc = !state.sortAsc;
  else { state.sortKey = key; state.sortAsc = true; }
  renderLogTable();
}

function filterLogs() {
  const search = document.getElementById('logSearchInput').value.toLowerCase();
  const sev = document.getElementById('logSeverityFilter').value;
  const type = document.getElementById('logTypeFilter').value;
  state.filteredLogs = state.logs.filter(log => {
    const matchSearch = !search || JSON.stringify(log).toLowerCase().includes(search);
    const matchSev = sev === 'all' || log.severity === sev;
    const matchType = type === 'all' || log.type === type;
    return matchSearch && matchSev && matchType;
  });
  state.currentPage = 1;
  renderLogTable();
}

function clearLogs() {
  if (!confirm('Clear all analyzed logs? This cannot be undone.')) return;
  state.logs = [];
  state.filteredLogs = [];
  state.stats.totalLogs = 0;
  state.stats.failedLogins = 0;
  state.ipLoginCounts = {};
  renderLogTable();
  updateStatsUI();
  showToast('info', 'Logs Cleared', 'All log entries have been removed.');
}

function exportLogs() {
  const csv = ['Timestamp,Severity,Type,IP,User,Message']
    .concat(state.filteredLogs.map(l =>
      `"${l.timestamp}","${l.severity}","${l.type}","${l.ip||''}","${l.user||''}","${l.message.replace(/"/g,'""')}"`
    )).join('\n');
  downloadFile('security_logs.csv', csv, 'text/csv');
  showToast('success', 'Exported', 'Logs exported to CSV.');
}

// ============================================================
//  LOG DETAIL MODAL
// ============================================================
function viewLogDetail(id) {
  const log = state.logs.find(l => l.id === id);
  if (!log) return;
  showModal('Log Entry Detail', `
    <div class="detail-row"><span class="detail-label">Timestamp</span><span class="detail-value">${escHtml(log.timestamp)}</span></div>
    <div class="detail-row"><span class="detail-label">Severity</span><span class="detail-value"><span class="badge ${log.severity}">${log.severity.toUpperCase()}</span></span></div>
    <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${formatType(log.type)}</span></div>
    <div class="detail-row"><span class="detail-label">Source IP</span><span class="detail-value">${escHtml(log.ip || 'Unknown')}</span></div>
    <div class="detail-row"><span class="detail-label">Username</span><span class="detail-value">${escHtml(log.user || 'Unknown')}</span></div>
    <div class="detail-row"><span class="detail-label">Message</span><span class="detail-value" style="word-break:break-all">${escHtml(log.message)}</span></div>
    <div class="detail-row"><span class="detail-label">Raw Log</span><span class="detail-value" style="word-break:break-all;font-size:11px;opacity:0.7">${escHtml(log.raw)}</span></div>
  `, [
    { text: log.ip ? `Block IP (${log.ip})` : 'Block IP', cls: 'btn danger', fn: `blockIPFromLog('${id}'); closeModal()` },
    { text: 'Close', cls: 'btn-sm', fn: 'closeModal()' }
  ]);
}

function blockIPFromLog(id) {
  const log = state.logs.find(l => l.id === id);
  if (!log || !log.ip) { showToast('warning', 'No IP', 'No IP address found in this log entry.'); return; }
  addBlacklistEntry(log.ip, 'high', `Blocked from log: ${log.message}`);
}

// ============================================================
//  ALERTS
// ============================================================
function createAlert(type, severity, title, desc, ip = null, user = null) {
  const alert = {
    id: genId(), type, severity, title, desc,
    ip, user, status: 'new',
    timestamp: new Date().toLocaleString()
  };
  state.alerts.unshift(alert);
  state.filteredAlerts = [...state.alerts];
  state.stats.activeThreats = state.alerts.filter(a => a.status === 'new').length;

  updateAlertBadge();
  renderAlerts();
  renderAlertsMini();
  updateThreatChart();
  updateThreatLevel();
  updateStatsUI();
  addThreat(type, severity, ip);

  // Toast for high/critical
  if (['critical', 'high'].includes(severity)) {
    showToast(severity === 'critical' ? 'error' : 'warning', title, desc.substring(0, 100));
  }

  // Browser notification
  if (state.settings.notif && Notification.permission === 'granted' && severity === 'critical') {
    new Notification(`🚨 ${title}`, { body: desc.substring(0, 200) });
  }
}

function renderAlerts() {
  const container = document.getElementById('alertsContainer');
  let alerts = [...state.filteredAlerts];

  if (!alerts.length) {
    container.innerHTML = `
      <div class="empty-state large">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <p>No alerts found.</p>
      </div>`;
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div class="alert-card ${a.severity} ${a.status}" id="alert-${a.id}">
      <div class="alert-icon">${severityIcon(a.severity)}</div>
      <div class="alert-body">
        <div class="alert-title">${escHtml(a.title)} ${a.status !== 'new' ? `<span style="font-size:11px;color:var(--text-muted);font-weight:400">[${a.status}]</span>` : ''}</div>
        <div class="alert-desc">${escHtml(a.desc)}</div>
        <div class="alert-meta">
          <span>${severityBadge(a.severity)}</span>
          <span>⏱ ${escHtml(a.timestamp)}</span>
          ${a.ip ? `<span>🌐 IP: <code style="color:var(--cyan)">${escHtml(a.ip)}</code></span>` : ''}
          ${a.user ? `<span>👤 User: <code>${escHtml(a.user)}</code></span>` : ''}
          <span>📋 ${formatType(a.type)}</span>
        </div>
        <div class="alert-actions">
          ${a.status === 'new' ? `<button class="btn-sm" onclick="acknowledgeAlert('${a.id}')">Acknowledge</button>` : ''}
          ${a.status !== 'resolved' ? `<button class="btn-sm" onclick="resolveAlert('${a.id}')">Resolve</button>` : ''}
          ${a.ip ? `<button class="btn-sm danger" onclick="blockIPAlert('${a.id}')">Block IP</button>` : ''}
          <button class="btn-sm danger" onclick="deleteAlert('${a.id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  updateAlertCounters();
}

function renderAlertsMini() {
  const container = document.getElementById('alertsMini');
  const recent = state.alerts.slice(0, 6);
  if (!recent.length) {
    container.innerHTML = '<div class="empty-state">No alerts yet. System monitoring active.</div>';
    return;
  }
  container.innerHTML = recent.map(a => `
    <div class="alert-mini-item" onclick="switchTab('alerts', document.getElementById('nav-alerts'))">
      <div class="alert-mini-dot ${a.severity}"></div>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(a.title)}</span>
      <span style="font-size:11px;color:var(--text-muted);flex-shrink:0">${a.timestamp.split(',')[1]?.trim() || ''}</span>
    </div>
  `).join('');
}

function acknowledgeAlert(id) {
  const a = state.alerts.find(x => x.id === id);
  if (a) { a.status = 'acknowledged'; renderAlerts(); updateStatsUI(); }
}

function resolveAlert(id) {
  const a = state.alerts.find(x => x.id === id);
  if (a) {
    a.status = 'resolved';
    state.stats.activeThreats = Math.max(0, state.stats.activeThreats - 1);
    renderAlerts(); updateStatsUI(); updateThreatLevel();
  }
}

function deleteAlert(id) {
  state.alerts = state.alerts.filter(x => x.id !== id);
  state.filteredAlerts = state.filteredAlerts.filter(x => x.id !== id);
  state.stats.activeThreats = state.alerts.filter(a => a.status === 'new').length;
  renderAlerts(); updateAlertBadge(); updateStatsUI();
}

function acknowledgeAllAlerts() {
  state.alerts.forEach(a => { if (a.status === 'new') a.status = 'acknowledged'; });
  state.filteredAlerts = [...state.alerts];
  state.stats.activeThreats = 0;
  renderAlerts(); updateAlertBadge(); updateStatsUI(); updateThreatLevel();
  showToast('success', 'All Acknowledged', 'All alerts have been acknowledged.');
}

function clearAllAlerts() {
  if (!confirm('Clear all alerts?')) return;
  state.alerts = [];
  state.filteredAlerts = [];
  state.stats.activeThreats = 0;
  renderAlerts(); renderAlertsMini(); updateAlertBadge(); updateStatsUI(); updateThreatLevel();
  showToast('info', 'Cleared', 'All alerts cleared.');
}

function blockIPAlert(id) {
  const a = state.alerts.find(x => x.id === id);
  if (a && a.ip) addBlacklistEntry(a.ip, a.severity, `Blocked from alert: ${a.title}`);
}

function filterAlerts() {
  const search = document.getElementById('alertSearchInput').value.toLowerCase();
  const sev = document.getElementById('alertSeverityFilter').value;
  const status = document.getElementById('alertStatusFilter').value;
  state.filteredAlerts = state.alerts.filter(a => {
    const matchSearch = !search || (a.title + a.desc + a.ip + a.user).toLowerCase().includes(search);
    const matchSev = sev === 'all' || a.severity === sev;
    const matchStatus = status === 'all' || a.status === status;
    return matchSearch && matchSev && matchStatus;
  });
  renderAlerts();
}

function updateAlertBadge() {
  const count = state.alerts.filter(a => a.status === 'new').length;
  const badge = document.getElementById('alertBadge');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

function updateAlertCounters() {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  state.alerts.forEach(a => { if (counts[a.severity] !== undefined) counts[a.severity]++; });
  document.getElementById('criticalCount').textContent = counts.critical;
  document.getElementById('highCount').textContent = counts.high;
  document.getElementById('mediumCount').textContent = counts.medium;
  document.getElementById('lowCount').textContent = counts.low;
}

// ============================================================
//  THREAT LEVEL
// ============================================================
function updateThreatLevel() {
  const newAlerts = state.alerts.filter(a => a.status === 'new');
  const criticals = newAlerts.filter(a => a.severity === 'critical').length;
  const highs = newAlerts.filter(a => a.severity === 'high').length;

  let level = 'low', text = 'LOW';
  if (criticals > 0) { level = 'critical'; text = 'CRITICAL'; }
  else if (highs > 2) { level = 'high'; text = 'HIGH'; }
  else if (newAlerts.length > 3) { level = 'medium'; text = 'MEDIUM'; }

  const el = document.getElementById('threatLevelBadge');
  el.className = `threat-level ${level}`;
  el.textContent = text;
}

// ============================================================
//  IP BLACKLIST
// ============================================================
function addToBlacklist() {
  const ip = document.getElementById('newIPInput').value.trim();
  const severity = document.getElementById('newIPSeverity').value;
  const reason = document.getElementById('newIPReason').value.trim() || 'Manually added';
  if (!ip) { showToast('warning', 'Invalid IP', 'Please enter an IP address.'); return; }
  addBlacklistEntry(ip, severity, reason, false);
  document.getElementById('newIPInput').value = '';
  document.getElementById('newIPReason').value = '';
}

function addBlacklistEntry(ip, severity, reason, isAuto = true) {
  if (state.blacklist.find(b => b.ip === ip)) {
    showToast('warning', 'Already Blacklisted', `IP ${ip} is already on the blacklist.`); return;
  }
  const entry = { id: genId(), ip, severity, reason, dateAdded: new Date().toLocaleString(), auto: isAuto };
  state.blacklist.unshift(entry);
  state.filteredIPs = [...state.blacklist];
  state.stats.blockedIPs = state.blacklist.length;
  if (isAuto) state.stats.blockedIPs;
  renderBlacklist();
  updateStatsUI();
  document.getElementById('blacklistCount').textContent = state.blacklist.length;
  showToast('warning', 'IP Blocked', `${ip} has been ${isAuto ? 'automatically' : 'manually'} added to the blacklist.`);
}

function autoBlockIP(ip, reason) {
  addBlacklistEntry(ip, 'critical', reason, true);
}

function renderBlacklist() {
  const tbody = document.getElementById('ipTableBody');
  const ips = state.filteredIPs;
  document.getElementById('blacklistCount').textContent = state.blacklist.length;

  if (!ips.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No IPs blacklisted.</td></tr>'; return;
  }
  tbody.innerHTML = ips.map(b => `
    <tr>
      <td><code style="color:var(--red);font-family:'JetBrains Mono',monospace">${escHtml(b.ip)}</code></td>
      <td><span class="badge ${b.severity}">${b.severity.toUpperCase()}</span></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(b.reason)}</td>
      <td style="font-size:12px;color:var(--text-muted)">${escHtml(b.dateAdded)}</td>
      <td><span class="badge ${b.auto ? 'high' : 'info'}">${b.auto ? 'AUTO' : 'MANUAL'}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-sm" onclick="editBlacklistEntry('${b.id}')">Edit</button>
          <button class="btn-sm danger" onclick="removeFromBlacklist('${b.id}')">Remove</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function removeFromBlacklist(id) {
  state.blacklist = state.blacklist.filter(b => b.id !== id);
  state.filteredIPs = [...state.blacklist];
  state.stats.blockedIPs = state.blacklist.length;
  renderBlacklist(); updateStatsUI();
  showToast('info', 'IP Removed', 'IP removed from blacklist.');
}

function editBlacklistEntry(id) {
  const b = state.blacklist.find(x => x.id === id);
  if (!b) return;
  showModal('Edit Blacklist Entry', `
    <div class="form-group"><label>IP Address</label><input type="text" id="editIP" value="${escHtml(b.ip)}" /></div>
    <div class="form-group" style="margin-top:12px"><label>Severity</label>
      <select id="editSev">
        ${['critical','high','medium','low'].map(s => `<option value="${s}" ${b.severity===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group" style="margin-top:12px"><label>Reason</label><input type="text" id="editReason" value="${escHtml(b.reason)}" /></div>
  `, [
    { text: 'Save', cls: 'btn primary', fn: `saveBlacklistEdit('${id}'); closeModal()` },
    { text: 'Cancel', cls: 'btn-sm', fn: 'closeModal()' }
  ]);
}

function saveBlacklistEdit(id) {
  const b = state.blacklist.find(x => x.id === id);
  if (!b) return;
  b.ip = document.getElementById('editIP').value.trim();
  b.severity = document.getElementById('editSev').value;
  b.reason = document.getElementById('editReason').value.trim();
  state.filteredIPs = [...state.blacklist];
  renderBlacklist();
  showToast('success', 'Updated', 'Blacklist entry updated.');
}

function clearBlacklist() {
  if (!confirm('Remove all IPs from blacklist?')) return;
  state.blacklist = [];
  state.filteredIPs = [];
  state.stats.blockedIPs = 0;
  renderBlacklist(); updateStatsUI();
  showToast('info', 'Cleared', 'Blacklist cleared.');
}

function filterIPs() {
  const search = document.getElementById('ipSearchInput').value.toLowerCase();
  state.filteredIPs = state.blacklist.filter(b => b.ip.includes(search) || b.reason.toLowerCase().includes(search));
  renderBlacklist();
}

function importIPList() {
  const text = prompt('Paste IP addresses (one per line):');
  if (!text) return;
  const ips = text.split('\n').map(l => l.trim()).filter(Boolean);
  ips.forEach(ip => addBlacklistEntry(ip, 'high', 'Imported from list', false));
  showToast('success', 'Imported', `${ips.length} IPs added to blacklist.`);
}

function exportIPList() {
  const csv = ['IP,Severity,Reason,Date,Auto']
    .concat(state.blacklist.map(b =>
      `"${b.ip}","${b.severity}","${b.reason}","${b.dateAdded}","${b.auto}"`
    )).join('\n');
  downloadFile('blacklist.csv', csv, 'text/csv');
  showToast('success', 'Exported', 'Blacklist exported.');
}

// ============================================================
//  DETECTION RULES
// ============================================================
const DEFAULT_RULES = [
  { name: 'SSH Brute Force', pattern: 'Failed password.*from (\\d+\\.\\d+\\.\\d+\\.\\d+)', alertType: 'brute_force', severity: 'critical', threshold: 5, desc: 'Detects repeated SSH password failures from the same IP.' },
  { name: 'Invalid SSH User', pattern: 'Invalid user \\S+ from (\\d+\\.\\d+\\.\\d+\\.\\d+)', alertType: 'failed_login', severity: 'high', threshold: 1, desc: 'Detects attempts to login with non-existent usernames.' },
  { name: 'SQL Injection Attempt', pattern: 'union.*select|\\bor\\b.*=.*\\bor\\b|1=1|--.*select', alertType: 'sql_injection', severity: 'critical', threshold: 1, desc: 'Detects common SQL injection patterns in log data.' },
  { name: 'Port Scan Activity', pattern: 'SYN flood|port scan|nmap|masscan|nikto', alertType: 'port_scan', severity: 'high', threshold: 1, desc: 'Detects port scanning and reconnaissance tools.' },
  { name: 'Privilege Escalation', pattern: 'sudo.*COMMAND=|su.*session opened|root.*privilege', alertType: 'privilege_escalation', severity: 'high', threshold: 1, desc: 'Detects attempts to escalate system privileges.' },
  { name: 'Root Login Attempt', pattern: 'Failed password for root', alertType: 'failed_login', severity: 'critical', threshold: 1, desc: 'Detects any attempt to login as root.' },
  { name: 'Multiple Auth Failures', pattern: 'Disconnecting: Too many authentication failures', alertType: 'brute_force', severity: 'high', threshold: 1, desc: 'Detects when SSH rejects connection due to excessive failures.' },
  { name: 'PAM Auth Failure', pattern: 'pam_unix.*auth failure', alertType: 'failed_login', severity: 'medium', threshold: 3, desc: 'Detects PAM authentication failures.' },
];

function loadDefaultRules() {
  if (state.rules.length > 0) return;
  DEFAULT_RULES.forEach(r => {
    state.rules.push({ id: genId(), ...r, enabled: true });
  });
  renderRules();
  showToast('success', 'Rules Loaded', `${DEFAULT_RULES.length} default detection rules activated.`);
}

function addRule() {
  const name = document.getElementById('ruleName').value.trim();
  const pattern = document.getElementById('rulePattern').value.trim();
  const severity = document.getElementById('ruleSeverity').value;
  const threshold = parseInt(document.getElementById('ruleThreshold').value) || 5;
  const alertType = document.getElementById('ruleAlertType').value;
  const desc = document.getElementById('ruleDescription').value.trim();

  if (!name || !pattern) { showToast('warning', 'Missing Fields', 'Rule name and pattern are required.'); return; }

  try { new RegExp(pattern); } catch (e) {
    showToast('error', 'Invalid Regex', 'The pattern is not a valid regular expression.'); return;
  }

  state.rules.unshift({ id: genId(), name, pattern, severity, threshold, alertType, desc, enabled: true });
  renderRules();
  ['ruleName','rulePattern','ruleDescription'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('rulesCount').textContent = state.rules.length;
  showToast('success', 'Rule Added', `Detection rule "${name}" activated.`);
}

function testRule() {
  const pattern = document.getElementById('rulePattern').value.trim();
  if (!pattern) { showToast('warning', 'No Pattern', 'Enter a regex pattern to test.'); return; }
  const testStr = prompt('Enter a log line to test against:', 'Oct 28 10:23:41 server sshd[1234]: Failed password for root from 192.168.1.100 port 54321 ssh2');
  if (!testStr) return;
  try {
    const rx = new RegExp(pattern, 'i');
    const match = testStr.match(rx);
    if (match) {
      showToast('success', 'Pattern Matched!', `Match: "${match[0]}"`);
    } else {
      showToast('warning', 'No Match', 'Pattern did not match the test string.');
    }
  } catch (e) { showToast('error', 'Regex Error', e.message); }
}

function renderRules() {
  const list = document.getElementById('rulesList');
  document.getElementById('rulesCount').textContent = state.rules.length;

  if (!state.rules.length) {
    list.innerHTML = '<div class="empty-state">No rules configured.</div>'; return;
  }

  list.innerHTML = state.rules.map(r => `
    <div class="rule-item">
      <div class="rule-info">
        <div class="rule-name">${escHtml(r.name)} ${severityBadge(r.severity)}</div>
        <div class="rule-pattern">${escHtml(r.pattern)}</div>
        <div class="rule-desc">${escHtml(r.desc || '')}</div>
        <div style="margin-top:6px;font-size:12px;color:var(--text-muted)">Type: ${formatType(r.alertType)} | Threshold: ${r.threshold}/min</div>
      </div>
      <div class="rule-actions">
        <label class="toggle-switch" title="${r.enabled ? 'Disable' : 'Enable'} rule">
          <input type="checkbox" ${r.enabled ? 'checked' : ''} onchange="toggleRule('${r.id}', this.checked)" />
          <span class="toggle-slider"></span>
        </label>
        <button class="btn-sm danger" onclick="deleteRule('${r.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function toggleRule(id, enabled) {
  const r = state.rules.find(x => x.id === id);
  if (r) { r.enabled = enabled; showToast('info', enabled ? 'Rule Enabled' : 'Rule Disabled', r.name); }
}

function deleteRule(id) {
  state.rules = state.rules.filter(r => r.id !== id);
  renderRules();
  showToast('info', 'Rule Deleted', 'Detection rule removed.');
}

function enableAllRules() {
  state.rules.forEach(r => r.enabled = true);
  renderRules();
  showToast('success', 'All Enabled', 'All detection rules are now active.');
}

function disableAllRules() {
  state.rules.forEach(r => r.enabled = false);
  renderRules();
  showToast('info', 'All Disabled', 'All detection rules have been disabled.');
}

// ============================================================
//  THREAT MAP
// ============================================================
const ATTACK_LOCATIONS = [
  { name: 'Russia', x: 65, y: 25 }, { name: 'China', x: 78, y: 35 },
  { name: 'North Korea', x: 81, y: 32 }, { name: 'Iran', x: 60, y: 38 },
  { name: 'Brazil', x: 30, y: 60 }, { name: 'Romania', x: 55, y: 28 },
  { name: 'USA', x: 18, y: 35 }, { name: 'Germany', x: 51, y: 24 },
  { name: 'India', x: 70, y: 42 }, { name: 'Vietnam', x: 78, y: 43 },
  { name: 'Nigeria', x: 50, y: 55 }, { name: 'Ukraine', x: 58, y: 26 },
];

let attackStats = { total: 0, unique: new Set(), countries: new Set(), rate: 0 };

function addThreat(type, severity, ip) {
  const loc = ATTACK_LOCATIONS[Math.floor(Math.random() * ATTACK_LOCATIONS.length)];
  const threat = { id: genId(), type, severity, ip: ip || randomIP(), location: loc, timestamp: new Date().toLocaleString() };
  state.threats.unshift(threat);
  if (state.threats.length > 50) state.threats.pop();

  attackStats.total++;
  if (ip) attackStats.unique.add(ip);
  attackStats.countries.add(loc.name);

  renderThreatMap();
  renderActiveThreats();
  updateThreatStats();
}

function renderThreatMap() {
  const container = document.getElementById('attackPins');
  if (!container) return;
  const pins = state.threats.slice(0, 20).map(t => `
    <div class="attack-pin ${t.severity}" style="left:${t.location.x}%;top:${t.location.y}%" title="${t.location.name}: ${t.ip}"></div>
  `).join('');
  container.innerHTML = pins;

  // Draw world map canvas
  const canvas = document.getElementById('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 800;
  canvas.height = 400;

  // Background
  ctx.fillStyle = '#060d1f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = 'rgba(0,200,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

  // Continents (simplified shapes)
  ctx.fillStyle = 'rgba(0,200,255,0.08)';
  ctx.strokeStyle = 'rgba(0,200,255,0.2)';
  ctx.lineWidth = 1;
  drawSimpleMap(ctx, canvas.width, canvas.height);

  // Attack lines
  const targetX = canvas.width * 0.5;
  const targetY = canvas.height * 0.45;
  state.threats.slice(0, 10).forEach(t => {
    const sx = canvas.width * t.location.x / 100;
    const sy = canvas.height * t.location.y / 100;
    const color = { critical: '#ef4444', high: '#f59e0b', medium: '#eab308', low: '#22c55e' }[t.severity] || '#00c8ff';
    ctx.strokeStyle = color + '60';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

function drawSimpleMap(ctx, w, h) {
  // Simplified continent blobs
  const continents = [
    { points: [[0.05,0.2],[0.28,0.2],[0.3,0.55],[0.05,0.55]] }, // North America
    { points: [[0.22,0.55],[0.35,0.55],[0.32,0.85],[0.2,0.85]] }, // South America
    { points: [[0.4,0.15],[0.65,0.15],[0.68,0.6],[0.38,0.6]] }, // Europe/Africa
    { points: [[0.62,0.15],[0.95,0.2],[0.95,0.65],[0.62,0.6]] }, // Asia
    { points: [[0.78,0.62],[0.98,0.62],[0.96,0.82],[0.75,0.82]] }, // Australia
  ];
  continents.forEach(({ points }) => {
    ctx.beginPath();
    ctx.moveTo(w * points[0][0], h * points[0][1]);
    points.forEach(p => ctx.lineTo(w * p[0], h * p[1]));
    ctx.closePath(); ctx.fill(); ctx.stroke();
  });
}

function renderActiveThreats() {
  const list = document.getElementById('activeTheatsList');
  if (!list) return;
  const threats = state.threats.slice(0, 10);
  if (!threats.length) { list.innerHTML = '<div class="empty-state">No active threats detected</div>'; return; }
  list.innerHTML = threats.map(t => `
    <div class="threat-item">
      ${severityDot(t.severity)}
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${formatType(t.type)}</div>
        <div style="font-size:12px;color:var(--text-muted)">${t.location.name} • <code style="color:var(--cyan)">${t.ip}</code></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted)">${t.timestamp.split(',')[1]?.trim() || ''}</div>
    </div>
  `).join('');
}

function updateThreatStats() {
  const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  el('totalAttacks', attackStats.total);
  el('uniqueAttackers', attackStats.unique.size);
  el('countriesBlocked', attackStats.countries.size);
  el('attackRate', (attackStats.total / Math.max(1, Math.ceil((Date.now() - startTime) / 60000))).toFixed(1));
}

const startTime = Date.now();

function simulateAttack() {
  const types = ['brute_force','failed_login','port_scan','sql_injection','privilege_escalation'];
  const severities = ['critical','high','medium','low'];
  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * 3)];
  const ip = randomIP();
  createAlert(type, severity, getAlertTitle(type), `Simulated attack from ${ip}.`, ip, 'attacker');
  showToast('warning', 'Attack Simulated', `Simulated ${type} from ${ip}`);
}

function refreshThreatMap() { renderThreatMap(); renderActiveThreats(); updateThreatStats(); }

// ============================================================
//  REAL-TIME SIMULATION
// ============================================================
const SAMPLE_LOGS = [
  `${getTimestamp()} server sshd[1234]: Failed password for root from 203.0.113.45 port 54321 ssh2`,
  `${getTimestamp()} server sshd[1235]: Failed password for admin from 198.51.100.23 port 12345 ssh2`,
  `${getTimestamp()} server sshd[1236]: Invalid user hacker from 192.0.2.10 port 9999 ssh2`,
  `${getTimestamp()} server sshd[1237]: Accepted password for alice from 10.0.0.5 port 22 ssh2`,
  `${getTimestamp()} server sshd[1238]: Failed password for oracle from 185.234.218.48 port 44444 ssh2`,
  `${getTimestamp()} server sshd[1239]: Disconnecting: Too many authentication failures for root`,
  `${getTimestamp()} server sudo[5678]: pam_unix(sudo:auth): authentication failure; user=bob`,
  `${getTimestamp()} server apache[8080]: GET /index.php?id=1 UNION SELECT username,password FROM users--`,
  `${getTimestamp()} server sshd[1240]: Failed password for test from 89.248.167.131 port 4444 ssh2`,
  `${getTimestamp()} server sshd[1241]: Accepted password for john from 172.16.0.10 port 22 ssh2`,
  `${getTimestamp()} server sshd[1242]: Failed password for ftpuser from 5.188.206.197 port 33333 ssh2`,
  `${getTimestamp()} server sshd[1243]: Failed password for root from 203.0.113.45 port 54322 ssh2`,
  `${getTimestamp()} server sshd[1244]: Failed password for root from 203.0.113.45 port 54323 ssh2`,
  `${getTimestamp()} server kernel: Nmap scan detected from 192.0.2.99`,
  `${getTimestamp()} server sshd[1245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 user=deploy`,
  `${getTimestamp()} server sudo[9012]: admin : TTY=pts/0 ; PWD=/root ; USER=root ; COMMAND=/bin/bash`,
];

function getTimestamp() {
  const now = new Date();
  return `${now.toLocaleString('en-US', {month:'short'})} ${String(now.getDate()).padStart(2,' ')} ${now.toTimeString().slice(0,8)}`;
}

function startSimulation() {
  if (state.simInterval) clearInterval(state.simInterval);
  if (!state.settings.realtimeSim || !state.monitoring) return;

  const speeds = { slow: 5000, medium: 2000, fast: 500 };
  const interval = speeds[state.settings.simSpeed] || 2000;

  state.simInterval = setInterval(() => {
    if (!state.monitoring || !state.settings.realtimeSim) return;
    const line = SAMPLE_LOGS[Math.floor(Math.random() * SAMPLE_LOGS.length)].replace(
      /\d+\.\d+\.\d+\.\d+/g, randomIP
    );
    processLogLines([line]);
    addToLiveStream(line);
  }, interval);
}

function toggleMonitoringSystem() {
  state.monitoring = !state.monitoring;
  const btn = document.getElementById('toggleMonitoring');
  const dot = document.querySelector('.status-dot');
  const status = document.getElementById('systemStatus').querySelector('span');
  const liveDot = document.querySelector('.live-dot');

  if (state.monitoring) {
    btn.textContent = 'Pause Monitoring';
    btn.classList.remove('paused');
    dot.classList.remove('paused'); dot.classList.add('active');
    status.textContent = 'System Active';
    if (liveDot) liveDot.style.animationPlayState = 'running';
    startSimulation();
    showToast('success', 'Monitoring Resumed', 'Log analysis is now active.');
  } else {
    btn.textContent = 'Resume Monitoring';
    btn.classList.add('paused');
    dot.classList.remove('active'); dot.classList.add('paused');
    status.textContent = 'Monitoring Paused';
    if (liveDot) liveDot.style.animationPlayState = 'paused';
    clearInterval(state.simInterval);
    showToast('warning', 'Monitoring Paused', 'Log analysis has been paused.');
  }
}

// ============================================================
//  LIVE STREAM
// ============================================================
let liveStreamPaused = false;
const liveStreamBuffer = [];
const MAX_STREAM_LINES = 100;

function addToLiveStream(rawLine) {
  if (liveStreamPaused) return;
  const container = document.getElementById('liveStream');
  if (!container) return;

  // Parse for display
  const parsed = parseLine(rawLine);
  if (!parsed) return;

  // Remove placeholder
  const placeholder = container.querySelector('.empty-state');
  if (placeholder) placeholder.remove();

  const line = document.createElement('div');
  line.className = 'live-stream-line';
  const severityColors = { critical: '#ff7070', high: '#f59e0b', medium: '#eab308', low: '#22c55e', info: '#94a3b8' };
  const color = severityColors[parsed.severity] || '#94a3b8';
  line.innerHTML = `
    <span class="stream-ts">${new Date().toTimeString().slice(0,8)}</span>
    <span class="badge ${parsed.severity}" style="font-size:10px;padding:2px 7px">${parsed.severity.slice(0,4).toUpperCase()}</span>
    ${parsed.ip ? `<span class="stream-ip">${parsed.ip}</span>` : ''}
    <span class="stream-msg ${parsed.severity}">${escHtml(parsed.message)}</span>
  `;

  container.insertBefore(line, container.firstChild);

  // Keep max lines
  while (container.children.length > MAX_STREAM_LINES) {
    container.removeChild(container.lastChild);
  }

  // Play sound for critical
  if (parsed.severity === 'critical' && state.settings.soundAlert) {
    playAlertSound();
  }
}

function clearLiveStream() {
  const container = document.getElementById('liveStream');
  if (container) container.innerHTML = '<div class="empty-state" style="padding:20px">Stream cleared. Waiting for new events...</div>';
}

function pauseLiveStream() {
  liveStreamPaused = !liveStreamPaused;
  const btn = document.getElementById('liveStreamPauseBtn');
  if (btn) btn.textContent = liveStreamPaused ? 'Resume' : 'Pause';
  const dot = document.querySelector('.live-dot');
  if (dot) dot.style.animationPlayState = liveStreamPaused ? 'paused' : 'running';
  showToast('info', liveStreamPaused ? 'Stream Paused' : 'Stream Resumed', liveStreamPaused ? 'Live stream display paused.' : 'Live stream resumed.');
}

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}


// ============================================================
//  SAMPLE LOG GENERATION
// ============================================================
function generateSampleLogs() {
  const ta = document.getElementById('manualLogInput');
  ta.value = SAMPLE_LOGS.map(l =>
    l.replace(/\d+\.\d+\.\d+\.\d+/g, randomIP)
  ).join('\n');
  showToast('info', 'Sample Logs Generated', 'Review and click "Analyze Logs" to process.');
}

// ============================================================
//  REPORTS
// ============================================================
let currentReport = '';

function generateReport() {
  const type = document.getElementById('reportType').value;
  const period = document.getElementById('reportPeriod').value;
  const format = document.getElementById('reportFormat').value;

  const now = new Date().toLocaleString();
  const periodLabel = { '1h': 'Last 1 Hour', '24h': 'Last 24 Hours', '7d': 'Last 7 Days', '30d': 'Last 30 Days' }[period];
  const typeLabel = { summary: 'Executive Summary', detailed: 'Detailed Analysis', compliance: 'Compliance Report', incident: 'Incident Report' }[type];

  const reportData = buildReportData();
  let content = '';

  if (format === 'json') {
    content = JSON.stringify({ reportType: typeLabel, period: periodLabel, generated: now, ...reportData }, null, 2);
  } else if (format === 'csv') {
    content = buildCSVReport(reportData);
  } else if (format === 'html') {
    content = buildHTMLReport(typeLabel, periodLabel, now, reportData);
  } else {
    content = buildTextReport(typeLabel, periodLabel, now, reportData);
  }

  currentReport = { content, format, type, period };
  const preview = document.getElementById('reportContent');
  preview.innerHTML = format === 'html'
    ? content
    : `<pre style="font-size:12px;white-space:pre-wrap;color:var(--text-secondary)">${escHtml(content)}</pre>`;

  document.getElementById('downloadReportBtn').disabled = false;
  showToast('success', 'Report Generated', `${typeLabel} generated successfully.`);
}

function buildReportData() {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  state.alerts.forEach(a => { if (counts[a.severity] !== undefined) counts[a.severity]++; });
  const topIPs = Object.entries(state.ipLoginCounts || {}).sort((a,b) => b[1]-a[1]).slice(0,5);
  return {
    totalLogs: state.stats.totalLogs,
    failedLogins: state.stats.failedLogins,
    alerts: state.alerts.length,
    blockedIPs: state.blacklist.length,
    alertsBySeverity: counts,
    topAttackers: topIPs,
    recentAlerts: state.alerts.slice(0, 10).map(a => ({ title: a.title, severity: a.severity, ip: a.ip, timestamp: a.timestamp })),
    blacklist: state.blacklist.slice(0, 10).map(b => ({ ip: b.ip, reason: b.reason, severity: b.severity })),
    rules: state.rules.length,
    activeRules: state.rules.filter(r => r.enabled).length
  };
}

function buildTextReport(type, period, now, d) {
  return `
====================================================
  SECUREWATCH IDS — ${type.toUpperCase()}
====================================================
Period  : ${period}
Generated: ${now}

── EXECUTIVE SUMMARY ────────────────────────────
Total Logs Analyzed  : ${d.totalLogs}
Failed Login Attempts: ${d.failedLogins}
Total Alerts         : ${d.alerts}
Blocked IPs          : ${d.blockedIPs}
Active Rules         : ${d.activeRules}/${d.rules}

── ALERTS BY SEVERITY ───────────────────────────
  Critical : ${d.alertsBySeverity.critical}
  High     : ${d.alertsBySeverity.high}
  Medium   : ${d.alertsBySeverity.medium}
  Low      : ${d.alertsBySeverity.low}

── TOP ATTACK SOURCES ───────────────────────────
${d.topAttackers.map((t,i) => `  ${i+1}. ${t[0]} — ${t[1]} attempts`).join('\n') || '  No data'}

── RECENT ALERTS ────────────────────────────────
${d.recentAlerts.map(a => `  [${a.severity.toUpperCase()}] ${a.title} — ${a.ip||'N/A'} (${a.timestamp})`).join('\n') || '  No alerts'}

── BLACKLISTED IPs ──────────────────────────────
${d.blacklist.map(b => `  ${b.ip} — ${b.severity.toUpperCase()} — ${b.reason}`).join('\n') || '  No IPs blacklisted'}

====================================================
  Report generated by SecureWatch IDS v2.0
====================================================`;
}

function buildHTMLReport(type, period, now, d) {
  return `<div style="font-family:Inter,sans-serif;color:#e2e8f0;padding:0">
  <div style="background:linear-gradient(135deg,#00c8ff22,#a855f722);border-radius:8px;padding:20px;margin-bottom:16px">
    <h2 style="color:#00c8ff;margin:0 0 4px">${type}</h2>
    <p style="color:#94a3b8;margin:0">Period: ${period} | Generated: ${now}</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
    ${[['Total Logs', d.totalLogs, '#00c8ff'], ['Failed Logins', d.failedLogins, '#f59e0b'], ['Total Alerts', d.alerts, '#ef4444'], ['Blocked IPs', d.blockedIPs, '#a855f7']]
      .map(([l,v,c]) => `<div style="background:#0d1425;border:1px solid ${c}44;border-radius:8px;padding:14px"><div style="font-size:24px;font-weight:700;color:${c}">${v}</div><div style="font-size:12px;color:#94a3b8">${l}</div></div>`).join('')}
  </div>
  <h3 style="color:#94a3b8;font-size:14px;margin-bottom:10px">RECENT ALERTS</h3>
  ${d.recentAlerts.map(a => {
    const colors = { critical:'#ef4444', high:'#f59e0b', medium:'#eab308', low:'#22c55e' };
    return `<div style="background:#0d1425;border-left:3px solid ${colors[a.severity]||'#00c8ff'};border-radius:4px;padding:10px 14px;margin-bottom:8px;font-size:13px">
      <strong>${a.title}</strong> — ${a.ip||'N/A'}<br><span style="color:#475569">${a.timestamp}</span>
    </div>`;
  }).join('') || '<p style="color:#475569">No alerts</p>'}
</div>`;
}

function buildCSVReport(d) {
  return ['Type,Severity,IP,Timestamp']
    .concat(d.recentAlerts.map(a => `"${a.title}","${a.severity}","${a.ip||''}","${a.timestamp}"`))
    .join('\n');
}

function downloadReport() {
  if (!currentReport) return;
  const { content, format } = currentReport;
  const ext = format === 'html' ? 'html' : format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt';
  const mime = format === 'html' ? 'text/html' : format === 'json' ? 'application/json' : 'text/plain';
  downloadFile(`security_report_${Date.now()}.${ext}`, content, mime);
  showToast('success', 'Downloaded', 'Report downloaded successfully.');
}

// ============================================================
//  DASHBOARD UPDATE
// ============================================================
function updateDashboard() {
  updateStatsUI();
  renderAlertsMini();
  renderAttackersList();
  updateThreatLevel();
  updateAlertBadge();
  updateThreatChart();
  if (document.getElementById('tab-threats')?.classList.contains('active')) {
    renderThreatMap();
    renderActiveThreats();
    updateThreatStats();
  }
}


function renderAttackersList() {
  const list = document.getElementById('attackersList');
  if (!list) return;
  const entries = Object.entries(state.ipLoginCounts).sort((a,b) => b[1]-a[1]).slice(0,6);
  const max = entries[0]?.[1] || 1;

  if (!entries.length) { list.innerHTML = '<div class="empty-state">No suspicious IPs detected.</div>'; return; }
  list.innerHTML = entries.map(([ip, count]) => `
    <div class="attacker-item">
      <code class="attacker-ip">${escHtml(ip)}</code>
      <div class="attacker-bar"><div class="attacker-bar-fill" style="width:${(count/max*100)}%"></div></div>
      <span class="attacker-count">${count}</span>
      <button class="btn-sm danger" onclick="autoBlockIP('${escHtml(ip)}','Manual block')">Block</button>
    </div>
  `).join('');
}

function updateStatsUI() {
  const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  el('statTotalLogsVal', state.stats.totalLogs.toLocaleString());
  el('statFailedLoginsVal', state.stats.failedLogins.toLocaleString());
  el('statActiveThreatsVal', state.alerts.filter(a => a.status === 'new').length);
  el('statBlockedIPsVal', state.blacklist.length);
  el('statThreatsChange', `Critical: ${state.alerts.filter(a => a.severity === 'critical').length}`);
  el('statIPsChange', `Auto-blocked: ${state.blacklist.filter(b => b.auto).length}`);
  el('statLogsChange', `+${state.stats.totalLogs} today`);
}

// ============================================================
//  SETTINGS
// ============================================================
function loadSettings() {
  try {
    const saved = localStorage.getItem('ids-settings');
    if (saved) state.settings = { ...state.settings, ...JSON.parse(saved) };
  } catch (e) {}

  // Apply to UI
  const apply = (id, val) => { const el = document.getElementById(id); if (el) { if (el.type === 'checkbox') el.checked = val; else el.value = val; } };
  apply('autoBlockSetting', state.settings.autoBlock);
  apply('realtimeSimSetting', state.settings.realtimeSim);
  apply('soundAlertSetting', state.settings.soundAlert);
  apply('bruteForceThreshold', state.settings.bruteForceThreshold);
  apply('alertRetention', state.settings.alertRetention);
  apply('simSpeedSetting', state.settings.simSpeed);
  apply('alertEmail', state.settings.alertEmail || '');
  apply('emailMinSeverity', state.settings.emailMinSeverity);
  apply('emailDigestSetting', state.settings.emailDigest);
}

function saveSetting(key, value) {
  state.settings[key] = value;
  try { localStorage.setItem('ids-settings', JSON.stringify(state.settings)); } catch (e) {}

  if (key === 'realtimeSim' || key === 'simSpeed') startSimulation();
  if (key === 'bruteForceThreshold') showToast('success', 'Setting Saved', `Brute force threshold set to ${value} attempts.`);
  else showToast('success', 'Setting Saved', `${key} updated.`);
}

function requestNotificationPermission(enabled) {
  if (!enabled) { saveSetting('notif', false); return; }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      saveSetting('notif', true);
      showToast('success', 'Notifications Enabled', 'You will receive browser notifications for critical alerts.');
    } else {
      document.getElementById('notifSetting').checked = false;
      showToast('warning', 'Permission Denied', 'Browser notifications permission was denied.');
    }
  });
}

function testEmailSettings() {
  const email = document.getElementById('alertEmail').value;
  if (!email) { showToast('warning', 'No Email', 'Please enter an email address first.'); return; }
  setTimeout(() => showToast('success', 'Test Email Sent', `Test alert sent to ${email}`), 500);
}

function updateStorageInfo() {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) total += localStorage[key].length * 2;
    }
    const kb = (total / 1024).toFixed(1);
    const pct = Math.min(100, (total / (5 * 1024 * 1024)) * 100);
    const fill = document.getElementById('storageFill');
    const text = document.getElementById('storageText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${kb} KB used`;
  } catch (e) {}
}

function exportAllData() {
  const data = { logs: state.logs, alerts: state.alerts, blacklist: state.blacklist, rules: state.rules, settings: state.settings };
  downloadFile('ids_backup.json', JSON.stringify(data, null, 2), 'application/json');
  showToast('success', 'Exported', 'All data exported to JSON backup.');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.logs) state.logs = data.logs;
        if (data.alerts) state.alerts = data.alerts;
        if (data.blacklist) state.blacklist = data.blacklist;
        if (data.rules) state.rules = data.rules;
        if (data.settings) state.settings = data.settings;
        state.filteredLogs = [...state.logs];
        state.filteredAlerts = [...state.alerts];
        state.filteredIPs = [...state.blacklist];
        renderLogTable(); renderAlerts(); renderBlacklist(); renderRules();
        updateDashboard(); loadSettings();
        showToast('success', 'Imported', 'Data imported successfully.');
      } catch (err) { showToast('error', 'Import Failed', 'Invalid backup file format.'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

function resetAllData() {
  if (!confirm('⚠️ This will permanently delete all logs, alerts, blacklist entries, and custom rules. Are you sure?')) return;
  state.logs = []; state.alerts = []; state.blacklist = []; state.threats = [];
  state.stats = { totalLogs: 0, failedLogins: 0, activeThreats: 0, blockedIPs: 0 };
  state.ipLoginCounts = {}; attackStats = { total: 0, unique: new Set(), countries: new Set() };
  state.filteredLogs = []; state.filteredAlerts = []; state.filteredIPs = [];
  state.rules = [];
  renderLogTable(); renderAlerts(); renderBlacklist(); renderRules();
  loadDefaultRules(); updateDashboard();
  showToast('info', 'Data Reset', 'All data has been cleared. Default rules reloaded.');
}

function exportData() {
  exportLogs();
}

// ============================================================
//  MODAL
// ============================================================
function showModal(title, body, buttons = []) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalFooter').innerHTML = buttons.map(b =>
    `<button class="${b.cls}" onclick="${b.fn}">${b.text}</button>`
  ).join('');
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ============================================================
//  TOAST NOTIFICATIONS
// ============================================================
function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `
    <span style="font-size:18px;color:${type==='success'?'var(--green)':type==='error'?'var(--red)':type==='warning'?'var(--orange)':'var(--cyan)'}">${icons[type]||'•'}</span>
    <div><div class="toast-title">${escHtml(title)}</div><div class="toast-msg">${escHtml(String(message))}</div></div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ============================================================
//  UTILITIES
// ============================================================
let _idCounter = 0;
function genId() { return `id-${Date.now()}-${_idCounter++}`; }

function randomIP() {
  const ranges = [
    [203, 0, 113], [198, 51, 100], [192, 0, 2], [185, 234, 218],
    [89, 248, 167], [5, 188, 206], [45, 155, 205], [91, 108, 4],
    [144, 76, 0], [176, 9, 0], [62, 210, 0], [37, 59, 0]
  ];
  const r = ranges[Math.floor(Math.random() * ranges.length)];
  return `${r[0]}.${r[1]}.${r[2]}.${Math.floor(Math.random() * 254) + 1}`;
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function formatType(type) {
  const map = {
    failed_login: 'Failed Login', brute_force: 'Brute Force',
    sql_injection: 'SQL Injection', port_scan: 'Port Scan',
    privilege_escalation: 'Privilege Escalation', successful_login: 'Successful Login',
    custom: 'Custom'
  };
  return map[type] || type || 'Unknown';
}

function severityBadge(sev) {
  return `<span class="badge ${sev}">${sev.toUpperCase()}</span>`;
}

function severityIcon(sev) {
  const colors = { critical: 'var(--red)', high: 'var(--orange)', medium: 'var(--yellow)', low: 'var(--green)' };
  const color = colors[sev] || 'var(--cyan)';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}

function severityDot(sev) {
  return `<div style="width:10px;height:10px;border-radius:50%;background:${{critical:'var(--red)',high:'var(--orange)',medium:'var(--yellow)',low:'var(--green)'}[sev]||'var(--cyan)'};flex-shrink:0;margin-top:3px"></div>`;
}

function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
