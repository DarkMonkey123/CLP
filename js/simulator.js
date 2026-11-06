/**
 * AUTO TECH HUB — MOTOR CLP + LADDER (v2) + TAGS + TRACE + STEP + LINTER + CENÁRIOS ANIMADOS + INTEGRAÇÃO CATÁLOGO (FASE 4)
 * ---------------------------------------------------------------------------
 *  • Motor de varredura (scan) real: entradas digitais e analógicas → rungs → saídas
 *  • 5 Cenários Industriais Animados
 *  • Vínculo dinâmico de equipamentos do Catálogo a canais de E/S (I0.x / Q0.x)
 *  • Lógica de contato elétrico adaptativa (NA / NF)
 *  • Exportação de vínculos de E/S para a BOM e JSON do programa
 * ---------------------------------------------------------------------------
 */
(function () {
  'use strict';

  /* ========================================================================
   * 0. CONFIGURAÇÃO E UTILITÁRIOS
   * ====================================================================== */
  const CONFIG = {
    scanTimeMs: 50,
    maxParallelDepth: 3,
    maxBranches: 6,
    historyLimit: 100,
    holdMs: 70,
    storageKey: 'autotech.ladder.v2',
    memory: { I: 8, Q: 8, M: 8, T: 10, C: 10, IW: 2, MW: 10 }
  };

  const TYPE_META = {
    NO:     { symbol: '|  |',   name: 'Contato NA',    areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    NC:     { symbol: '| / |',  name: 'Contato NF',    areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    P_EDGE: { symbol: '| P |',  name: 'Pulso (borda)', areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    COIL:   { symbol: '(  )',   name: 'Bobina Direta', areas: ['Q', 'M'],                kind: 'output' },
    SET:    { symbol: '( S )',  name: 'Bobina SET',    areas: ['Q', 'M'],                kind: 'output' },
    RESET:  { symbol: '( R )',  name: 'Bobina RESET',  areas: ['Q', 'M', 'C'],           kind: 'output' },
    TON:    { symbol: '[ TON ]', name: 'Temporizador TON', areas: ['T'],                 kind: 'block' },
    TOF:    { symbol: '[ TOF ]', name: 'Temporizador TOF', areas: ['T'],                 kind: 'block' },
    TP:     { symbol: '[ TP ]',  name: 'Temporizador TP',  areas: ['T'],                 kind: 'block' },
    CTU:    { symbol: '[ CTU ]', name: 'Contador CTU',     areas: ['C'],                 kind: 'block' },
    CTD:    { symbol: '[ CTD ]', name: 'Contador CTD',     areas: ['C'],                 kind: 'block' },

    EQU:    { symbol: '[ = ]',   name: 'Comparador EQU', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },
    NEQ:    { symbol: '[ != ]',  name: 'Comparador NEQ', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },
    GRT:    { symbol: '[ > ]',   name: 'Comparador GRT', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },
    LES:    { symbol: '[ < ]',   name: 'Comparador LES', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },
    GEQ:    { symbol: '[ >= ]',  name: 'Comparador GEQ', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },
    LEQ:    { symbol: '[ <= ]',  name: 'Comparador LEQ', areas: ['IW', 'MW', 'C', 'T'], kind: 'contact' },

    ADD:    { symbol: '[ + ]',   name: 'Soma (ADD)',       areas: ['MW'],                kind: 'block' },
    SUB:    { symbol: '[ - ]',   name: 'Subtração (SUB)',  areas: ['MW'],                kind: 'block' },
    MUL:    { symbol: '[ * ]',   name: 'Multiplicação (MUL)', areas: ['MW'],             kind: 'block' },
    DIV:    { symbol: '[ / ]',   name: 'Divisão (DIV)',    areas: ['MW'],                kind: 'block' },
    MOVE:   { symbol: '[ MOV ]', name: 'Mover (MOVE)',     areas: ['MW'],                kind: 'block' }
  };

  let idCounter = 0;
  const uid = (prefix = 'n') => `${prefix}${Date.now().toString(36)}${(idCounter++).toString(36)}`;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const blankBits = (n) => Array.from({ length: n }, () => false);

  function bindOnce(el, key, fn) {
    if (!el) return;
    const flag = `__ladderBound_${key}`;
    if (el[flag]) return;
    el[flag] = true;
    fn(el);
  }

  const addressCache = new Map();

  function parseAddress(raw) {
    const key = String(raw ?? '');
    if (addressCache.has(key)) return addressCache.get(key);

    const text = key.toUpperCase().replace(/\s+/g, '');
    let result = null;
    let m = text.match(/^([IQM])0\.(\d{1,2})$/);
    if (m) {
      const idx = parseInt(m[2], 10);
      if (idx < CONFIG.memory[m[1]]) result = { tag: `${m[1]}0.${idx}`, area: m[1], index: idx };
    } else {
      m = text.match(/^(IW|MW)(\d{1,2})$/);
      if (m) {
        const idx = parseInt(m[2], 10);
        if (idx < CONFIG.memory[m[1]]) result = { tag: `${m[1]}${idx}`, area: m[1], index: idx };
      } else {
        m = text.match(/^([TC])(\d{1,2})$/);
        if (m) {
          const idx = parseInt(m[2], 10);
          if (idx < CONFIG.memory[m[1]]) result = { tag: `${m[1]}${idx}`, area: m[1], index: idx };
        }
      }
    }
    if (addressCache.size > 500) addressCache.clear();
    addressCache.set(key, result);
    return result;
  }

  function areaRangeText(area) {
    const n = CONFIG.memory[area];
    if (area === 'T' || area === 'C' || area === 'IW' || area === 'MW') return `${area}0–${area}${n - 1}`;
    return `${area}0.0–${area}0.${n - 1}`;
  }

  /* ========================================================================
   * GESTÃO DE TAGS & VÍNCULOS COM O CATÁLOGO (FASE 4)
   * ====================================================================== */
  const defaultTags = {
    "I0.0": { name: "BOTAO_LIGA", comment: "Botoeira de partida" },
    "I0.1": { name: "BOTAO_DESLIGA", comment: "Botoeira de parada" },
    "I0.2": { name: "SENSOR_PECA", comment: "Sensor de presença" },
    "I0.3": { name: "EMERGENCIA", comment: "Botão de emergência" },
    "I0.4": { name: "CHAVE_MAN_AUTO", comment: "Chave seletora" },
    "I0.5": { name: "RELE_TERMICO", comment: "Falha térmica motor" },
    "I0.6": { name: "FIM_CURSO_AV", comment: "Sensor avanço / fechado" },
    "I0.7": { name: "FIM_CURSO_REC", comment: "Sensor recuo / aberto" },
    "IW0":  { name: "SENSOR_PRESSAO", comment: "Transmissor de pressão (0-10V)" },
    "IW1":  { name: "SENSOR_NIVEL", comment: "Transmissor de nível (4-20mA)" },
    "Q0.0": { name: "MOTOR_01", comment: "Contatora motor principal / Esteira" },
    "Q0.1": { name: "VALVULA_AVANCO", comment: "Solenoide avanço / bomba" },
    "Q0.2": { name: "VALVULA_RECUO", comment: "Solenoide recuo" },
    "Q0.3": { name: "SINALEIRO_VERDE", comment: "Lâmpada em operação" },
    "Q0.4": { name: "SINALEIRO_VERM", comment: "Lâmpada de falha" },
    "Q0.5": { name: "ESTEIRA", comment: "Motor da esteira" },
    "Q0.6": { name: "ALARME_SONORO", comment: "Sirene de aviso" },
    "Q0.7": { name: "RELE_SEGURANCA", comment: "Habilitação geral" }
  };
  let currentTags = JSON.parse(JSON.stringify(defaultTags));

  function getTagName(address) {
    if (currentTags[address] && currentTags[address].name && currentTags[address].name.trim() !== '') {
      return currentTags[address].name;
    }
    return address;
  }

  /* ========================================================================
   * 1. CENÁRIOS DE PROCESSO ANIMADOS
   * ====================================================================== */
  const N = (type, target, extra = {}) => Object.assign({ id: uid(), type, target }, extra);
  const PAR = (...branches) => ({ id: uid(), type: 'PARALLEL', branches });
  const RUNG = (comment, nodes = []) => ({ id: uid('r'), comment, nodes });

  const SCENARIOS = {
    conveyor: {
      id: 'conveyor',
      name: 'Esteira com Sensor de Presença',
      table: [
        { addr: 'I0.0', tag: 'BOTAO_LIGA', desc: 'Botoeira NA de partida da esteira' },
        { addr: 'I0.1', tag: 'BOTAO_DESLIGA', desc: 'Botoeira NF de parada' },
        { addr: 'I0.2', tag: 'SENSOR_PECA', desc: 'Sensor fotoelétrico na esteira' },
        { addr: 'Q0.0', tag: 'MOTOR_ESTEIRA', desc: 'Motor elétrico da esteira' }
      ],
      build: () => [
        RUNG('Partida direta da esteira com retenção (selo): I0.0 liga, I0.1 desliga', [
          N('NC', 'I0.1'), PAR([N('NO', 'I0.0')], [N('NO', 'Q0.0')]), N('COIL', 'Q0.0')
        ])
      ]
    },
    tank: {
      id: 'tank',
      name: 'Tanque de Nível com Boias & Analógico',
      table: [
        { addr: 'I0.0', tag: 'BOIA_MINIMA', desc: 'Boia de nível baixo (liga ao ter água)' },
        { addr: 'I0.1', tag: 'BOIA_MAXIMA', desc: 'Boia de nível alto (liga quando cheio)' },
        { addr: 'IW0',  tag: 'SENSOR_NIVEL', desc: 'Sensor ultrassónico analógico (0-1000)' },
        { addr: 'Q0.0', tag: 'BOMBA_ENCHIMENTO', desc: 'Bomba de entrada de água' },
        { addr: 'Q0.1', tag: 'VALVULA_DRAINO', desc: 'Válvula solenoide de saída' }
      ],
      build: () => [
        RUNG('Liga a bomba se o nível estiver abaixo da boia mínima e desliga no nível máximo', [
          N('NC', 'I0.1'), PAR([N('NC', 'I0.0')], [N('NO', 'Q0.0')]), N('COIL', 'Q0.0')
        ])
      ]
    },
    cylinder: {
      id: 'cylinder',
      name: 'Cilindro Pneumático com Fins de Curso',
      table: [
        { addr: 'I0.0', tag: 'BOTAO_AVANCO', desc: 'Botoeira para iniciar avanço' },
        { addr: 'I0.7', tag: 'FIM_CURSO_REC', desc: 'Sensor de cilindro recuado' },
        { addr: 'I0.6', tag: 'FIM_CURSO_AV', desc: 'Sensor de cilindro avançado' },
        { addr: 'Q0.1', tag: 'SOLENOIDE_AVANCO', desc: 'Válvula 5/2 via avanço' },
        { addr: 'Q0.2', tag: 'SOLENOIDE_RECUO', desc: 'Válvula 5/2 via recuo' }
      ],
      build: () => [
        RUNG('Avança o cilindro ao premir I0.0 (SET)', [N('NO', 'I0.0'), N('NO', 'I0.7'), N('SET', 'Q0.1'), N('RESET', 'Q0.2')]),
        RUNG('Recua o cilindro automaticamente ao atingir o fim de curso avançado I0.6 (RESET)', [N('NO', 'I0.6'), N('RESET', 'Q0.1'), N('SET', 'Q0.2')])
      ]
    },
    gate: {
      id: 'gate',
      name: 'Portão Automático de Acesso',
      table: [
        { addr: 'I0.0', tag: 'CONTROLO_ABRIR', desc: 'Comando para abrir portão' },
        { addr: 'I0.1', tag: 'CONTROLO_FECHAR', desc: 'Comando para fechar portão' },
        { addr: 'I0.6', tag: 'FIM_CURSO_FECHADO', desc: 'Sensor portão totalmente fechado' },
        { addr: 'I0.7', tag: 'FIM_CURSO_ABERTO', desc: 'Sensor portão totalmente aberto' },
        { addr: 'Q0.0', tag: 'MOTOR_ABRIR', desc: 'Motor no sentido de abertura' },
        { addr: 'Q0.1', tag: 'MOTOR_FECHAR', desc: 'Motor no sentido de fecho' }
      ],
      build: () => [
        RUNG('Abre o portão até atingir o fim de curso I0.7', [N('NC', 'I0.7'), N('NC', 'Q0.1'), PAR([N('NO', 'I0.0')], [N('NO', 'Q0.0')]), N('COIL', 'Q0.0')]),
        RUNG('Fecha o portão até atingir o fim de curso I0.6', [N('NC', 'I0.6'), N('NC', 'Q0.0'), PAR([N('NO', 'I0.1')], [N('NO', 'Q0.1')]), N('COIL', 'Q0.1')])
      ]
    },
    motor: {
      id: 'motor',
      name: 'Partida Direta de Motor com Relé Térmico',
      table: [
        { addr: 'I0.0', tag: 'BOTAO_START', desc: 'Botoeira verde NA' },
        { addr: 'I0.1', tag: 'BOTAO_STOP', desc: 'Botoeira vermelha NF' },
        { addr: 'I0.5', tag: 'RELE_TERMICO', desc: 'Contato NF do relé de sobrecarga' },
        { addr: 'Q0.0', tag: 'CONTATORA_KM1', desc: 'Contatora do motor elétrico' },
        { addr: 'Q0.4', tag: 'SINALEIRO_FALHA', desc: 'Lâmpada vermelha de falha' }
      ],
      build: () => [
        RUNG('Comando de partida do motor KM1 com selo e proteção térmica', [
          N('NC', 'I0.1'), N('NC', 'I0.5'), PAR([N('NO', 'I0.0')], [N('NO', 'Q0.0')]), N('COIL', 'Q0.0')
        ]),
        RUNG('Sinalização de sobrecarga do relé térmico em Q0.4', [N('NO', 'I0.5'), N('COIL', 'Q0.4')])
      ]
    }
  };

  const EXAMPLES = Object.assign({}, SCENARIOS);
  const ladderProgram = { rungs: SCENARIOS.conveyor.build() };

  /* ========================================================================
   * 2. ESTADO DA CPU, HARDWARE, FÍSICA E VÍNCULOS DE E/S (FASE 4)
   * ====================================================================== */
  const cpuState = {
    mode: 'RUN',
    scanTimeMs: CONFIG.scanTimeMs,
    scanLedState: false,
    scanCount: 0,

    I: blankBits(CONFIG.memory.I),
    Iimg: blankBits(CONFIG.memory.I),
    IW: [0, 0],
    Q: blankBits(CONFIG.memory.Q),
    M: blankBits(CONFIG.memory.M),
    MW: Array(CONFIG.memory.MW).fill(0),

    T: {},
    C: {},
    edgeMemory: {},

    inputModes: Array.from({ length: CONFIG.memory.I }, () => 'BUTTON'),
    
    // FASE 4: Vínculos com equipamentos do Catálogo { "I0.2": "sensor-indutivo-pnp", "Q0.1": "contator-3pole" }
    linkedEquipments: {},

    activeScenario: 'conveyor',
    scenarioPhysics: {
      boxPos: 10,
      tankLevel: 30,
      cylinderPos: 0,
      gatePos: 0,
      motorAngle: 0
    }
  };

  let editingNode = null;
  let selectedNodeId = null;
  let activeRungId = null;
  let activeLinkingAddress = null;

  function findRung(id) {
    return ladderProgram.rungs.find((r) => r.id === id) || null;
  }

  function locateIn(nodes, id, depth) {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.id === id) return { array: nodes, index: i, node: n, depth };
      if (n.type === 'PARALLEL') {
        for (const branch of n.branches) {
          const r = locateIn(branch, id, depth + 1);
          if (r) return r;
        }
      }
    }
    return null;
  }

  function locateNode(id) {
    for (const rung of ladderProgram.rungs) {
      const r = locateIn(rung.nodes, id, 0);
      if (r) { r.rung = rung; return r; }
    }
    return null;
  }

  function walkNodes(nodes, fn, ctx) {
    nodes.forEach((n, i) => {
      fn(n, nodes, i, ctx);
      if (n.type === 'PARALLEL') n.branches.forEach((b) => walkNodes(b, fn, ctx));
    });
  }

  function ensureTimer(tag, pt) {
    if (!cpuState.T[tag]) cpuState.T[tag] = { acc: 0, pt: pt || 3, dn: false, active: false };
    return cpuState.T[tag];
  }
  function ensureCounter(tag, pv) {
    if (!cpuState.C[tag]) cpuState.C[tag] = { cv: 0, pv: pv || 3, dn: false, lastInput: false };
    return cpuState.C[tag];
  }
  function syncMemoryWithProgram() {
    ladderProgram.rungs.forEach((rung) => walkNodes(rung.nodes, (n) => {
      if (['TON', 'TOF', 'TP'].includes(n.type)) ensureTimer(n.target, n.pt).pt = n.pt;
      if (['CTU', 'CTD'].includes(n.type)) ensureCounter(n.target, n.pv).pv = n.pv;
    }));
  }

  // FASE 4: Identificador do Tipo de Contato Elétrico do Equipamento (NA vs NF)
  function getEquipmentContactType(eqId) {
    if (!eqId || typeof CatalogModule === 'undefined') return 'NA';
    const all = CatalogModule.getAllEquipments();
    const eq = all.find(e => e.id === eqId);
    if (!eq) return 'NA';

    const text = `${eq.name} ${eq.outputType || ''} ${eq.purpose || ''} ${JSON.stringify(eq.specsTable || {})}`.toUpperCase();
    if (text.includes(' NF') || text.includes('NC') || text.includes('FECHADO') || text.includes('NORMALLY CLOSED')) {
      return 'NF';
    }
    return 'NA';
  }

  /* ========================================================================
   * 3. MOTOR DE FÍSICA DOS CENÁRIOS INDUSTRIAIS
   * ====================================================================== */
  const ScenarioEngine = {
    update(dt) {
      const sc = cpuState.activeScenario;
      const phys = cpuState.scenarioPhysics;
      if (sc === 'none' || cpuState.mode === 'STOP') return;

      if (sc === 'conveyor') {
        if (cpuState.Q[0]) {
          phys.boxPos += dt * 35;
          if (phys.boxPos > 100) phys.boxPos = 0;
        }
        cpuState.I[2] = phys.boxPos >= 45 && phys.boxPos <= 55;
      }
      else if (sc === 'tank') {
        if (cpuState.Q[0]) phys.tankLevel = Math.min(100, phys.tankLevel + dt * 25);
        if (cpuState.Q[1]) phys.tankLevel = Math.max(0, phys.tankLevel - dt * 30);

        cpuState.I[0] = phys.tankLevel >= 15;
        cpuState.I[1] = phys.tankLevel >= 85;
        cpuState.IW[0] = Math.round((phys.tankLevel / 100) * 1000);
      }
      else if (sc === 'cylinder') {
        if (cpuState.Q[1]) phys.cylinderPos = Math.min(100, phys.cylinderPos + dt * 60);
        if (cpuState.Q[2]) phys.cylinderPos = Math.max(0, phys.cylinderPos - dt * 60);

        cpuState.I[7] = phys.cylinderPos <= 5;
        cpuState.I[6] = phys.cylinderPos >= 95;
      }
      else if (sc === 'gate') {
        if (cpuState.Q[0]) phys.gatePos = Math.min(100, phys.gatePos + dt * 30);
        if (cpuState.Q[1]) phys.gatePos = Math.max(0, phys.gatePos - dt * 30);

        cpuState.I[6] = phys.gatePos <= 5;
        cpuState.I[7] = phys.gatePos >= 95;
      }
      else if (sc === 'motor') {
        if (cpuState.Q[0]) {
          phys.motorAngle = (phys.motorAngle + dt * 500) % 360;
        }
      }
    },

    draw() {
      const svg = document.getElementById('scenario-svg');
      if (!svg) return;

      const sc = cpuState.activeScenario;
      const phys = cpuState.scenarioPhysics;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const textColor = isDark ? '#e2e8f0' : '#1e293b';

      if (sc === 'none') {
        svg.innerHTML = `<text x="300" y="100" text-anchor="middle" fill="${textColor}" font-size="14">Nenhum cenário ativo. Selecione um no menu acima.</text>`;
        return;
      }

      if (sc === 'conveyor') {
        const boxX = 60 + (phys.boxPos / 100) * 440;
        const sensorActive = cpuState.I[2];
        svg.innerHTML = `
          <rect x="50" y="130" width="500" height="20" rx="10" fill="#334155" />
          <circle cx="65" cy="140" r="8" fill="#64748b" />
          <circle cx="535" cy="140" r="8" fill="#64748b" />
          <line x1="300" y1="60" x2="300" y2="120" stroke="#94a3b8" stroke-width="4" />
          <rect x="290" y="70" width="20" height="25" rx="3" fill="${sensorActive ? '#10b981' : '#f59e0b'}" />
          <text x="300" y="60" text-anchor="middle" fill="${textColor}" font-size="11" font-weight="bold">Sensor I0.2</text>
          <rect x="${boxX - 25}" y="90" width="50" height="40" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />
          <text x="${boxX}" y="115" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">PEÇA</text>
          <circle cx="535" cy="140" r="14" fill="${cpuState.Q[0] ? '#10b981' : '#ef4444'}" opacity="0.8" />
          <text x="535" y="175" text-anchor="middle" fill="${textColor}" font-size="11">Motor Q0.0</text>`;
      }
      else if (sc === 'tank') {
        const h = (phys.tankLevel / 100) * 120;
        const y = 160 - h;
        svg.innerHTML = `
          <rect x="200" y="40" width="200" height="120" fill="none" stroke="#64748b" stroke-width="4" rx="4" />
          <rect x="202" y="${y}" width="196" height="${h}" fill="#0284c7" opacity="0.8" />
          <circle cx="380" cy="55" r="10" fill="${cpuState.I[1] ? '#10b981' : '#64748b'}" />
          <text x="440" y="60" fill="${textColor}" font-size="11">Boia Máx (I0.1)</text>
          <circle cx="380" cy="140" r="10" fill="${cpuState.I[0] ? '#10b981' : '#64748b'}" />
          <text x="440" y="145" fill="${textColor}" font-size="11">Boia Mín (I0.0)</text>
          <rect x="120" y="20" width="90" height="15" fill="${cpuState.Q[0] ? '#0284c7' : '#475569'}" />
          <text x="140" y="15" fill="${textColor}" font-size="11">Bomba Q0.0</text>
          <rect x="280" y="160" width="15" height="30" fill="${cpuState.Q[1] ? '#0284c7' : '#475569'}" />
          <text x="310" y="185" fill="${textColor}" font-size="11">Válvula Q0.1</text>
          <text x="300" y="100" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">${phys.tankLevel.toFixed(0)}% (${cpuState.IW[0]} un)</text>`;
      }
      else if (sc === 'cylinder') {
        const pW = (phys.cylinderPos / 100) * 180;
        svg.innerHTML = `
          <rect x="100" y="70" width="200" height="60" rx="6" fill="#334155" stroke="#94a3b8" stroke-width="3" />
          <rect x="300" y="90" width="${10 + pW}" height="20" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
          <rect x="${300 + pW}" y="80" width="15" height="40" rx="3" fill="#0284c7" />
          <circle cx="110" cy="50" r="8" fill="${cpuState.I[7] ? '#10b981' : '#64748b'}" />
          <text x="110" y="35" text-anchor="middle" fill="${textColor}" font-size="10">Recuado (I0.7)</text>
          <circle cx="490" cy="50" r="8" fill="${cpuState.I[6] ? '#10b981' : '#64748b'}" />
          <text x="490" y="35" text-anchor="middle" fill="${textColor}" font-size="10">Avançado (I0.6)</text>
          <rect x="140" y="150" width="50" height="25" fill="${cpuState.Q[1] ? '#10b981' : '#475569'}" rx="3" />
          <text x="165" y="167" text-anchor="middle" fill="#fff" font-size="10">Q0.1 (AV)</text>
          <rect x="230" y="150" width="50" height="25" fill="${cpuState.Q[2] ? '#10b981' : '#475569'}" rx="3" />
          <text x="255" y="167" text-anchor="middle" fill="#fff" font-size="10">Q0.2 (REC)</text>`;
      }
      else if (sc === 'gate') {
        const gX = (phys.gatePos / 100) * 180;
        svg.innerHTML = `
          <rect x="100" y="40" width="20" height="130" fill="#475569" />
          <rect x="480" y="40" width="20" height="130" fill="#475569" />
          <line x1="100" y1="165" x2="500" y2="165" stroke="#94a3b8" stroke-width="4" />
          <rect x="${120 + gX}" y="50" width="180" height="110" fill="#0284c7" opacity="0.8" stroke="#0369a1" stroke-width="3" rx="4" />
          <circle cx="130" cy="30" r="8" fill="${cpuState.I[6] ? '#10b981' : '#64748b'}" />
          <text x="130" y="18" text-anchor="middle" fill="${textColor}" font-size="10">Fechado (I0.6)</text>
          <circle cx="470" cy="30" r="8" fill="${cpuState.I[7] ? '#10b981' : '#64748b'}" />
          <text x="470" y="18" text-anchor="middle" fill="${textColor}" font-size="10">Aberto (I0.7)</text>
          <text x="300" y="185" text-anchor="middle" fill="${textColor}" font-size="11">Motor: ${cpuState.Q[0] ? 'ABRINDO (Q0.0)' : cpuState.Q[1] ? 'FECHANDO (Q0.1)' : 'PARADO'}</text>`;
      }
      else if (sc === 'motor') {
        const rad = (phys.motorAngle * Math.PI) / 180;
        const cx = 300; const cy = 100;
        const x2 = cx + 35 * Math.cos(rad);
        const y2 = cy + 35 * Math.sin(rad);
        svg.innerHTML = `
          <circle cx="${cx}" cy="${cy}" r="60" fill="#334155" stroke="#94a3b8" stroke-width="4" />
          <circle cx="${cx}" cy="${cy}" r="12" fill="#cbd5e1" />
          <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="5" stroke-linecap="round" />
          <rect x="420" y="70" width="120" height="60" rx="6" fill="${cpuState.I[5] ? '#ef4444' : '#10b981'}" />
          <text x="480" y="95" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">RELÉ TÉRMICO</text>
          <text x="480" y="115" text-anchor="middle" fill="#fff" font-size="10">I0.5 (Clique no I0.5 p/ falhar)</text>
          <text x="${cx}" y="180" text-anchor="middle" fill="${textColor}" font-size="12" font-weight="bold">KM1 (Q0.0): ${cpuState.Q[0] ? 'EM OPERAÇÃO' : 'DESLIGADO'}</text>`;
      }
    }
  };

  /* ========================================================================
   * 4. ANÁLISE DO PROGRAMA (LINTER INTERATIVO)
   * ====================================================================== */
  function analyzeProgram() {
    const out = { rung: {}, node: {}, list: [] };
    const warnRung = (rungId, msg, nodeRef) => {
      (out.rung[rungId] = out.rung[rungId] || []).push(msg);
      out.list.push({ rungId, msg, nodeRef });
    };

    const coils = {};
    ladderProgram.rungs.forEach((rung) => walkNodes(rung.nodes, (n) => {
      if (n.type === 'COIL') (coils[n.target] = coils[n.target] || []).push({ id: n.id, rungId: rung.id });
    }));

    Object.entries(coils).forEach(([tag, list]) => {
      if (list.length > 1) list.forEach((it) => {
        out.node[it.id] = `Bobina duplicada: ${tag} é acionada em mais de uma linha.`;
        warnRung(it.rungId, `Bobina duplicada em ${tag}`, it.id);
      });
    });

    ladderProgram.rungs.forEach((rung, rIdx) => {
      if (!rung.nodes.length) {
        warnRung(rung.id, `Linha ${rIdx + 1} está completamente vazia`, null);
        return;
      }
      let hasOutput = false;
      let emptyBranch = false;

      walkNodes(rung.nodes, (n) => {
        const meta = TYPE_META[n.type];
        if (meta && meta.kind !== 'contact') hasOutput = true;
        if (n.type === 'PARALLEL' && n.branches.some((b) => b.length === 0)) emptyBranch = true;
      });

      if (!hasOutput) warnRung(rung.id, `Linha ${rIdx + 1} sem saída (adicione uma bobina ou bloco)`, null);
      if (emptyBranch) warnRung(rung.id, `Linha ${rIdx + 1} possui um ramo paralelo vazio`, null);
    });

    Object.keys(out.rung).forEach((k) => { out.rung[k] = [...new Set(out.rung[k])]; });
    return out;
  }

  function renderLinterSummary(analysis) {
    const box = document.getElementById('ladder-linter-summary');
    const listEl = document.getElementById('linter-warnings-list');
    const countEl = document.getElementById('linter-count');
    if (!box || !listEl || !countEl) return;

    if (!analysis.list.length) {
      box.style.display = 'none';
      return;
    }

    box.style.display = 'block';
    countEl.textContent = analysis.list.length;
    listEl.innerHTML = analysis.list.map((item) => `
      <div style="font-size: 0.8rem; color: var(--text-primary); cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 4px; background: rgba(245, 158, 11, 0.1);"
           onclick="SimulatorModule.focusWarning('${item.rungId}', '${item.nodeRef || ''}')">
        ⚠️ ${esc(item.msg)}
      </div>`).join('');
  }

  /* ========================================================================
   * 5. MOTOR DE AVALIAÇÃO (SCAN CYCLE)
   * ====================================================================== */
  const LadderEvaluator = {
    lastTs: 0,

    resolveValue(raw) {
      if (raw === undefined || raw === null || raw === '') return 0;
      const str = String(raw).trim().toUpperCase();
      if (/^-?\d+(\.\d+)?$/.test(str)) return parseFloat(str);

      if (str.startsWith('IW')) {
        const idx = parseInt(str.slice(2), 10);
        return cpuState.IW[idx] || 0;
      }
      if (str.startsWith('MW')) {
        const idx = parseInt(str.slice(2), 10);
        return cpuState.MW[idx] || 0;
      }
      if (str.startsWith('T')) {
        const t = cpuState.T[str];
        return t ? t.acc : 0;
      }
      if (str.startsWith('C')) {
        const c = cpuState.C[str];
        return c ? c.cv : 0;
      }
      const p = parseAddress(str);
      if (p) {
        if (p.area === 'I') return cpuState.Iimg[p.index] ? 1 : 0;
        if (p.area === 'Q') return cpuState.Q[p.index] ? 1 : 0;
        if (p.area === 'M') return cpuState.M[p.index] ? 1 : 0;
      }
      return 0;
    },

    writeRegister(dest, val) {
      if (!dest) return;
      const str = String(dest).trim().toUpperCase();
      if (str.startsWith('MW')) {
        const idx = parseInt(str.slice(2), 10);
        if (idx >= 0 && idx < CONFIG.memory.MW) cpuState.MW[idx] = Math.round(val);
      }
    },

    readAddress(addr) {
      const p = parseAddress(addr);
      if (!p) return false;
      switch (p.area) {
        case 'I': return !!cpuState.Iimg[p.index];
        case 'Q': return !!cpuState.Q[p.index];
        case 'M': return !!cpuState.M[p.index];
        case 'T': return !!(cpuState.T[p.tag] && cpuState.T[p.tag].dn);
        case 'C': return !!(cpuState.C[p.tag] && cpuState.C[p.tag].dn);
        default: return false;
      }
    },

    writeAddress(addr, value) {
      const p = parseAddress(addr);
      if (!p) return;
      if (p.area === 'Q') cpuState.Q[p.index] = !!value;
      else if (p.area === 'M') cpuState.M[p.index] = !!value;
    },

    resetCounter(tag) {
      const c = cpuState.C[tag];
      if (c) { c.cv = 0; c.dn = false; }
    },

    evaluateSequence(nodes, inputFlow, results, seqKey, dt) {
      let flow = inputFlow;

      for (const node of nodes) {
        const inFlow = flow;
        let out = false;

        if (node.type === 'PARALLEL') {
          let any = false;
          node.branches.forEach((branch, i) => {
            const key = `${node.id}-b${i}`;
            let branchOut = branch.length === 0 ? false : this.evaluateSequence(branch, inFlow, results, key, dt);
            if (branch.length === 0) results[`seq:${key}`] = { outFlow: false };
            if (branchOut) any = true;
          });
          out = any;
          results[node.id] = { inFlow, outFlow: out };
        } else {
          out = this.executeNode(node, inFlow, dt);
          results[node.id] = { inFlow, outFlow: out, bit: this.readAddress(node.target) };
        }
        flow = out;
      }

      results[`seq:${seqKey}`] = { outFlow: flow };
      return flow;
    },

    executeNode(node, inFlow, dt) {
      const tag = node.target;

      switch (node.type) {
        case 'NO':  return inFlow && this.readAddress(tag);
        case 'NC':  return inFlow && !this.readAddress(tag);

        case 'P_EDGE': {
          const now = this.readAddress(tag);
          const prev = !!cpuState.edgeMemory[node.id];
          cpuState.edgeMemory[node.id] = now;
          return inFlow && now && !prev;
        }

        case 'COIL':  this.writeAddress(tag, inFlow); return inFlow;
        case 'SET':   if (inFlow) this.writeAddress(tag, true); return inFlow;
        case 'RESET':
          if (inFlow) {
            if (/^C/.test(tag)) this.resetCounter(tag);
            else this.writeAddress(tag, false);
          }
          return inFlow;

        case 'TON': {
          const t = ensureTimer(tag, node.pt);
          t.pt = node.pt;
          if (inFlow) {
            if (!t.dn) {
              t.acc = Math.min(t.pt, t.acc + dt);
              if (t.acc >= t.pt - 1e-9) { t.acc = t.pt; t.dn = true; }
            }
          } else { t.acc = 0; t.dn = false; }
          return inFlow && t.dn;
        }

        case 'TOF': {
          const t = ensureTimer(tag, node.pt);
          t.pt = node.pt;
          if (inFlow) {
            t.acc = 0;
            t.dn = true;
          } else {
            if (t.dn) {
              t.acc = Math.min(t.pt, t.acc + dt);
              if (t.acc >= t.pt - 1e-9) { t.acc = t.pt; t.dn = false; }
            }
          }
          return t.dn;
        }

        case 'TP': {
          const t = ensureTimer(tag, node.pt);
          t.pt = node.pt;
          const prevIn = !!cpuState.edgeMemory[`tp_${node.id}`];
          cpuState.edgeMemory[`tp_${node.id}`] = inFlow;

          if (inFlow && !prevIn && !t.active) {
            t.active = true;
            t.dn = true;
            t.acc = 0;
          }
          if (t.active) {
            t.acc = Math.min(t.pt, t.acc + dt);
            if (t.acc >= t.pt - 1e-9) { t.acc = t.pt; t.dn = false; t.active = false; }
          }
          return t.dn;
        }

        case 'CTU': {
          const c = ensureCounter(tag, node.pv);
          c.pv = node.pv;
          if (inFlow && !c.lastInput) c.cv = Math.min(9999, c.cv + 1);
          c.lastInput = inFlow;
          c.dn = c.cv >= c.pv;
          return inFlow && c.dn;
        }

        case 'CTD': {
          const c = ensureCounter(tag, node.pv);
          c.pv = node.pv;
          if (inFlow && !c.lastInput) c.cv = Math.max(0, c.cv - 1);
          c.lastInput = inFlow;
          c.dn = c.cv <= 0;
          return inFlow && c.dn;
        }

        case 'EQU': case 'NEQ': case 'GRT': case 'LES': case 'GEQ': case 'LEQ': {
          if (!inFlow) return false;
          const valA = this.resolveValue(node.inA);
          const valB = this.resolveValue(node.inB);
          let match = false;
          if (node.type === 'EQU') match = valA === valB;
          else if (node.type === 'NEQ') match = valA !== valB;
          else if (node.type === 'GRT') match = valA > valB;
          else if (node.type === 'LES') match = valA < valB;
          else if (node.type === 'GEQ') match = valA >= valB;
          else if (node.type === 'LEQ') match = valA <= valB;
          return match;
        }

        case 'ADD': case 'SUB': case 'MUL': case 'DIV': case 'MOVE': {
          if (inFlow) {
            const valA = this.resolveValue(node.inA);
            const valB = this.resolveValue(node.inB);
            let res = 0;
            if (node.type === 'ADD') res = valA + valB;
            else if (node.type === 'SUB') res = valA - valB;
            else if (node.type === 'MUL') res = valA * valB;
            else if (node.type === 'DIV') res = valB !== 0 ? valA / valB : 0;
            else if (node.type === 'MOVE') res = valA;

            this.writeRegister(node.target, res);
          }
          return inFlow;
        }

        default: return false;
      }
    },

    enterStop() {
      cpuState.Q.fill(false);
      Object.values(cpuState.T).forEach((t) => { t.acc = 0; t.dn = false; t.active = false; });
      cpuState.edgeMemory = {};
    },

    runScanCycle(dtOverride) {
      const now = performance.now();
      let dt = dtOverride !== undefined
        ? dtOverride
        : (this.lastTs ? (now - this.lastTs) / 1000 : cpuState.scanTimeMs / 1000);
      this.lastTs = now;
      dt = Math.min(Math.max(dt, 0), 0.25);

      if (cpuState.mode === 'STOP') { this.enterStop(); return {}; }

      cpuState.scanLedState = !cpuState.scanLedState;
      cpuState.scanCount++;
      cpuState.Iimg = cpuState.I.slice();

      const results = {};
      for (const rung of ladderProgram.rungs) {
        this.evaluateSequence(rung.nodes, true, results, rung.id, dt);
      }
      return results;
    }
  };

  /* ========================================================================
   * 6. DIAGRAMA DE TEMPO (TRACE TEMPORAL)
   * ====================================================================== */
  const TraceModule = {
    isRecording: true,
    isPaused: false,
    windowSeconds: 30,
    startTime: performance.now(),
    selectedChannels: ['I0.0', 'IW0', 'Q0.0', 'Q0.1', 'T0'],
    history: [],

    colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#ef4444', '#14b8a6'],

    init() {
      this.startTime = performance.now();
    },

    recordSample() {
      if (!this.isRecording || this.isPaused || cpuState.mode === 'STOP') return;
      const nowSec = (performance.now() - this.startTime) / 1000;

      const sampleValues = {};
      this.selectedChannels.forEach((addr) => {
        if (addr.startsWith('IW')) {
          const idx = parseInt(addr.slice(2), 10);
          sampleValues[addr] = cpuState.IW[idx] || 0;
        } else if (addr.startsWith('MW')) {
          const idx = parseInt(addr.slice(2), 10);
          sampleValues[addr] = cpuState.MW[idx] || 0;
        } else {
          const p = parseAddress(addr);
          if (!p) return;
          if (p.area === 'I') sampleValues[addr] = cpuState.Iimg[p.index] ? 1 : 0;
          else if (p.area === 'Q') sampleValues[addr] = cpuState.Q[p.index] ? 1 : 0;
          else if (p.area === 'M') sampleValues[addr] = cpuState.M[p.index] ? 1 : 0;
          else if (p.area === 'T') {
            const t = cpuState.T[addr] || { acc: 0, pt: 3, dn: false };
            sampleValues[addr] = { dn: t.dn ? 1 : 0, acc: t.acc || 0, pt: t.pt || 3 };
          } else if (p.area === 'C') {
            const c = cpuState.C[addr] || { cv: 0, pv: 3, dn: false };
            sampleValues[addr] = { dn: c.dn ? 1 : 0, cv: c.cv || 0, pv: c.pv || 3 };
          }
        }
      });

      this.history.push({ t: nowSec, values: sampleValues });

      const maxAge = this.windowSeconds + 5;
      while (this.history.length > 0 && (nowSec - this.history[0].t > maxAge)) {
        this.history.shift();
      }
    },

    clear() {
      this.history = [];
      this.startTime = performance.now();
      this.draw();
    },

    draw() {
      const canvas = document.getElementById('trace-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      const W = canvas.width;
      const H = canvas.height;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.fillRect(0, 0, W, H);

      const channels = this.selectedChannels;
      if (channels.length === 0) {
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum sinal selecionado. Clique em "⚙️ Sinais (Canais)" para escolher.', W / 2, H / 2);
        return;
      }

      const paddingLeft = 140;
      const paddingBottom = 30;
      const paddingTop = 15;
      const plotW = W - paddingLeft - 20;
      const plotH = H - paddingTop - paddingBottom;

      const numChannels = channels.length;
      const channelH = plotH / numChannels;

      const nowSec = (performance.now() - this.startTime) / 1000;
      const minTime = Math.max(0, nowSec - this.windowSeconds);
      const maxTime = Math.max(this.windowSeconds, nowSec);

      ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';

      const timeSteps = 6;
      for (let i = 0; i <= timeSteps; i++) {
        const tVal = minTime + (i / timeSteps) * (maxTime - minTime);
        const x = paddingLeft + (i / timeSteps) * plotW;
        
        ctx.beginPath();
        ctx.moveTo(x, paddingTop);
        ctx.lineTo(x, H - paddingBottom);
        ctx.stroke();

        ctx.fillText(`${tVal.toFixed(1)}s`, x, H - 10);
      }

      channels.forEach((addr, idx) => {
        const color = this.colors[idx % this.colors.length];
        const yTop = paddingTop + idx * channelH;
        const yBottom = yTop + channelH - 8;
        const signalH = channelH - 18;
        const yHigh = yBottom - signalH;
        const yLow = yBottom;

        const tagName = getTagName(addr);
        ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(tagName.slice(0, 12), paddingLeft - 10, yTop + 14);

        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(addr, paddingLeft - 10, yTop + 26);

        ctx.strokeStyle = isDark ? '#1e293b' : '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(paddingLeft, yBottom + 4);
        ctx.lineTo(W - 20, yBottom + 4);
        ctx.stroke();

        if (this.history.length === 0) return;

        const isAnalog = addr.startsWith('IW') || addr.startsWith('MW');

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        let prevX = null;
        let prevY = null;

        this.history.forEach((sample) => {
          const t = sample.t;
          if (t < minTime || t > maxTime) return;

          const x = paddingLeft + ((t - minTime) / (maxTime - minTime)) * plotW;
          let y;

          if (isAnalog) {
            const rawVal = sample.values[addr] || 0;
            const ratio = Math.min(1, Math.max(0, rawVal / 1000));
            y = yLow - ratio * signalH;
          } else {
            const val = sample.values[addr];
            const bitVal = typeof val === 'number' ? val : (val && val.dn ? 1 : 0);
            y = bitVal === 1 ? yHigh : yLow;
          }

          if (prevX === null) {
            ctx.moveTo(x, y);
          } else {
            if (isAnalog) ctx.lineTo(x, y);
            else { ctx.lineTo(x, prevY); ctx.lineTo(x, y); }
          }
          prevX = x;
          prevY = y;
        });

        if (prevX !== null && prevX < paddingLeft + plotW) {
          ctx.lineTo(paddingLeft + plotW, prevY);
        }

        ctx.stroke();
      });
    }
  };

  /* ========================================================================
   * 7. HISTÓRICO E PERSISTÊNCIA (COM SUPORTE A VÍNCULOS FASE 4)
   * ====================================================================== */
  const History = {
    past: [],
    future: [],
    snap() { return JSON.stringify(ladderProgram.rungs); },
    checkpoint() {
      this.past.push(this.snap());
      if (this.past.length > CONFIG.historyLimit) this.past.shift();
      this.future.length = 0;
    },
    undo() {
      if (!this.past.length) return false;
      this.future.push(this.snap());
      ladderProgram.rungs = JSON.parse(this.past.pop());
      return true;
    },
    redo() {
      if (!this.future.length) return false;
      this.past.push(this.snap());
      ladderProgram.rungs = JSON.parse(this.future.pop());
      return true;
    },
    clear() { this.past.length = 0; this.future.length = 0; }
  };

  function sanitizeRungs(rawRungs) {
    if (!Array.isArray(rawRungs) || rawRungs.length === 0) throw new Error('O arquivo não contém linhas.');
    const usedIds = new Set();
    const safeId = (id, prefix) => {
      let v = typeof id === 'string' && /^[\w-]{1,64}$/.test(id) ? id : uid(prefix);
      if (usedIds.has(v)) v = uid(prefix);
      usedIds.add(v);
      return v;
    };

    const cleanNodes = (nodes, depth) => {
      if (!Array.isArray(nodes)) throw new Error('Sequência de elementos inválida.');
      return nodes.map((n) => {
        if (!n || typeof n !== 'object') throw new Error('Elemento inválido.');
        if (n.type === 'PARALLEL') {
          return { id: safeId(n.id, 'n'), type: 'PARALLEL', branches: n.branches.map((b) => cleanNodes(b, depth + 1)) };
        }
        if (!TYPE_META[n.type]) throw new Error(`Tipo de elemento desconhecido: ${n.type}`);
        const clean = { id: safeId(n.id, 'n'), type: n.type, target: String(n.target || '').toUpperCase() };
        if (n.inA !== undefined) clean.inA = String(n.inA);
        if (n.inB !== undefined) clean.inB = String(n.inB);
        if (n.pt !== undefined) clean.pt = parseFloat(n.pt) || 3;
        if (n.pv !== undefined) clean.pv = parseInt(n.pv, 10) || 3;
        return clean;
      });
    };

    return rawRungs.map((r) => ({
      id: safeId(r && r.id, 'r'),
      comment: String((r && r.comment) || '').slice(0, 120),
      nodes: cleanNodes((r && r.nodes) || [], 0)
    }));
  }

  const Persistence = {
    save() {
      try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({
          version: 2,
          rungs: ladderProgram.rungs,
          inputModes: cpuState.inputModes,
          tags: currentTags,
          activeScenario: cpuState.activeScenario,
          linkedEquipments: cpuState.linkedEquipments
        }));
      } catch (e) { }
    },
    load() {
      try {
        const raw = localStorage.getItem(CONFIG.storageKey);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return {
          rungs: sanitizeRungs(data.rungs),
          inputModes: data.inputModes,
          tags: data.tags,
          activeScenario: data.activeScenario,
          linkedEquipments: data.linkedEquipments || {}
        };
      } catch (e) { return null; }
    }
  };

  /* ========================================================================
   * 8. RENDERIZADOR DA INTERFACE E E/S COM VÍNCULOS (FASE 4)
   * ====================================================================== */
  function subTextFor(node) {
    if (['TON', 'TOF', 'TP'].includes(node.type)) {
      const t = cpuState.T[node.target];
      return `${(t ? t.acc : 0).toFixed(1)}s / ${node.pt}s`;
    }
    if (['CTU', 'CTD'].includes(node.type)) {
      const c = cpuState.C[node.target];
      return `CV ${c ? c.cv : 0} / ${node.pv}`;
    }
    if (['EQU', 'NEQ', 'GRT', 'LES', 'GEQ', 'LEQ'].includes(node.type)) {
      const valA = LadderEvaluator.resolveValue(node.inA);
      const valB = LadderEvaluator.resolveValue(node.inB);
      return `${valA} vs ${valB}`;
    }
    if (['ADD', 'SUB', 'MUL', 'DIV', 'MOVE'].includes(node.type)) {
      const val = LadderEvaluator.resolveValue(node.target);
      return `= ${val}`;
    }
    return '';
  }

  const LadderRenderer = {
    cache: null,

    buildDOMStructure() {
      this.buildHardwarePanelDOM();
      this.buildScenarioPanelDOM();
      this.buildWorkspaceDOM();
    },

    buildScenarioPanelDOM() {
      const tableBox = document.getElementById('scenario-io-table');
      const scKey = cpuState.activeScenario;
      const sc = SCENARIOS[scKey];

      if (!tableBox || !sc) {
        if (tableBox) tableBox.innerHTML = '<p style="color: var(--text-secondary);">Nenhum cenário selecionado.</p>';
        return;
      }

      tableBox.innerHTML = `
        <h4 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--accent-color);">📋 Mapeamento de E/S</h4>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <th style="padding: 0.2rem;">End.</th>
              <th style="padding: 0.2rem;">Tag</th>
              <th style="padding: 0.2rem;">Descrição</th>
            </tr>
          </thead>
          <tbody>
            ${sc.table.map((row) => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="font-family: monospace; font-weight: bold; padding: 0.2rem;">${row.addr}</td>
                <td style="color: var(--accent-color); padding: 0.2rem;">${row.tag}</td>
                <td style="color: var(--text-secondary); padding: 0.2rem;">${row.desc}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    },

    buildHardwarePanelDOM() {
      const inputs = document.getElementById('plc-inputs-container');
      const allEquips = (typeof CatalogModule !== 'undefined' && typeof CatalogModule.getAllEquipments === 'function')
        ? CatalogModule.getAllEquipments()
        : [];

      if (inputs) {
        inputs.innerHTML = cpuState.I.map((_, idx) => {
          const addr = `I0.${idx}`;
          const eqId = cpuState.linkedEquipments[addr];
          const eq = allEquips.find(e => e.id === eqId);
          const contactType = getEquipmentContactType(eqId);

          return `
          <div class="io-card input-card ${eq ? 'is-linked' : ''}" data-input="${idx}" tabindex="0" role="button" aria-pressed="false"
               title="Segure para pressionar (modo BOTÃO) · clique no rótulo para alternar BOTÃO/CHAVE">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span class="io-label">I0.${idx}</span>
              <button type="button" class="btn-link-io" onclick="event.stopPropagation(); SimulatorModule.openLinkModal('I0.${idx}')"
                      title="Vincular equipamento do catálogo" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; color: var(--accent-color);">
                ${eq ? '🔗 ' + esc(eq.icon) : '🔗 +'}
              </button>
            </div>
            <span class="io-card-tag" title="${esc(currentTags[addr]?.comment || '')}">${esc(getTagName(addr))}</span>
            ${eq ? `
              <div style="font-size: 0.7rem; color: var(--accent-color); font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0.2rem 0;" title="${esc(eq.name)}">
                ${esc(eq.icon)} ${esc(eq.name.slice(0, 16))} <span style="font-size:0.65rem; opacity:0.8;">[${contactType}]</span>
              </div>` : ''}
            <div id="led-input-${idx}" class="led-indicator"></div>
            <button type="button" class="io-mode-btn" data-input-mode="${idx}"
                    title="Alterna entre BOTÃO e CHAVE">${cpuState.inputModes[idx] === 'SWITCH' ? 'CHAVE' : 'BOTÃO'}</button>
          </div>`;
        }).join('');
      }

      const analogBox = document.getElementById('plc-analog-container');
      if (analogBox) {
        analogBox.innerHTML = cpuState.IW.map((val, idx) => {
          const tag = `IW${idx}`;
          const volts = (val / 100).toFixed(1);
          const mA = (4 + (val / 1000) * 16).toFixed(1);
          return `
            <div class="io-card" style="padding: 0.6rem 0.8rem; background-color: var(--bg-primary); border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <span class="io-label" style="color: var(--accent-color); font-weight: bold;">${tag}</span>
                <span style="font-size: 0.75rem; font-family: monospace; color: var(--text-secondary);">${volts}V / ${mA}mA</span>
              </div>
              <span class="io-card-tag" style="display: block; font-size: 0.75rem; margin-bottom: 0.4rem;">${esc(getTagName(tag))}</span>
              <input type="range" min="0" max="1000" value="${val}" style="width: 100%; cursor: pointer;"
                     oninput="SimulatorModule.setAnalogInput(${idx}, this.value)" />
              <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.2rem;">
                <span>0</span>
                <strong style="color: var(--text-primary);">${val}</strong>
                <span>1000</span>
              </div>
            </div>`;
        }).join('');
      }

      const outputs = document.getElementById('plc-outputs-container');
      if (outputs) {
        outputs.innerHTML = cpuState.Q.map((_, idx) => {
          const addr = `Q0.${idx}`;
          const eqId = cpuState.linkedEquipments[addr];
          const eq = allEquips.find(e => e.id === eqId);

          return `
          <div class="io-card ${eq ? 'is-linked' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span class="io-label">Q0.${idx}</span>
              <button type="button" class="btn-link-io" onclick="SimulatorModule.openLinkModal('Q0.${idx}')"
                      title="Vincular equipamento do catálogo" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; color: var(--accent-color);">
                ${eq ? '🔗 ' + esc(eq.icon) : '🔗 +'}
              </button>
            </div>
            <span class="io-card-tag" title="${esc(currentTags[addr]?.comment || '')}">${esc(getTagName(addr))}</span>
            ${eq ? `
              <div style="font-size: 0.7rem; color: var(--accent-color); font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0.2rem 0;" title="${esc(eq.name)}">
                ${esc(eq.icon)} ${esc(eq.name.slice(0, 16))}
              </div>` : ''}
            <div id="led-output-${idx}" class="led-indicator"></div>
            <span class="io-sub">${eq ? esc(eq.name.slice(0, 12)) : 'CARGA'}</span>
          </div>`;
        }).join('');
      }

      this.updateOutputMonitor();
    },

    ensureShell(ws) {
      if (ws.querySelector('#ladder-rungs')) return;
      ws.innerHTML = `
        <div class="ladder-toolbar" id="ladder-toolbar">
          <button type="button" class="btn-tool" data-action="undo" title="Desfazer (Ctrl+Z)">↶ Desfazer</button>
          <button type="button" class="btn-tool" data-action="redo" title="Refazer (Ctrl+Y)">↷ Refazer</button>
          <span class="toolbar-sep"></span>
          <select id="ladder-examples" class="config-input-select toolbar-select" aria-label="Carregar exemplo">
            <option value="">📚 Exemplos prontos…</option>
            ${Object.entries(EXAMPLES).map(([k, v]) => `<option value="${k}">${esc(v.name || v.label)}</option>`).join('')}
          </select>
          <button type="button" class="btn-tool" data-action="export" title="Baixar o programa em JSON">⬇ Exportar</button>
          <button type="button" class="btn-tool" data-action="import" title="Carregar um programa JSON">⬆ Importar</button>
          <button type="button" class="btn-tool btn-tool-danger" data-action="clear" title="Apagar todas as linhas">🧹 Limpar</button>
          <input type="file" id="ladder-import-file" accept=".json,application/json" hidden>
        </div>
        <div class="ladder-hint-bar">Arraste da paleta · arraste os blocos para mover · duplo clique edita · Delete remove · Ctrl+Z desfaz</div>
        <div id="ladder-rungs" class="ladder-rungs"></div>`;
    },

    buildWorkspaceDOM() {
      const ws = document.getElementById('ladder-workspace');
      if (!ws) return;
      this.ensureShell(ws);

      const holder = ws.querySelector('#ladder-rungs');
      const warn = analyzeProgram();
      renderLinterSummary(warn);

      holder.innerHTML = ladderProgram.rungs.map((r, i) => this.rungHTML(r, i, warn)).join('');
      this.rebuildCache(holder);

      SimulatorModule.applySelectionClasses();
      SimulatorModule.updateToolbarState();
    },

    rungHTML(rung, rIdx, warn) {
      const warns = warn.rung[rung.id] || [];
      const body = rung.nodes.length
        ? this.seqHTML(rung.nodes, rung.id, rung.id, 0, warn)
        : '<span class="empty-rung-hint">Linha vazia - Arraste componentes aqui</span>';
      const commentText = rung.comment
        ? `// ${esc(rung.comment)}`
        : '// (sem comentário — duplo clique para escrever)';

      return `
      <div class="ladder-rung-wrapper" data-rung-id="${rung.id}">
        <div class="rung-header">
          <div class="rung-comment${rung.comment ? '' : ' is-empty'}" data-comment-for="${rung.id}" title="Duplo clique para editar">${commentText}</div>
          <div class="rung-tools">
            <button type="button" class="btn-rung-tool" data-action="move-rung" data-dir="-1" data-rung-id="${rung.id}" title="Subir linha" ${rIdx === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="btn-rung-tool" data-action="move-rung" data-dir="1" data-rung-id="${rung.id}" title="Descer linha" ${rIdx === ladderProgram.rungs.length - 1 ? 'disabled' : ''}>▼</button>
          </div>
        </div>
        <div class="ladder-rung" data-rung-id="${rung.id}">
          <div class="rung-number">${rIdx + 1}</div>
          <div class="rung-rail-left"></div>
          <div class="rung-elements-container" data-seq="root" data-rung-id="${rung.id}" data-depth="0">${body}</div>
          <div class="rung-rail-right"></div>
          <button type="button" class="btn-remove-rung" data-action="remove-rung" data-rung-id="${rung.id}" title="Excluir linha">🗑️</button>
        </div>
        ${warns.length ? `<div class="rung-warnings">${warns.map((w) => `<span>⚠ ${esc(w)}</span>`).join('')}</div>` : ''}
      </div>`;
    },

    seqHTML(nodes, seqKey, rungId, depth, warn) {
      return nodes.map((n) =>
        `<div class="rung-wire" data-wire-pre="${n.id}"></div>` +
        (n.type === 'PARALLEL' ? this.parallelHTML(n, rungId, depth, warn) : this.blockHTML(n, warn))
      ).join('') + `<div class="rung-wire" data-wire-end="${esc(seqKey)}"></div>`;
    },

    blockHTML(node, warn) {
      const meta = TYPE_META[node.type];
      const w = warn.node[node.id];
      const tagName = getTagName(node.target);
      const isNamed = tagName !== node.target;
      const displayTag = ['EQU', 'NEQ', 'GRT', 'LES', 'GEQ', 'LEQ', 'ADD', 'SUB', 'MUL', 'DIV', 'MOVE'].includes(node.type)
        ? `${node.inA || 'InA'} / ${node.inB || 'InB'} → ${node.target}`
        : node.target;

      return `
        <div class="ladder-block${w ? ' has-warning' : ''}" data-node-id="${node.id}" data-type="${node.type}" draggable="true">
          <button type="button" class="btn-delete-element" data-action="delete-node" data-node-id="${node.id}" title="Remover">×</button>
          <i class="bit-dot"></i>
          <span class="ladder-block-tag" style="font-size: 0.68rem; color: var(--accent-color);">${isNamed && !displayTag.includes('→') ? esc(tagName) : ''}</span>
          <span class="ladder-block-symbol">${meta.symbol}</span>
          <span class="ladder-block-tag" style="font-size: 0.72rem;">${esc(displayTag)}</span>
          <span class="ladder-block-sub"></span>
        </div>`;
    },

    parallelHTML(node, rungId, depth, warn) {
      const canRemoveBranch = node.branches.length > 2;
      const branches = node.branches.map((b, i) => {
        const key = `${node.id}-b${i}`;
        const inner = b.length
          ? this.seqHTML(b, key, rungId, depth + 1, warn)
          : '<span class="empty-branch-hint">+ solte aqui</span>';
        return `
          <div class="parallel-branch-line" data-seq="branch" data-rung-id="${rungId}" data-parallel-id="${node.id}" data-branch="${i}" data-depth="${depth + 1}">
            ${inner}
            ${canRemoveBranch ? `<button type="button" class="btn-remove-branch" data-action="remove-branch" data-node-id="${node.id}" data-branch="${i}" title="Remover este ramo">−</button>` : ''}
          </div>`;
      }).join('');

      return `
        <div class="parallel-group-container" data-node-id="${node.id}" data-type="PARALLEL" draggable="true">
          <button type="button" class="btn-delete-element" data-action="delete-node" data-node-id="${node.id}" title="Excluir ramo paralelo">×</button>
          ${branches}
          <button type="button" class="btn-add-branch" data-action="add-branch" data-node-id="${node.id}" title="Adicionar mais um ramo em paralelo">＋ ramo</button>
        </div>`;
    },

    rebuildCache(holder) {
      const cache = { nodes: {}, seqEnds: {}, rails: [], pre: {} };
      holder.querySelectorAll('[data-wire-pre]').forEach((el) => { cache.pre[el.dataset.wirePre] = el; });
      holder.querySelectorAll('[data-wire-end]').forEach((el) => { cache.seqEnds[el.dataset.wireEnd] = el; });
      cache.rails = Array.from(holder.querySelectorAll('.rung-rail-left'));
      holder.querySelectorAll('.ladder-block[data-node-id], .parallel-group-container[data-node-id]').forEach((el) => {
        const id = el.dataset.nodeId;
        const loc = locateNode(id);
        cache.nodes[id] = {
          el,
          parallel: el.classList.contains('parallel-group-container'),
          pre: cache.pre[id] || null,
          dot: el.querySelector(':scope > .bit-dot'),
          sub: el.querySelector(':scope > .ladder-block-sub'),
          node: loc ? loc.node : null
        };
      });
      this.cache = cache;
    },

    updateDynamicStates(results) {
      results = results || {};
      const running = cpuState.mode === 'RUN' || cpuState.mode === 'STEP';

      const lcdStatus = document.getElementById('plc-lcd-status-text');
      const scanLed = document.getElementById('plc-scan-led');
      if (lcdStatus) lcdStatus.textContent = `MODE: ${cpuState.mode}`;
      if (scanLed) scanLed.classList.toggle('active', running && cpuState.scanLedState);

      cpuState.I.forEach((val, idx) => {
        const led = document.getElementById(`led-input-${idx}`);
        if (led) led.classList.toggle('on', val);
        const inputCard = document.querySelector(`.input-card[data-input="${idx}"]`);
        if (inputCard) {
          inputCard.setAttribute('aria-pressed', String(!!val));
          inputCard.classList.toggle('is-active', !!val);
        }
      });
      cpuState.Q.forEach((val, idx) => {
        const led = document.getElementById(`led-output-${idx}`);
        if (led) led.classList.toggle('on', val);
      });
      this.updateOutputMonitor();

      const c = this.cache;
      if (!c) return;
      c.rails.forEach((r) => r.classList.toggle('energized', running));

      for (const id in c.nodes) {
        const ref = c.nodes[id];
        const res = results[id];
        const inF = !!(res && res.inFlow);
        const outF = !!(res && res.outFlow);

        if (ref.parallel) {
          ref.el.classList.toggle('in-on', inF);
          ref.el.classList.toggle('out-on', outF);
          ref.el.classList.toggle('energized', outF);
        } else {
          ref.el.classList.toggle('energized', outF);
          if (ref.dot) ref.dot.classList.toggle('on', !!(res && res.bit));
          if (ref.sub && ref.node) {
            const txt = subTextFor(ref.node);
            if (ref.sub.textContent !== txt) ref.sub.textContent = txt;
          }
        }
        if (ref.pre) ref.pre.classList.toggle('energized', inF);
      }
      for (const key in c.seqEnds) {
        const r = results[`seq:${key}`];
        c.seqEnds[key].classList.toggle('energized', !!(r && r.outFlow));
      }
    }
  };

  /* ========================================================================
   * 9. CONTROLADOR DO SIMULADOR E EVENTOS (COM FASE 4 VÍNCULOS)
   * ====================================================================== */
  let dragPayload = null;
  let dropMarker = null;
  let lastDropSeq = null;
  const pressedInputs = new Map();

  const SimulatorModule = {
    timerId: null,
    _globalBound: false,

    init() {
      const stored = Persistence.load();
      if (stored) {
        ladderProgram.rungs = stored.rungs;
        if (Array.isArray(stored.inputModes)) {
          cpuState.inputModes = cpuState.inputModes.map((m, i) => (stored.inputModes[i] === 'SWITCH' ? 'SWITCH' : 'BUTTON'));
        }
        if (stored.tags) {
          currentTags = Object.assign({}, defaultTags, stored.tags);
        }
        if (stored.activeScenario) {
          cpuState.activeScenario = stored.activeScenario;
          const sel = document.getElementById('select-scenario');
          if (sel) sel.value = stored.activeScenario;
        }
        if (stored.linkedEquipments) {
          cpuState.linkedEquipments = stored.linkedEquipments;
        }
      }
      syncMemoryWithProgram();
      TraceModule.init();
      this.bindEvents();
      LadderRenderer.buildDOMStructure();
      this.startLoop();
    },

    // FASE 4: MÉTODOS DE VÍNCULO DE EQUIPAMENTOS DO CATÁLOGO
    openLinkModal(address) {
      activeLinkingAddress = address;
      let modal = document.getElementById('modal-link-equipment');
      
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-link-equipment';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-card modal-large" style="max-width: 650px; background-color: var(--bg-primary); padding: 1.5rem; border-radius: 8px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 id="modal-link-title" style="margin: 0; color: var(--accent-color);">🔗 Vincular Equipamento do Catálogo</h3>
              <button class="modal-close" onclick="SimulatorModule.closeLinkModal()">&times;</button>
            </div>
            <div style="margin-bottom: 1rem;">
              <input type="text" id="modal-link-search" class="config-input-text" placeholder="Filtrar equipamentos por nome ou fabricante..." oninput="SimulatorModule.renderLinkOptions()">
            </div>
            <div id="modal-link-list" style="max-height: 350px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;"></div>
            <div style="display: flex; justify-content: space-between; margin-top: 1rem; align-items: center;">
              <button class="btn-plc btn-plc-reset" onclick="SimulatorModule.unlinkEquipment(activeLinkingAddress)">Desvincular Atual</button>
              <button class="btn-plc" onclick="SimulatorModule.closeLinkModal()">Fechar</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
      }

      document.getElementById('modal-link-title').textContent = `🔗 Vincular Equipamento em ${address}`;
      this.renderLinkOptions();
      modal.classList.add('active');
    },

    closeLinkModal() {
      document.getElementById('modal-link-equipment')?.classList.remove('active');
      activeLinkingAddress = null;
    },

    renderLinkOptions() {
      const container = document.getElementById('modal-link-list');
      const searchText = (document.getElementById('modal-link-search')?.value || '').toLowerCase();
      if (!container) return;

      const all = (typeof CatalogModule !== 'undefined' && typeof CatalogModule.getAllEquipments === 'function')
        ? CatalogModule.getAllEquipments()
        : [];

      const filtered = all.filter(e => e.name.toLowerCase().includes(searchText) || e.manufacturer.toLowerCase().includes(searchText));

      if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding:1rem;">Nenhum equipamento encontrado.</p>';
        return;
      }

      const currentLinked = cpuState.linkedEquipments[activeLinkingAddress];

      container.innerHTML = filtered.map(eq => {
        const isSelected = currentLinked === eq.id;
        const contactType = getEquipmentContactType(eq.id);
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.6rem 0.8rem; border-radius: 6px;">
            <div>
              <strong style="color: var(--text-primary);">${eq.icon} ${eq.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${eq.manufacturer} | Tensão: ${eq.voltage} | Contato: <strong>${contactType}</strong></div>
            </div>
            <button class="btn-plc ${isSelected ? 'btn-plc-run' : ''}" style="font-size: 0.8rem;" onclick="SimulatorModule.linkEquipment('${activeLinkingAddress}', '${eq.id}')">
              ${isSelected ? '✓ Vinculado' : 'Vincular'}
            </button>
          </div>`;
      }).join('');
    },

    linkEquipment(address, eqId) {
      cpuState.linkedEquipments[address] = eqId;
      const contactType = getEquipmentContactType(eqId);
      
      // Ajusta estado elétrico inicial conforme o tipo de contato (NF inicia ativado/true)
      const p = parseAddress(address);
      if (p && p.area === 'I') {
        cpuState.I[p.index] = (contactType === 'NF');
      }

      Persistence.save();
      LadderRenderer.buildHardwarePanelDOM();
      this.closeLinkModal();
      toast(`Equipamento vinculado a ${address} com sucesso!`);

      if (typeof CatalogModule !== 'undefined' && typeof CatalogModule.renderBOMTable === 'function') {
        CatalogModule.renderBOMTable();
      }
    },

    updateOutputMonitor() {
      const summary = document.getElementById('sim-output-summary');
      if (!summary) return;

      const activeInputs = cpuState.I
        .map((value, idx) => value ? `I0.${idx}` : null)
        .filter(Boolean);
      const activeOutputs = cpuState.Q
        .map((value, idx) => value ? `Q0.${idx}` : null)
        .filter(Boolean);
      const signature = JSON.stringify({
        mode: cpuState.mode,
        inputs: activeInputs,
        outputs: activeOutputs,
        inputTags: activeInputs.map(getTagName),
        outputTags: activeOutputs.map(getTagName)
      });
      const monitor = summary.closest('.sim-feedback-monitor');
      if (monitor?.dataset.stateSignature === signature) return;
      if (monitor) monitor.dataset.stateSignature = signature;

      const mode = document.getElementById('sim-feedback-mode');
      const count = document.getElementById('sim-output-count');
      if (mode) {
        mode.textContent = cpuState.mode;
        mode.dataset.mode = cpuState.mode;
      }
      if (count) count.textContent = `${activeOutputs.length} de ${cpuState.Q.length} saídas`;

      const renderSignals = (addresses) => addresses.length
        ? addresses.map((addr) => `
            <span class="sim-feedback-chip">
              <code>${esc(addr)}</code>
              <span>${esc(getTagName(addr))}</span>
            </span>`).join('')
        : '<span class="sim-feedback-empty">Nenhuma</span>';

      const message = cpuState.mode === 'STOP'
        ? 'CLP parado. Pressione RUN para executar a lógica.'
        : activeOutputs.length
          ? 'A lógica está acionando as saídas abaixo.'
          : activeInputs.length
            ? 'Entrada ativa, mas nenhuma saída está ligada. Confira a lógica Ladder.'
            : 'Acione uma entrada para acompanhar a resposta aqui.';

      summary.innerHTML = `
        <p class="sim-feedback-message">${message}</p>
        <div class="sim-feedback-row">
          <span class="sim-feedback-label">Entradas ativas</span>
          <div class="sim-feedback-signals">${renderSignals(activeInputs)}</div>
        </div>
        <div class="sim-feedback-row">
          <span class="sim-feedback-label">Saídas ligadas</span>
          <div class="sim-feedback-signals">${renderSignals(activeOutputs)}</div>
        </div>`;
      if (monitor) monitor.classList.toggle('has-active-output', activeOutputs.length > 0);
    },

    unlinkEquipment(address) {
      if (!address) address = activeLinkingAddress;
      if (address && cpuState.linkedEquipments[address]) {
        delete cpuState.linkedEquipments[address];
        const p = parseAddress(address);
        if (p && p.area === 'I') cpuState.I[p.index] = false;
        Persistence.save();
        LadderRenderer.buildHardwarePanelDOM();
        this.closeLinkModal();
        toast(`Vínculo de ${address} removido.`);

        if (typeof CatalogModule !== 'undefined' && typeof CatalogModule.renderBOMTable === 'function') {
          CatalogModule.renderBOMTable();
        }
      }
    },

    getLinkedEquipments() {
      return cpuState.linkedEquipments;
    },

    getLinkedBOMSummary() {
      const all = (typeof CatalogModule !== 'undefined' && typeof CatalogModule.getAllEquipments === 'function')
        ? CatalogModule.getAllEquipments()
        : [];
      const summary = [];

      Object.entries(cpuState.linkedEquipments).forEach(([addr, eqId]) => {
        const eq = all.find(e => e.id === eqId);
        if (eq) {
          summary.push({
            address: addr,
            equipment: eq
          });
        }
      });
      return summary;
    },

    selectScenario(scKey) {
      cpuState.activeScenario = scKey;
      const sc = SCENARIOS[scKey];
      if (sc) {
        sc.table.forEach((row) => {
          if (!currentTags[row.addr]) currentTags[row.addr] = {};
          currentTags[row.addr].name = row.tag;
          currentTags[row.addr].comment = row.desc;
        });
      }
      Persistence.save();
      LadderRenderer.buildDOMStructure();
      toast(sc ? `Cenário selecionado: ${sc.name}` : 'Modo Livre selecionado.');
    },

    loadCurrentScenarioPreset() {
      const sc = SCENARIOS[cpuState.activeScenario];
      if (!sc) { toast('Selecione um cenário industrial primeiro.'); return; }
      this.loadExample(cpuState.activeScenario);
    },

    setAnalogInput(index, value) {
      cpuState.IW[index] = parseInt(value, 10) || 0;
      LadderRenderer.buildHardwarePanelDOM();
    },

    startLoop() {
      this.stopLoop();
      this.timerId = setInterval(() => this.tick(), cpuState.scanTimeMs);
    },

    stopLoop() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = null;
    },

    tick(dt) {
      const dtSec = dt !== undefined ? dt : cpuState.scanTimeMs / 1000;
      if (cpuState.mode !== 'STEP') {
        const results = LadderEvaluator.runScanCycle(dtSec);
        ScenarioEngine.update(dtSec);
        LadderRenderer.updateDynamicStates(results);
        TraceModule.recordSample();
        TraceModule.draw();
      }
      ScenarioEngine.draw();
    },

    stepScan() {
      cpuState.mode = 'STEP';
      const dtSec = CONFIG.scanTimeMs / 1000;
      const results = LadderEvaluator.runScanCycle(dtSec);
      ScenarioEngine.update(dtSec);
      LadderRenderer.updateDynamicStates(results);
      TraceModule.recordSample();
      TraceModule.draw();
      ScenarioEngine.draw();
      toast('Varredura executada (1 Scan Cycle).');
    },

    focusWarning(rungId, nodeRef) {
      const rungEl = document.querySelector(`.ladder-rung-wrapper[data-rung-id="${CSS.escape(rungId)}"]`);
      if (!rungEl) return;
      rungEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      rungEl.style.outline = '2px solid #f59e0b';
      setTimeout(() => { rungEl.style.outline = 'none'; }, 2000);

      if (nodeRef) {
        selectedNodeId = nodeRef;
        this.applySelectionClasses();
      }
    },

    setMode(mode) {
      if (mode === cpuState.mode) return;
      cpuState.mode = mode;
      if (mode === 'RUN') { cpuState.edgeMemory = {}; LadderEvaluator.lastTs = 0; }
      else LadderEvaluator.enterStop();
      this.tick();
    },

    reset() {
      for (let i = 0; i < CONFIG.memory.I; i++) {
        const addr = `I0.${i}`;
        const eqId = cpuState.linkedEquipments[addr];
        const contactType = getEquipmentContactType(eqId);
        // Respeita o estado do contato elétrico vinculado (NF inicia ativado/true)
        cpuState.I[i] = (contactType === 'NF');
      }
      cpuState.IW = [0, 0];
      cpuState.Iimg.fill(false);
      cpuState.Q.fill(false);
      cpuState.M.fill(false);
      cpuState.MW.fill(0);
      cpuState.scenarioPhysics = { boxPos: 10, tankLevel: 30, cylinderPos: 0, gatePos: 0, motorAngle: 0 };
      Object.values(cpuState.T).forEach((t) => { t.acc = 0; t.dn = false; t.active = false; });
      Object.values(cpuState.C).forEach((c) => { c.cv = 0; c.dn = false; c.lastInput = false; });
      cpuState.edgeMemory = {};
      pressedInputs.clear();
      TraceModule.clear();
      this.commit();
      this.tick();
    },

    toggleInput(index) {
      cpuState.I[index] = !cpuState.I[index];
    },

    pressInput(idx) {
      if (cpuState.inputModes[idx] === 'SWITCH') { cpuState.I[idx] = !cpuState.I[idx]; return; }
      cpuState.I[idx] = true;
      pressedInputs.set(idx, performance.now());
    },

    releaseInput(idx) {
      if (!pressedInputs.has(idx)) return;
      const held = performance.now() - pressedInputs.get(idx);
      pressedInputs.delete(idx);
      const wait = Math.max(0, CONFIG.holdMs - held);
      setTimeout(() => {
        if (!pressedInputs.has(idx) && cpuState.inputModes[idx] === 'BUTTON') {
          const addr = `I0.${idx}`;
          const contactType = getEquipmentContactType(cpuState.linkedEquipments[addr]);
          cpuState.I[idx] = (contactType === 'NF');
        }
      }, wait);
    },

    releaseAllInputs() {
      Array.from(pressedInputs.keys()).forEach((i) => this.releaseInput(i));
    },

    toggleInputMode(idx) {
      cpuState.inputModes[idx] = cpuState.inputModes[idx] === 'SWITCH' ? 'BUTTON' : 'SWITCH';
      cpuState.I[idx] = false;
      pressedInputs.delete(idx);
      Persistence.save();
      LadderRenderer.buildHardwarePanelDOM();
    },

    commit() {
      syncMemoryWithProgram();
      Persistence.save();
      LadderRenderer.buildWorkspaceDOM();
    },

    addRung() {
      History.checkpoint();
      const rung = RUNG('Nova linha');
      ladderProgram.rungs.push(rung);
      activeRungId = rung.id;
      this.commit();
    },

    removeRung(ref) {
      const idx = typeof ref === 'number' ? ref : ladderProgram.rungs.findIndex((r) => r.id === ref);
      const rung = ladderProgram.rungs[idx];
      if (!rung) return;
      if (rung.nodes.length && !window.confirm(`Excluir a linha ${idx + 1}?`)) return;

      History.checkpoint();
      if (ladderProgram.rungs.length === 1) {
        rung.nodes = [];
        rung.comment = 'Nova linha';
      } else {
        ladderProgram.rungs.splice(idx, 1);
      }
      this.commit();
    },

    moveRung(id, dir) {
      const i = ladderProgram.rungs.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ladderProgram.rungs.length) return;
      History.checkpoint();
      const [r] = ladderProgram.rungs.splice(i, 1);
      ladderProgram.rungs.splice(j, 0, r);
      this.commit();
    },

    editComment(rungId, el) {
      const rung = findRung(rungId);
      if (!rung || !el) return;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'rung-comment-input';
      input.maxLength = 120;
      input.value = rung.comment || '';
      el.replaceChildren(input);
      input.focus();

      const finish = (save) => {
        if (save && input.value.trim() !== (rung.comment || '')) {
          History.checkpoint();
          rung.comment = input.value.trim();
          Persistence.save();
        }
        LadderRenderer.buildWorkspaceDOM();
      };
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') finish(true);
        else if (ev.key === 'Escape') finish(false);
      });
      input.addEventListener('blur', () => finish(true));
    },

    deleteNode(nodeId) {
      const loc = locateNode(nodeId);
      if (!loc) return;
      History.checkpoint();
      loc.array.splice(loc.index, 1);
      if (selectedNodeId === nodeId) selectedNodeId = null;
      this.commit();
    },

    addBranch(parallelId) {
      const loc = locateNode(parallelId);
      if (!loc || loc.node.type !== 'PARALLEL') return;
      History.checkpoint();
      loc.node.branches.push([]);
      this.commit();
    },

    removeBranch(parallelId, idx) {
      const loc = locateNode(parallelId);
      if (!loc || loc.node.type !== 'PARALLEL') return;
      if (loc.node.branches.length <= 2) return;
      History.checkpoint();
      loc.node.branches.splice(idx, 1);
      this.commit();
    },

    openTagsModal() {
      const tbody = document.getElementById('tags-table-body');
      if (!tbody) return;

      tbody.innerHTML = '';
      Object.keys(currentTags).sort().forEach((addr) => {
        const isInput = addr.startsWith('I');
        tbody.innerHTML += `
          <tr>
            <td style="font-family: monospace; font-weight: bold;">${addr}</td>
            <td><span class="category-badge" style="background:${isInput ? '#1e3a8a' : '#065f46'}; color: #fff;">${isInput ? 'Entrada' : 'Saída'}</span></td>
            <td><input type="text" id="tag-name-${addr}" value="${currentTags[addr].name || ''}" placeholder="Ex: MOTOR_01" /></td>
            <td><input type="text" id="tag-comment-${addr}" value="${currentTags[addr].comment || ''}" placeholder="Descrição" /></td>
          </tr>`;
      });
      document.getElementById('modal-tags-manager')?.classList.add('active');
    },

    closeTagsModal() {
      document.getElementById('modal-tags-manager')?.classList.remove('active');
    },

    saveTagsFromModal() {
      Object.keys(currentTags).forEach((addr) => {
        const nameInput = document.getElementById(`tag-name-${addr}`);
        const commentInput = document.getElementById(`tag-comment-${addr}`);
        if (nameInput) currentTags[addr].name = nameInput.value.trim().toUpperCase().replace(/\s+/g, '_');
        if (commentInput) currentTags[addr].comment = commentInput.value.trim();
      });

      this.closeTagsModal();
      Persistence.save();
      LadderRenderer.buildDOMStructure();
    },

    toggleTraceRecord() {
      TraceModule.isRecording = !TraceModule.isRecording;
      toast(TraceModule.isRecording ? 'Gravação do Trace iniciada.' : 'Gravação do Trace pausada.');
    },

    pauseTrace() {
      TraceModule.isPaused = !TraceModule.isPaused;
    },

    clearTrace() {
      TraceModule.clear();
      toast('Gráfico temporal limpo.');
    },

    setTraceWindow(seconds) {
      TraceModule.windowSeconds = parseFloat(seconds) || 30;
      TraceModule.draw();
    },

    openTraceChannelsModal() {
      const modal = document.getElementById('modal-trace-channels');
      const inBox = document.getElementById('trace-channels-inputs');
      const outBox = document.getElementById('trace-channels-outputs');
      if (!modal || !inBox || !outBox) return;

      inBox.innerHTML = '';
      outBox.innerHTML = '';

      for (let i = 0; i < CONFIG.memory.I; i++) {
        const addr = `I0.${i}`;
        const checked = TraceModule.selectedChannels.includes(addr) ? 'checked' : '';
        inBox.innerHTML += `
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <input type="checkbox" value="${addr}" ${checked}>
            <span>${addr} (${getTagName(addr)})</span>
          </label>`;
      }

      for (let i = 0; i < CONFIG.memory.IW; i++) {
        const addr = `IW${i}`;
        const checked = TraceModule.selectedChannels.includes(addr) ? 'checked' : '';
        inBox.innerHTML += `
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: var(--accent-color);">
            <input type="checkbox" value="${addr}" ${checked}>
            <span>${addr} (${getTagName(addr)})</span>
          </label>`;
      }

      for (let i = 0; i < CONFIG.memory.Q; i++) {
        const addr = `Q0.${i}`;
        const checked = TraceModule.selectedChannels.includes(addr) ? 'checked' : '';
        outBox.innerHTML += `
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <input type="checkbox" value="${addr}" ${checked}>
            <span>${addr} (${getTagName(addr)})</span>
          </label>`;
      }

      modal.classList.add('active');
    },

    closeTraceChannelsModal() {
      document.getElementById('modal-trace-channels')?.classList.remove('active');
    },

    saveTraceChannelsFromModal() {
      const modal = document.getElementById('modal-trace-channels');
      if (!modal) return;
      const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
      TraceModule.selectedChannels = Array.from(checkboxes).map((cb) => cb.value);
      this.closeTraceChannelsModal();
      TraceModule.draw();
      toast('Canais do diagrama de tempo atualizados.');
    },

    undo() {
      if (!History.undo()) return;
      selectedNodeId = null;
      this.commit();
    },

    redo() {
      if (!History.redo()) return;
      selectedNodeId = null;
      this.commit();
    },

    loadExample(key) {
      const ex = EXAMPLES[key];
      if (!ex) return;
      History.checkpoint();
      ladderProgram.rungs = ex.build();
      selectedNodeId = null;
      this.commit();
      toast(`Exemplo carregado: ${ex.name || ex.label}`);
    },

    clearProgram() {
      if (!window.confirm('Apagar todas as linhas do programa?')) return;
      History.checkpoint();
      ladderProgram.rungs = [RUNG('Nova linha')];
      selectedNodeId = null;
      this.commit();
    },

    exportProgram() {
      const data = JSON.stringify({
        format: 'autotech-ladder',
        version: 2,
        tags: currentTags,
        rungs: ladderProgram.rungs,
        inputModes: cpuState.inputModes,
        activeScenario: cpuState.activeScenario,
        linkedEquipments: cpuState.linkedEquipments
      }, null, 2);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'programa-ladder.json';
      a.click();
      URL.revokeObjectURL(url);
    },

    importProgram(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          ladderProgram.rungs = sanitizeRungs(Array.isArray(data) ? data : data.rungs);
          if (data.tags) currentTags = Object.assign({}, defaultTags, data.tags);
          if (data.activeScenario) {
            cpuState.activeScenario = data.activeScenario;
            const sel = document.getElementById('select-scenario');
            if (sel) sel.value = data.activeScenario;
          }
          if (data.linkedEquipments) {
            cpuState.linkedEquipments = data.linkedEquipments;
          }
          selectedNodeId = null;
          this.commit();
          toast('Programa importado com sucesso.');
        } catch (err) {
          toast(`Não foi possível importar: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    },

    handleImportProgram(event) {
      const file = event.target.files && event.target.files[0];
      if (file) this.importProgram(file);
      event.target.value = '';
    },

    selectNode(id) {
      selectedNodeId = id || null;
      this.applySelectionClasses();
    },

    applySelectionClasses() {
      const ws = document.getElementById('ladder-workspace');
      if (!ws) return;
      ws.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));
      if (selectedNodeId) {
        const el = ws.querySelector(`[data-node-id="${CSS.escape(selectedNodeId)}"]`);
        if (el) el.classList.add('selected'); else selectedNodeId = null;
      }
    },

    updateToolbarState() {
      const undo = document.querySelector('[data-action="undo"]');
      const redo = document.querySelector('[data-action="redo"]');
      if (undo) undo.disabled = History.past.length === 0;
      if (redo) redo.disabled = History.future.length === 0;
    },

    suggestTag(type) {
      if (['TON', 'TOF', 'TP'].includes(type)) return 'T0';
      if (['CTU', 'CTD'].includes(type)) return 'C0';
      if (['EQU', 'NEQ', 'GRT', 'LES', 'GEQ', 'LEQ'].includes(type)) return 'MW0';
      if (['ADD', 'SUB', 'MUL', 'DIV', 'MOVE'].includes(type)) return 'MW0';
      if (['COIL', 'SET', 'RESET'].includes(type)) return 'Q0.0';
      return 'I0.0';
    },

    createNodeObject(type) {
      if (type === 'PARALLEL' || type === 'BRANCH') return PAR([], []);
      const node = { id: uid(), type, target: this.suggestTag(type) };
      if (['TON', 'TOF', 'TP'].includes(type)) node.pt = 3;
      if (['CTU', 'CTD'].includes(type)) node.pv = 3;
      if (['EQU', 'NEQ', 'GRT', 'LES', 'GEQ', 'LEQ', 'ADD', 'SUB', 'MUL', 'DIV', 'MOVE'].includes(type)) {
        node.inA = 'IW0';
        node.inB = '500';
      }
      return node;
    },

    placeNode(seqInfo, index, payload) {
      if (payload.kind === 'new') {
        const node = this.createNodeObject(payload.type);
        History.checkpoint();
        seqInfo.array.splice(index, 0, node);
        selectedNodeId = node.id;
        this.commit();
        return true;
      }

      const loc = locateNode(payload.id);
      if (!loc) return false;
      let target = index;
      if (loc.array === seqInfo.array && loc.index < target) target--;

      History.checkpoint();
      loc.array.splice(loc.index, 1);
      seqInfo.array.splice(target, 0, loc.node);
      selectedNodeId = loc.node.id;
      this.commit();
      return true;
    },

    addInstructionToRung(type) {
      this.addFromPalette(type);
    },

    addFromPalette(type) {
      let seqInfo;
      let index;
      const sel = selectedNodeId && locateNode(selectedNodeId);
      if (sel) {
        seqInfo = { array: sel.array, depth: sel.depth };
        index = sel.index + 1;
      } else {
        const rung = findRung(activeRungId) || ladderProgram.rungs[ladderProgram.rungs.length - 1];
        if (!rung) return;
        activeRungId = rung.id;
        seqInfo = { array: rung.nodes, depth: 0 };
        index = rung.nodes.length;
      }
      this.placeNode(seqInfo, index, { kind: 'new', type });
    },

    handleDragStart(event, type) {
      dragPayload = { kind: 'new', type };
      if (event && event.dataTransfer) event.dataTransfer.setData('text/plain', type);
    },

    endDrag() {
      dragPayload = null;
      hideDropMarker();
    },

    getDropSeq(event) {
      const ws = document.getElementById('ladder-workspace');
      const el = event.target instanceof Element ? event.target : null;
      if (!el || !ws) return null;
      let seq = el.closest('[data-seq]');
      if (!seq) {
        const rungEl = el.closest('.ladder-rung');
        if (rungEl) seq = rungEl.querySelector('.rung-elements-container');
      }
      return seq && ws.contains(seq) ? seq : null;
    },

    seqItems(seqEl) {
      return Array.from(seqEl.children).filter((c) => c.dataset && c.dataset.nodeId && !c.matches('button'));
    },

    computeInsertIndex(seqEl, clientX) {
      const items = this.seqItems(seqEl);
      let idx = 0;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        if (clientX > r.left + r.width / 2) idx++;
      });
      return idx;
    },

    resolveSeq(seqEl) {
      const rung = findRung(seqEl.dataset.rungId);
      if (!rung) return null;
      const depth = parseInt(seqEl.dataset.depth || '0', 10);
      if (seqEl.dataset.seq === 'root') return { array: rung.nodes, depth };
      const loc = locateIn(rung.nodes, seqEl.dataset.parallelId, 0);
      if (!loc || !loc.node.branches[+seqEl.dataset.branch]) return null;
      return { array: loc.node.branches[+seqEl.dataset.branch], depth };
    },

    onDragStartWorkspace(e) {
      const el = e.target instanceof Element ? e.target.closest('.ladder-block, .parallel-group-container') : null;
      if (!el) return;
      dragPayload = { kind: 'move', id: el.dataset.nodeId };
      e.dataTransfer.setData('text/plain', `move:${el.dataset.nodeId}`);
    },

    onDragOverWorkspace(e) {
      const seqEl = this.getDropSeq(e);
      if (!seqEl) { hideDropMarker(); return; }
      e.preventDefault();
      showDropMarker(seqEl, this.computeInsertIndex(seqEl, e.clientX), this.seqItems(seqEl));
    },

    onDropWorkspace(e) {
      const seqEl = this.getDropSeq(e);
      let payload = dragPayload;
      this.endDrag();
      if (!seqEl || !payload) return;
      e.preventDefault();

      const info = this.resolveSeq(seqEl);
      if (!info) return;
      const idx = this.computeInsertIndex(seqEl, e.clientX);
      activeRungId = seqEl.dataset.rungId;
      this.placeNode(info, idx, payload);
    },

    openConfigModal(nodeId) {
      const loc = locateNode(nodeId);
      if (!loc || loc.node.type === 'PARALLEL') return;
      const node = loc.node;
      editingNode = node;

      const modal = document.getElementById('config-modal-overlay');
      const primaryGroup = document.getElementById('config-primary-group');
      const primaryInput = document.getElementById('config-primary-tag');
      const inAGroup = document.getElementById('config-inA-group');
      const inAInput = document.getElementById('config-inA-val');
      const inBGroup = document.getElementById('config-inB-group');
      const inBInput = document.getElementById('config-inB-val');
      const paramGroup = document.getElementById('config-param-group');
      const paramInput = document.getElementById('config-param-val');
      const paramLabel = document.getElementById('config-param-label');

      if (!modal || !primaryInput) return;

      const meta = TYPE_META[node.type];
      const title = modal.querySelector('.config-modal-title');
      if (title) title.textContent = `⚙️ ${meta.name}`;

      primaryInput.value = node.target || '';
      inAInput.value = node.inA || '';
      inBInput.value = node.inB || '';

      const isCmp = ['EQU', 'NEQ', 'GRT', 'LES', 'GEQ', 'LEQ'].includes(node.type);
      const isMath = ['ADD', 'SUB', 'MUL', 'DIV', 'MOVE'].includes(node.type);

      if (isCmp) {
        primaryGroup.style.display = 'none';
        inAGroup.style.display = 'flex';
        inBGroup.style.display = 'flex';
        paramGroup.style.display = 'none';
      } else if (isMath) {
        primaryGroup.style.display = 'flex';
        document.getElementById('config-primary-label').textContent = 'Registrador de Destino:';
        inAGroup.style.display = 'flex';
        inBGroup.style.display = node.type === 'MOVE' ? 'none' : 'flex';
        paramGroup.style.display = 'none';
      } else {
        primaryGroup.style.display = 'flex';
        document.getElementById('config-primary-label').textContent = 'Tag / Endereço Principal:';
        inAGroup.style.display = 'none';
        inBGroup.style.display = 'none';

        if (['TON', 'TOF', 'TP'].includes(node.type)) {
          paramGroup.style.display = 'flex';
          paramLabel.textContent = 'Tempo limite (PT em segundos):';
          paramInput.value = node.pt || 3;
        } else if (['CTU', 'CTD'].includes(node.type)) {
          paramGroup.style.display = 'flex';
          paramLabel.textContent = 'Contagem limite (PV em pulsos):';
          paramInput.value = node.pv || 3;
        } else {
          paramGroup.style.display = 'none';
        }
      }

      modal.classList.add('active');
    },

    closeModal() {
      const modal = document.getElementById('config-modal-overlay');
      if (modal) modal.classList.remove('active');
      editingNode = null;
    },

    saveModalConfig() {
      if (!editingNode) return;
      const targetVal = document.getElementById('config-primary-tag').value.trim().toUpperCase();
      const inAVal = document.getElementById('config-inA-val').value.trim();
      const inBVal = document.getElementById('config-inB-val').value.trim();
      const paramVal = document.getElementById('config-param-val').value.trim();

      History.checkpoint();
      editingNode.target = targetVal;
      if (inAVal) editingNode.inA = inAVal;
      if (inBVal) editingNode.inB = inBVal;

      if (['TON', 'TOF', 'TP'].includes(editingNode.type)) {
        editingNode.pt = parseFloat(paramVal) || 3;
      } else if (['CTU', 'CTD'].includes(editingNode.type)) {
        editingNode.pv = parseInt(paramVal, 10) || 3;
      }

      this.closeModal();
      this.commit();
    },

    bindEvents() {
      bindOnce(document.getElementById('btn-plc-run'), 'click', (el) => el.addEventListener('click', () => this.setMode('RUN')));
      bindOnce(document.getElementById('btn-plc-stop'), 'click', (el) => el.addEventListener('click', () => this.setMode('STOP')));
      bindOnce(document.getElementById('btn-plc-reset'), 'click', (el) => el.addEventListener('click', () => this.reset()));
      bindOnce(document.getElementById('btn-add-rung'), 'click', (el) => el.addEventListener('click', () => this.addRung()));
      bindOnce(document.getElementById('btn-modal-save'), 'click', (el) => el.addEventListener('click', () => this.saveModalConfig()));
      bindOnce(document.getElementById('btn-modal-cancel'), 'click', (el) => el.addEventListener('click', () => this.closeModal()));

      this.bindHardware();
      this.bindPalette();
      this.bindWorkspace();

      if (!this._globalBound) {
        this._globalBound = true;
        window.addEventListener('pointerup', () => this.releaseAllInputs());
        window.addEventListener('pointercancel', () => this.releaseAllInputs());
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
      }
    },

    bindHardware() {
      bindOnce(document.getElementById('plc-inputs-container'), 'hw', (box) => {
        box.addEventListener('pointerdown', (e) => {
          if (e.target.closest('.io-mode-btn') || e.target.closest('.btn-link-io')) return;
          const card = e.target.closest('.input-card');
          if (!card) return;
          e.preventDefault();
          this.pressInput(parseInt(card.dataset.input, 10));
        });
        box.addEventListener('click', (e) => {
          const b = e.target.closest('.io-mode-btn');
          if (b) this.toggleInputMode(parseInt(b.dataset.inputMode, 10));
        });
      });
    },

    bindPalette() {
      document.querySelectorAll('.palette-item, .btn-palette').forEach((item) => {
        const direct = item.dataset.type || item.dataset.nodeType;
        bindOnce(item, 'palette', () => {
          item.setAttribute('draggable', 'true');
          item.addEventListener('dragstart', (e) => this.handleDragStart(e, direct));
          item.addEventListener('dragend', () => this.endDrag());
        });
      });
    },

    bindWorkspace() {
      bindOnce(document.getElementById('ladder-workspace'), 'ws', (ws) => {
        ws.addEventListener('click', (e) => this.onWorkspaceClick(e));
        ws.addEventListener('dblclick', (e) => this.onWorkspaceDblClick(e));
        ws.addEventListener('dragstart', (e) => this.onDragStartWorkspace(e));
        ws.addEventListener('dragover', (e) => this.onDragOverWorkspace(e));
        ws.addEventListener('dragleave', (e) => { if (!ws.contains(e.relatedTarget)) hideDropMarker(); });
        ws.addEventListener('drop', (e) => this.onDropWorkspace(e));
        ws.addEventListener('dragend', () => this.endDrag());
        ws.addEventListener('change', (e) => {
          if (e.target.id === 'ladder-examples') {
            const key = e.target.value;
            e.target.value = '';
            if (key) this.loadExample(key);
          } else if (e.target.id === 'ladder-import-file') {
            this.importProgram(e.target.files && e.target.files[0]);
            e.target.value = '';
          }
        });
      });
    },

    onWorkspaceClick(e) {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        const a = actionEl.dataset.action;
        const id = actionEl.dataset.nodeId;
        if (a === 'delete-node') this.deleteNode(id);
        else if (a === 'remove-rung') this.removeRung(actionEl.dataset.rungId);
        else if (a === 'move-rung') this.moveRung(actionEl.dataset.rungId, parseInt(actionEl.dataset.dir, 10));
        else if (a === 'add-branch') this.addBranch(id);
        else if (a === 'remove-branch') this.removeBranch(id, parseInt(actionEl.dataset.branch, 10));
        else if (a === 'undo') this.undo();
        else if (a === 'redo') this.redo();
        else if (a === 'export') this.exportProgram();
        else if (a === 'clear') this.clearProgram();
        return;
      }

      const rungEl = e.target.closest('.ladder-rung-wrapper');
      if (rungEl && rungEl.dataset.rungId !== activeRungId) {
        activeRungId = rungEl.dataset.rungId;
      }
      const nodeEl = e.target.closest('.ladder-block, .parallel-group-container');
      selectedNodeId = nodeEl ? nodeEl.dataset.nodeId : null;
      this.applySelectionClasses();
    },

    onWorkspaceDblClick(e) {
      const comment = e.target.closest('.rung-comment');
      if (comment) { this.editComment(comment.dataset.commentFor, comment); return; }
      const block = e.target.closest('.ladder-block');
      if (block && !e.target.closest('button')) this.openConfigModal(block.dataset.nodeId);
    },

    onKeyDown(e) {
      const ws = document.getElementById('ladder-workspace');
      if (!ws || ws.offsetParent === null) return;
      const modalOpen = document.getElementById('config-modal-overlay');
      if (modalOpen && modalOpen.classList.contains('active')) return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
      else if (ctrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); this.redo(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) { e.preventDefault(); this.deleteNode(selectedNodeId); }
      else if (e.key === 'Enter' && selectedNodeId) { e.preventDefault(); this.openConfigModal(selectedNodeId); }
    }
  };

  /* ========================================================================
   * 10. UTILITÁRIOS DE INTERFACE
   * ====================================================================== */
  function showDropMarker(seqEl, idx, items) {
    if (lastDropSeq && lastDropSeq !== seqEl) lastDropSeq.classList.remove('drag-over');
    lastDropSeq = seqEl;

    if (!dropMarker) {
      dropMarker = document.createElement('div');
      dropMarker.className = 'drop-marker';
      document.body.appendChild(dropMarker);
    }
    const sr = seqEl.getBoundingClientRect();
    let x;
    if (!items.length) {
      seqEl.classList.add('drag-over');
      dropMarker.style.display = 'none';
      return;
    }
    seqEl.classList.remove('drag-over');
    if (idx <= 0) x = items[0].getBoundingClientRect().left - 6;
    else if (idx >= items.length) x = items[items.length - 1].getBoundingClientRect().right + 6;
    else x = (items[idx - 1].getBoundingClientRect().right + items[idx].getBoundingClientRect().left) / 2;

    const cy = sr.top + sr.height / 2;
    dropMarker.style.display = 'block';
    dropMarker.style.left = `${x - 2}px`;
    dropMarker.style.top = `${cy - 34}px`;
    dropMarker.style.height = '68px';
  }

  function hideDropMarker() {
    if (dropMarker) dropMarker.style.display = 'none';
    if (lastDropSeq) { lastDropSeq.classList.remove('drag-over'); lastDropSeq = null; }
  }

  let toastTimer = null;
  function toast(message, type) {
    let el = document.getElementById('ladder-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ladder-toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.className = `ladder-toast show${type === 'error' ? ' error' : ''}`;
    el.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  /* ========================================================================
   * 11. EXPORTAÇÃO GLOBAL
   * ====================================================================== */
  window.SimulatorModule = SimulatorModule;
  window.LadderEvaluator = LadderEvaluator;
  window.LadderRenderer = LadderRenderer;
  window.ScenarioEngine = ScenarioEngine;
  window.TraceModule = TraceModule;
  window.cpuState = cpuState;
  window.ladderProgram = ladderProgram;
  window.LadderHistory = History;
})();