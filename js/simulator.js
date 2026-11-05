/**
 * AUTO TECH HUB — MOTOR CLP + EDITOR LADDER (v2)
 * ---------------------------------------------------------------------------
 *  • Motor de varredura (scan) real: imagem de entradas → rungs → saídas
 *  • Contatos NA / NF / Pulso (borda), bobinas ( ) / SET / RESET, TON, CTU
 *  • Ramos paralelos aninháveis (até 3 níveis) com vários ramos
 *  • Arrastar da paleta, mover blocos, inserir na posição exata (Drag & Drop)
 *  • Modal de configuração com validação de endereços
 *  • Desfazer/Refazer, salvamento automático, exportar/importar JSON
 *  • Exemplos prontos, avisos de lógica (bobina duplicada, linha sem saída…)
 *  • Gerenciamento simbólico de variáveis (Tabela de Tags)
 * ---------------------------------------------------------------------------
 */
(function () {
  'use strict';

  /* ========================================================================
   * 0. CONFIGURAÇÃO E UTILITÁRIOS
   * ====================================================================== */
  const CONFIG = {
    scanTimeMs: 50,                 // período da varredura
    maxParallelDepth: 3,            // níveis máximos de ramos paralelos aninhados
    maxBranches: 6,                 // ramos máximos por grupo paralelo
    historyLimit: 100,              // passos de desfazer
    holdMs: 70,                     // tempo mínimo de um clique em botão (a CLP precisa "ver")
    storageKey: 'autotech.ladder.v2',
    memory: { I: 8, Q: 8, M: 8, T: 10, C: 10 }   // I0.0–I0.7, Q0.0–Q0.7, M0.0–M0.7, T0–T9, C0–C9
  };

  const TYPE_META = {
    NO:     { symbol: '|  |',   name: 'Contato NA',    areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    NC:     { symbol: '| / |',  name: 'Contato NF',    areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    P_EDGE: { symbol: '| P |',  name: 'Pulso (borda)', areas: ['I', 'Q', 'M', 'T', 'C'], kind: 'contact' },
    COIL:   { symbol: '(  )',   name: 'Bobina Direta', areas: ['Q', 'M'],                kind: 'output' },
    SET:    { symbol: '( S )',  name: 'Bobina SET',    areas: ['Q', 'M'],                kind: 'output' },
    RESET:  { symbol: '( R )',  name: 'Bobina RESET',  areas: ['Q', 'M', 'C'],           kind: 'output' },
    TON:    { symbol: '[ TON ]', name: 'Temporizador TON', areas: ['T'],                 kind: 'block' },
    CTU:    { symbol: '[ CTU ]', name: 'Contador CTU',     areas: ['C'],                 kind: 'block' }
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
      m = text.match(/^([TC])(\d{1,2})$/);
      if (m) {
        const idx = parseInt(m[2], 10);
        if (idx < CONFIG.memory[m[1]]) result = { tag: `${m[1]}${idx}`, area: m[1], index: idx };
      }
    }
    if (addressCache.size > 500) addressCache.clear();
    addressCache.set(key, result);
    return result;
  }

  function areaRangeText(area) {
    const n = CONFIG.memory[area];
    if (area === 'T' || area === 'C') return `${area}0–${area}${n - 1}`;
    return `${area}0.0–${area}0.${n - 1}`;
  }

  function validateAddress(type, raw) {
    const meta = TYPE_META[type];
    const parsed = parseAddress(raw);
    const ranges = meta.areas.map(areaRangeText).join(', ');
    if (!parsed) return { ok: false, error: `Endereço inválido. Use: ${ranges}` };
    if (!meta.areas.includes(parsed.area)) return { ok: false, error: `${meta.name} aceita apenas: ${ranges}` };
    return { ok: true, tag: parsed.tag };
  }

  function allAddressesFor(type) {
    const list = [];
    TYPE_META[type].areas.forEach((area) => {
      for (let i = 0; i < CONFIG.memory[area]; i++) list.push(area === 'T' || area === 'C' ? `${area}${i}` : `${area}0.${i}`);
    });
    return list;
  }

  /* ========================================================================
   * GESTÃO DE TAGS (NOMES SIMBÓLICOS DE VARIÁVEIS - FASE 1)
   * ====================================================================== */
  const defaultTags = {
    "I0.0": { name: "BOTAO_LIGA", comment: "Botoeira de partida" },
    "I0.1": { name: "BOTAO_DESLIGA", comment: "Botoeira de parada" },
    "I0.2": { name: "SENSOR_PECA", comment: "Sensor de presença" },
    "I0.3": { name: "EMERGENCIA", comment: "Botão de emergência" },
    "I0.4": { name: "CHAVE_MAN_AUTO", comment: "Chave seletora" },
    "I0.5": { name: "RELE_TERMICO", comment: "Falha térmica motor" },
    "I0.6": { name: "FIM_CURSO_AV", comment: "Sensor avanço" },
    "I0.7": { name: "FIM_CURSO_REC", comment: "Sensor recuo" },
    "Q0.0": { name: "MOTOR_01", comment: "Contatora motor principal" },
    "Q0.1": { name: "VALVULA_AVANCO", comment: "Solenoide avanço" },
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
   * 1. MODELO DE DADOS — programa de exemplo e biblioteca de exemplos
   * ====================================================================== */
  const N = (type, target, extra = {}) => Object.assign({ id: uid(), type, target }, extra);
  const PAR = (...branches) => ({ id: uid(), type: 'PARALLEL', branches });
  const RUNG = (comment, nodes = []) => ({ id: uid('r'), comment, nodes });

  const EXAMPLES = {
    selo: {
      label: 'Partida de motor com selo',
      build: () => [
        RUNG('Partida direta de motor com retenção (selo): I0.0 liga, I0.1 desliga', [
          N('NC', 'I0.1'), PAR([N('NO', 'I0.0')], [N('NO', 'Q0.0')]), N('COIL', 'Q0.0')
        ])
      ]
    },
    setreset: {
      label: 'Bobinas SET / RESET',
      build: () => [
        RUNG('I0.0 liga e trava Q0.0 (SET)', [N('NO', 'I0.0'), N('SET', 'Q0.0')]),
        RUNG('I0.1 destrava Q0.0 (RESET)', [N('NO', 'I0.1'), N('RESET', 'Q0.0')])
      ]
    },
    ton: {
      label: 'Temporizador TON (retardo de 3 s)',
      build: () => [
        RUNG('Selo em M0.0: I0.0 liga, I0.1 desliga', [
          N('NC', 'I0.1'), PAR([N('NO', 'I0.0')], [N('NO', 'M0.0')]), N('COIL', 'M0.0')
        ]),
        RUNG('Com M0.0 ligado por 3 s, aciona Q0.0', [N('NO', 'M0.0'), N('TON', 'T0', { pt: 3 }), N('COIL', 'Q0.0')])
      ]
    },
    blink: {
      label: 'Pisca-pisca (2 temporizadores)',
      build: () => [
        RUNG('Habilita com I0.0 (use o modo CHAVE) — T0 conta 0,5 s enquanto T1 não terminou', [
          N('NO', 'I0.0'), N('NC', 'T1'), N('TON', 'T0', { pt: 0.5 })
        ]),
        RUNG('Quando T0 termina, T1 conta mais 0,5 s e reinicia o ciclo', [N('NO', 'T0'), N('TON', 'T1', { pt: 0.5 })]),
        RUNG('Lâmpada pisca em Q0.0', [N('NO', 'T0'), N('COIL', 'Q0.0')])
      ]
    },
    ctu: {
      label: 'Contador CTU (5 pulsos)',
      build: () => [
        RUNG('Cada acionamento de I0.2 conta 1 pulso', [N('NO', 'I0.2'), N('CTU', 'C0', { pv: 5 })]),
        RUNG('Ao chegar em 5 pulsos, liga Q0.1', [N('NO', 'C0'), N('COIL', 'Q0.1')]),
        RUNG('I0.3 zera o contador', [N('NO', 'I0.3'), N('RESET', 'C0')])
      ]
    },
    interlock: {
      label: 'Intertravamento de 2 motores',
      build: () => [
        RUNG('Motor 1: I0.0 liga, I0.2 desliga — bloqueado se o motor 2 estiver ligado', [
          N('NC', 'I0.2'), PAR([N('NO', 'I0.0')], [N('NO', 'Q0.0')]), N('NC', 'Q0.1'), N('COIL', 'Q0.0')
        ]),
        RUNG('Motor 2: I0.1 liga, I0.3 desliga — bloqueado se o motor 1 estiver ligado', [
          N('NC', 'I0.3'), PAR([N('NO', 'I0.1')], [N('NO', 'Q0.1')]), N('NC', 'Q0.0'), N('COIL', 'Q0.1')
        ])
      ]
    }
  };

  const ladderProgram = { rungs: EXAMPLES.selo.build() };

  /* ========================================================================
   * 2. ESTADO DA CPU E HARDWARE
   * ====================================================================== */
  const cpuState = {
    mode: 'RUN',
    scanTimeMs: CONFIG.scanTimeMs,
    scanLedState: false,
    scanCount: 0,

    I: blankBits(CONFIG.memory.I),
    Iimg: blankBits(CONFIG.memory.I),
    Q: blankBits(CONFIG.memory.Q),
    M: blankBits(CONFIG.memory.M),

    T: {},
    C: {},
    edgeMemory: {},

    inputModes: Array.from({ length: CONFIG.memory.I }, () => 'BUTTON')
  };

  let editingNode = null;
  let selectedNodeId = null;
  let activeRungId = null;

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

  function nestingDepth(node) {
    if (node.type !== 'PARALLEL') return 0;
    let max = 0;
    node.branches.forEach((b) => b.forEach((n) => { max = Math.max(max, nestingDepth(n)); }));
    return 1 + max;
  }

  function ensureTimer(tag, pt) {
    if (!cpuState.T[tag]) cpuState.T[tag] = { acc: 0, pt: pt || 3, dn: false };
    return cpuState.T[tag];
  }
  function ensureCounter(tag, pv) {
    if (!cpuState.C[tag]) cpuState.C[tag] = { cv: 0, pv: pv || 3, dn: false, lastInput: false };
    return cpuState.C[tag];
  }
  function syncMemoryWithProgram() {
    ladderProgram.rungs.forEach((rung) => walkNodes(rung.nodes, (n) => {
      if (n.type === 'TON') ensureTimer(n.target, n.pt).pt = n.pt;
      if (n.type === 'CTU') ensureCounter(n.target, n.pv).pv = n.pv;
    }));
  }

  /* ========================================================================
   * 3. ANÁLISE DO PROGRAMA (avisos para o usuário)
   * ====================================================================== */
  function analyzeProgram() {
    const out = { rung: {}, node: {} };
    const warnRung = (rungId, msg) => { (out.rung[rungId] = out.rung[rungId] || []).push(msg); };

    const coils = {};
    const blocks = {};
    ladderProgram.rungs.forEach((rung) => walkNodes(rung.nodes, (n) => {
      if (n.type === 'COIL') (coils[n.target] = coils[n.target] || []).push({ id: n.id, rungId: rung.id });
      if (n.type === 'TON' || n.type === 'CTU') (blocks[n.target] = blocks[n.target] || []).push({ id: n.id, rungId: rung.id });
    }));

    Object.entries(coils).forEach(([tag, list]) => {
      if (list.length > 1) list.forEach((it) => {
        out.node[it.id] = `Bobina duplicada: ${tag} é escrito em mais de um lugar (vale o último).`;
        warnRung(it.rungId, `Bobina duplicada em ${tag}`);
      });
    });
    Object.entries(blocks).forEach(([tag, list]) => {
      if (list.length > 1) list.forEach((it) => {
        out.node[it.id] = `${tag} está sendo usado por mais de um bloco.`;
        warnRung(it.rungId, `${tag} usado por mais de um bloco`);
      });
    });

    ladderProgram.rungs.forEach((rung) => {
      if (!rung.nodes.length) return;
      let hasOutput = false;
      let emptyBranch = false;

      walkNodes(rung.nodes, (n) => {
        const meta = TYPE_META[n.type];
        if (meta && meta.kind !== 'contact') hasOutput = true;
        if (n.type === 'PARALLEL' && n.branches.some((b) => b.length === 0)) emptyBranch = true;
        if (meta && meta.kind === 'contact' && /^[TC]/.test(n.target) && !blocks[n.target]) {
          out.node[n.id] = `${n.target} não tem ${n.target[0] === 'T' ? 'temporizador (TON)' : 'contador (CTU)'} no programa — nunca será verdadeiro.`;
          warnRung(rung.id, `${n.target} usado como contato, mas não existe ${n.target[0] === 'T' ? 'TON' : 'CTU'} com esse endereço`);
        }
      });

      if (!hasOutput) warnRung(rung.id, 'Linha sem saída (adicione uma bobina, TON ou CTU)');
      if (emptyBranch) warnRung(rung.id, 'Ramo paralelo vazio conta como circuito aberto');

      rung.nodes.forEach((n, i) => {
        if (['COIL', 'SET', 'RESET'].includes(n.type) && i < rung.nodes.length - 1) {
          out.node[n.id] = out.node[n.id] || 'Bobina no meio da linha: o padrão é colocá-la no final.';
          warnRung(rung.id, 'Bobina no meio da linha (o padrão é no final)');
        }
      });
    });

    Object.keys(out.rung).forEach((k) => { out.rung[k] = [...new Set(out.rung[k])]; });
    return out;
  }

  /* ========================================================================
   * 4. MOTOR DE AVALIAÇÃO (ciclo de varredura)
   * ====================================================================== */
  const LadderEvaluator = {
    lastTs: 0,

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
            let branchOut;
            if (branch.length === 0) {
              results[`seq:${key}`] = { outFlow: false };
              branchOut = false;
            } else {
              branchOut = this.evaluateSequence(branch, inFlow, results, key, dt);
            }
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

        case 'CTU': {
          const c = ensureCounter(tag, node.pv);
          c.pv = node.pv;
          if (inFlow && !c.lastInput) c.cv = Math.min(9999, c.cv + 1);
          c.lastInput = inFlow;
          c.dn = c.cv >= c.pv;
          return inFlow && c.dn;
        }
        default: return false;
      }
    },

    enterStop() {
      cpuState.Q.fill(false);
      Object.values(cpuState.T).forEach((t) => { t.acc = 0; t.dn = false; });
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
   * 5. HISTÓRICO (desfazer / refazer) E PERSISTÊNCIA
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
    if (!Array.isArray(rawRungs) || rawRungs.length === 0) throw new Error('O arquivo não contém linhas (rungs).');
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
          if (depth + 1 > CONFIG.maxParallelDepth) throw new Error(`Ramos paralelos aninhados demais (máx. ${CONFIG.maxParallelDepth}).`);
          if (!Array.isArray(n.branches) || n.branches.length < 1 || n.branches.length > CONFIG.maxBranches) {
            throw new Error('Ramo paralelo com número de ramos inválido.');
          }
          return { id: safeId(n.id, 'n'), type: 'PARALLEL', branches: n.branches.map((b) => cleanNodes(b, depth + 1)) };
        }
        if (!TYPE_META[n.type]) throw new Error(`Tipo de elemento desconhecido: ${n.type}`);
        const v = validateAddress(n.type, n.target);
        if (!v.ok) throw new Error(`${TYPE_META[n.type].name} ${n.target}: ${v.error}`);
        const clean = { id: safeId(n.id, 'n'), type: n.type, target: v.tag };
        if (n.type === 'TON') clean.pt = Math.min(3600, Math.max(0.1, parseFloat(n.pt) || 3));
        if (n.type === 'CTU') clean.pv = Math.min(9999, Math.max(1, parseInt(n.pv, 10) || 3));
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
          version: 2, rungs: ladderProgram.rungs, inputModes: cpuState.inputModes, tags: currentTags
        }));
      } catch (e) { }
    },
    load() {
      try {
        const raw = localStorage.getItem(CONFIG.storageKey);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return { rungs: sanitizeRungs(data.rungs), inputModes: data.inputModes, tags: data.tags };
      } catch (e) { return null; }
    }
  };

  /* ========================================================================
   * 6. RENDERIZADOR
   * ====================================================================== */
  function subTextFor(node) {
    if (node.type === 'TON') {
      const t = cpuState.T[node.target];
      return `${(t ? t.acc : 0).toFixed(1)}s / ${node.pt}s`;
    }
    if (node.type === 'CTU') {
      const c = cpuState.C[node.target];
      return `CV ${c ? c.cv : 0} / ${node.pv}`;
    }
    return '';
  }

  const LadderRenderer = {
    cache: null,

    buildDOMStructure() {
      this.buildHardwarePanelDOM();
      this.buildWorkspaceDOM();
    },

    buildHardwarePanelDOM() {
      const inputs = document.getElementById('plc-inputs-container');
      if (inputs) {
        inputs.innerHTML = cpuState.I.map((_, idx) => `
          <div class="io-card input-card" data-input="${idx}" tabindex="0" role="button" aria-pressed="false"
               title="Segure para pressionar (modo BOTÃO) · clique no rótulo para alternar BOTÃO/CHAVE">
            <span class="io-label">I0.${idx}</span>
            <span class="io-card-tag" title="${esc(currentTags['I0.' + idx]?.comment || '')}">${esc(getTagName('I0.' + idx))}</span>
            <div id="led-input-${idx}" class="led-indicator"></div>
            <button type="button" class="io-mode-btn" data-input-mode="${idx}"
                    title="Alterna entre BOTÃO (momentâneo) e CHAVE (trava ligado/desligado)">${cpuState.inputModes[idx] === 'SWITCH' ? 'CHAVE' : 'BOTÃO'}</button>
          </div>`).join('');
      }
      const outputs = document.getElementById('plc-outputs-container');
      if (outputs) {
        outputs.innerHTML = cpuState.Q.map((_, idx) => `
          <div class="io-card">
            <span class="io-label">Q0.${idx}</span>
            <span class="io-card-tag" title="${esc(currentTags['Q0.' + idx]?.comment || '')}">${esc(getTagName('Q0.' + idx))}</span>
            <div id="led-output-${idx}" class="led-indicator"></div>
            <span class="io-sub">CARGA</span>
          </div>`).join('');
      }
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
            ${Object.entries(EXAMPLES).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('')}
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
          <button type="button" class="btn-remove-rung" data-action="remove-rung" data-rung-id="${rung.id}" title="Excluir linha" aria-label="Excluir linha ${rIdx + 1}">🗑️</button>
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
      const tip = `${meta.name} ${node.target} (${tagName})${w ? `\n⚠ ${w}` : ''}\nDuplo clique: editar · Delete: remover · Arraste: mover`;
      
      return `
        <div class="ladder-block${w ? ' has-warning' : ''}" data-node-id="${node.id}" data-type="${node.type}" draggable="true" title="${esc(tip)}">
          <button type="button" class="btn-delete-element" data-action="delete-node" data-node-id="${node.id}" title="Remover" aria-label="Remover ${esc(meta.name)}">×</button>
          <i class="bit-dot"></i>
          <span class="ladder-block-tag" style="font-size: 0.68rem; color: var(--accent-color);">${isNamed ? esc(tagName) : ''}</span>
          <span class="ladder-block-symbol">${meta.symbol}</span>
          <span class="ladder-block-tag" style="font-size: 0.72rem;">${esc(node.target)}</span>
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
            ${canRemoveBranch ? `<button type="button" class="btn-remove-branch" data-action="remove-branch" data-node-id="${node.id}" data-branch="${i}" title="Remover este ramo" aria-label="Remover ramo ${i + 1}">−</button>` : ''}
          </div>`;
      }).join('');

      return `
        <div class="parallel-group-container" data-node-id="${node.id}" data-type="PARALLEL" draggable="true">
          <button type="button" class="btn-delete-element" data-action="delete-node" data-node-id="${node.id}" title="Excluir ramo paralelo" aria-label="Excluir ramo paralelo">×</button>
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
      const running = cpuState.mode === 'RUN';

      const lcdStatus = document.getElementById('plc-lcd-status-text');
      const scanLed = document.getElementById('plc-scan-led');
      if (lcdStatus) {
        lcdStatus.textContent = `MODE: ${cpuState.mode}`;
        const lcd = lcdStatus.closest('.plc-lcd-screen');
        if (lcd) lcd.classList.toggle('stopped', !running);
      }
      if (scanLed) scanLed.classList.toggle('active', running && cpuState.scanLedState);

      const runBtn = document.getElementById('btn-plc-run');
      const stopBtn = document.getElementById('btn-plc-stop');
      if (runBtn) runBtn.classList.toggle('is-active', running);
      if (stopBtn) stopBtn.classList.toggle('is-active', !running);

      cpuState.I.forEach((val, idx) => {
        const led = document.getElementById(`led-input-${idx}`);
        if (led) {
          led.classList.toggle('on', val);
          const card = led.closest('.input-card');
          if (card) card.setAttribute('aria-pressed', val ? 'true' : 'false');
        }
      });
      cpuState.Q.forEach((val, idx) => {
        const led = document.getElementById(`led-output-${idx}`);
        if (led) led.classList.toggle('on', val);
      });

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
   * 7. CONTROLADOR DO SIMULADOR E EVENTOS
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
      }
      syncMemoryWithProgram();
      this.bindEvents();
      LadderRenderer.buildDOMStructure();
      this.startLoop();
    },

    loadPreset(presetProgram) {
      if (!presetProgram) return;
      try {
        History.checkpoint();
        const rungsToLoad = presetProgram.rungs || (Array.isArray(presetProgram) ? presetProgram : null);
        if (rungsToLoad) {
          ladderProgram.rungs = sanitizeRungs(rungsToLoad);
          selectedNodeId = null;
          this.resetRuntimeKeepInputs();
          this.commit();
          toast('Circuito do equipamento carregado no simulador!');
        }
      } catch (err) {
        toast(`Erro ao carregar circuito: ${err.message}`, 'error');
      }
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
      const results = LadderEvaluator.runScanCycle(dt);
      LadderRenderer.updateDynamicStates(results);
    },

    setMode(mode) {
      if (mode === cpuState.mode) return;
      cpuState.mode = mode;
      if (mode === 'RUN') { cpuState.edgeMemory = {}; LadderEvaluator.lastTs = 0; }
      else LadderEvaluator.enterStop();
      this.tick();
    },

    reset() {
      for (let i = 0; i < CONFIG.memory.I; i++) cpuState.I[i] = false;
      cpuState.Iimg.fill(false);
      cpuState.Q.fill(false);
      cpuState.M.fill(false);
      Object.values(cpuState.T).forEach((t) => { t.acc = 0; t.dn = false; });
      Object.values(cpuState.C).forEach((c) => { c.cv = 0; c.dn = false; c.lastInput = false; });
      cpuState.edgeMemory = {};
      pressedInputs.clear();
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
      setTimeout(() => { if (!pressedInputs.has(idx) && cpuState.inputModes[idx] === 'BUTTON') cpuState.I[idx] = false; }, wait);
    },

    releaseAllInputs() {
      Array.from(pressedInputs.keys()).forEach((i) => this.releaseInput(i));
    },

    toggleInputMode(idx) {
      cpuState.inputModes[idx] = cpuState.inputModes[idx] === 'SWITCH' ? 'BUTTON' : 'SWITCH';
      cpuState.I[idx] = false;
      pressedInputs.delete(idx);
      const btn = document.querySelector(`.io-mode-btn[data-input-mode="${idx}"]`);
      if (btn) btn.textContent = cpuState.inputModes[idx] === 'SWITCH' ? 'CHAVE' : 'BOTÃO';
      Persistence.save();
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
      const el = document.querySelector(`.ladder-rung-wrapper[data-rung-id="${rung.id}"]`);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },

    removeRung(ref) {
      const idx = typeof ref === 'number' ? ref : ladderProgram.rungs.findIndex((r) => r.id === ref);
      const rung = ladderProgram.rungs[idx];
      if (!rung) return;
      if (rung.nodes.length && !window.confirm(`Excluir a linha ${idx + 1} e seus ${rung.nodes.length} elemento(s)?`)) return;

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
      input.setAttribute('aria-label', 'Comentário da linha');
      el.replaceChildren(input);
      input.focus();
      input.select();

      let done = false;
      const finish = (save) => {
        if (done) return;
        done = true;
        const value = input.value.trim();
        if (save && value !== (rung.comment || '')) {
          History.checkpoint();
          rung.comment = value;
          Persistence.save();
        }
        LadderRenderer.buildWorkspaceDOM();
      };
      input.addEventListener('keydown', (ev) => {
        ev.stopPropagation();
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
      delete cpuState.edgeMemory[nodeId];
      this.commit();
    },

    deleteNodeFromSequence(nodes, nodeId) {
      const r = locateIn(nodes, nodeId, 0);
      if (!r) return false;
      r.array.splice(r.index, 1);
      return true;
    },

    findNode(nodes, nodeId) {
      const r = locateIn(nodes, nodeId, 0);
      return r ? r.node : null;
    },

    addBranch(parallelId) {
      const loc = locateNode(parallelId);
      if (!loc || loc.node.type !== 'PARALLEL') return;
      if (loc.node.branches.length >= CONFIG.maxBranches) { toast(`Máximo de ${CONFIG.maxBranches} ramos por grupo.`); return; }
      History.checkpoint();
      loc.node.branches.push([]);
      this.commit();
    },

    removeBranch(parallelId, idx) {
      const loc = locateNode(parallelId);
      if (!loc || loc.node.type !== 'PARALLEL') return;
      if (loc.node.branches.length <= 2) { toast('Um grupo paralelo precisa de pelo menos 2 ramos. Exclua o grupo inteiro se quiser.'); return; }
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
            <td style="font-family: var(--font-mono); font-weight: bold;">${addr}</td>
            <td><span class="category-badge" style="background:${isInput ? '#1e3a8a' : '#065f46'}; color: #fff;">${isInput ? 'Entrada' : 'Saída'}</span></td>
            <td><input type="text" id="tag-name-${addr}" value="${currentTags[addr].name || ''}" placeholder="Ex: MOTOR_01" /></td>
            <td><input type="text" id="tag-comment-${addr}" value="${currentTags[addr].comment || ''}" placeholder="Descrição funcional" /></td>
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

    undo() {
      if (!History.undo()) { toast('Nada para desfazer.'); return; }
      selectedNodeId = null;
      this.commit();
    },

    redo() {
      if (!History.redo()) { toast('Nada para refazer.'); return; }
      selectedNodeId = null;
      this.commit();
    },

    loadExample(key) {
      const ex = EXAMPLES[key];
      if (!ex) return;
      const hasContent = ladderProgram.rungs.some((r) => r.nodes.length);
      if (hasContent && !window.confirm(`Carregar o exemplo "${ex.label}"? O programa atual será substituído (você pode desfazer).`)) return;
      History.checkpoint();
      ladderProgram.rungs = ex.build();
      selectedNodeId = null;
      this.resetRuntimeKeepInputs();
      this.commit();
      toast(`Exemplo carregado: ${ex.label}`);
    },

    clearProgram() {
      if (!window.confirm('Apagar todas as linhas do programa? (você pode desfazer)')) return;
      History.checkpoint();
      ladderProgram.rungs = [RUNG('Nova linha')];
      selectedNodeId = null;
      this.resetRuntimeKeepInputs();
      this.commit();
    },

    resetRuntimeKeepInputs() {
      cpuState.Q.fill(false);
      cpuState.M.fill(false);
      cpuState.T = {};
      cpuState.C = {};
      cpuState.edgeMemory = {};
    },

    exportProgram() {
      const data = JSON.stringify({
        format: 'autotech-ladder', version: 2, tags: currentTags, rungs: ladderProgram.rungs, inputModes: cpuState.inputModes
      }, null, 2);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'programa-ladder.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast('Programa exportado.');
    },

    importProgram(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          const rungs = sanitizeRungs(Array.isArray(data) ? data : data.rungs);
          History.checkpoint();
          ladderProgram.rungs = rungs;
          if (data.tags) currentTags = Object.assign({}, defaultTags, data.tags);
          selectedNodeId = null;
          this.resetRuntimeKeepInputs();
          this.commit();
          toast('Programa importado com sucesso.');
        } catch (err) {
          toast(`Não foi possível importar: ${err.message}`, 'error');
        }
      };
      reader.onerror = () => toast('Erro ao ler o arquivo.', 'error');
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
        const el = ws.querySelector(`[data-node-id="${CSS.escape(selectedNodeId)}"].ladder-block, [data-node-id="${CSS.escape(selectedNodeId)}"].parallel-group-container`);
        if (el) el.classList.add('selected'); else selectedNodeId = null;
      }
      ws.querySelectorAll('.ladder-rung.active-rung').forEach((el) => el.classList.remove('active-rung'));
      if (activeRungId) {
        const r = ws.querySelector(`.ladder-rung[data-rung-id="${CSS.escape(activeRungId)}"]`);
        if (r) r.classList.add('active-rung');
      }
    },

    updateToolbarState() {
      const undo = document.querySelector('[data-action="undo"]');
      const redo = document.querySelector('[data-action="redo"]');
      if (undo) undo.disabled = History.past.length === 0;
      if (redo) redo.disabled = History.future.length === 0;
    },

    suggestTag(type) {
      const used = { contact: new Set(), coil: new Set(), set: new Set(), reset: new Set(), T: new Set(), C: new Set() };
      ladderProgram.rungs.forEach((r) => walkNodes(r.nodes, (n) => {
        if (['NO', 'NC', 'P_EDGE'].includes(n.type)) used.contact.add(n.target);
        else if (n.type === 'COIL') used.coil.add(n.target);
        else if (n.type === 'SET') used.set.add(n.target);
        else if (n.type === 'RESET') used.reset.add(n.target);
        else if (n.type === 'TON') used.T.add(n.target);
        else if (n.type === 'CTU') used.C.add(n.target);
      }));
      const firstFree = (area, usedSet, fmt) => {
        for (let i = 0; i < CONFIG.memory[area]; i++) { const t = fmt(i); if (!usedSet.has(t)) return t; }
        return fmt(0);
      };
      switch (type) {
        case 'NO': case 'NC': case 'P_EDGE': return firstFree('I', used.contact, (i) => `I0.${i}`);
        case 'COIL': case 'SET': return firstFree('Q', new Set([...used.coil, ...used.set]), (i) => `Q0.${i}`);
        case 'RESET': {
          const pending = [...used.set].find((t) => !used.reset.has(t));
          return pending || 'Q0.0';
        }
        case 'TON': return firstFree('T', used.T, (i) => `T${i}`);
        case 'CTU': return firstFree('C', used.C, (i) => `C${i}`);
        default: return 'I0.0';
      }
    },

    createNodeObject(type) {
      if (type === 'PARALLEL' || type === 'BRANCH') return PAR([], []);
      const node = { id: uid(), type, target: this.suggestTag(type) };
      if (type === 'TON') node.pt = 3;
      if (type === 'CTU') node.pv = 3;
      return node;
    },

    placeNode(seqInfo, index, payload) {
      if (payload.kind === 'new') {
        if ((payload.type === 'PARALLEL' || payload.type === 'BRANCH') && seqInfo.depth + 1 > CONFIG.maxParallelDepth) {
          toast(`Limite de ${CONFIG.maxParallelDepth} níveis de ramos paralelos.`); return false;
        }
        const node = this.createNodeObject(payload.type);
        History.checkpoint();
        seqInfo.array.splice(index, 0, node);
        selectedNodeId = node.id;
        this.commit();
        return true;
      }

      const loc = locateNode(payload.id);
      if (!loc) return false;
      if (seqInfo.depth + nestingDepth(loc.node) > CONFIG.maxParallelDepth) {
        toast(`Limite de ${CONFIG.maxParallelDepth} níveis de ramos paralelos.`); return false;
      }
      if (loc.node.type === 'PARALLEL' || loc.node.type === 'BRANCH') {
        const inside = [];
        walkNodes([loc.node], (n) => inside.push(n));
        if (inside.some((n) => n.branches && n.branches.includes(seqInfo.array))) return false;
      }
      let target = index;
      if (loc.array === seqInfo.array && loc.index < target) target--;
      if (loc.array === seqInfo.array && loc.index === target) return false;

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
      if (event && event.dataTransfer) {
        event.dataTransfer.setData('text/plain', type);
        event.dataTransfer.effectAllowed = 'copy';
      }
    },

    endDrag() {
      dragPayload = null;
      hideDropMarker();
      document.querySelectorAll('.is-dragging').forEach((el) => el.classList.remove('is-dragging'));
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
      e.dataTransfer.effectAllowed = 'move';
      requestAnimationFrame(() => el.classList.add('is-dragging'));
    },

    onDragOverWorkspace(e) {
      const types = e.dataTransfer ? Array.from(e.dataTransfer.types || []) : [];
      if (!dragPayload && !types.includes('text/plain')) return;
      const seqEl = this.getDropSeq(e);
      if (!seqEl) { hideDropMarker(); return; }

      if (dragPayload && dragPayload.kind === 'move') {
        const movingEl = document.querySelector(`[data-node-id="${CSS.escape(dragPayload.id)}"].ladder-block, [data-node-id="${CSS.escape(dragPayload.id)}"].parallel-group-container`);
        if (movingEl && movingEl.contains(seqEl)) { hideDropMarker(); return; }
      }

      e.preventDefault();
      e.dataTransfer.dropEffect = dragPayload && dragPayload.kind === 'move' ? 'move' : 'copy';
      showDropMarker(seqEl, this.computeInsertIndex(seqEl, e.clientX), this.seqItems(seqEl));
    },

    onDropWorkspace(e) {
      const seqEl = this.getDropSeq(e);
      let payload = dragPayload;
      if (!payload && e.dataTransfer) {
        const txt = e.dataTransfer.getData('text/plain') || '';
        if (txt.startsWith('move:')) payload = { kind: 'move', id: txt.slice(5) };
        else if (txt === 'PARALLEL' || txt === 'BRANCH' || TYPE_META[txt]) payload = { kind: 'new', type: txt === 'BRANCH' ? 'PARALLEL' : txt };
      }
      this.endDrag();
      if (!seqEl || !payload) return;
      e.preventDefault();

      const info = this.resolveSeq(seqEl);
      if (!info) return;
      const idx = this.computeInsertIndex(seqEl, e.clientX);
      const rungId = seqEl.dataset.rungId;
      activeRungId = rungId;
      this.placeNode(info, idx, payload);
    },

    openConfigModal(nodeId) {
      const loc = locateNode(nodeId);
      if (!loc || loc.node.type === 'PARALLEL') return;
      const node = loc.node;
      editingNode = node;

      const modal = document.getElementById('config-modal-overlay');
      const primaryInput = document.getElementById('config-primary-tag');
      const paramGroup = document.getElementById('config-param-group');
      const paramInput = document.getElementById('config-param-val');
      const paramLabel = document.getElementById('config-param-label');
      if (!modal || !primaryInput) return;

      const meta = TYPE_META[node.type];
      const title = modal.querySelector('.config-modal-title');
      if (title) title.textContent = `⚙️ ${meta.name}`;

      let initialVal = node.target || '';
      if (currentTags[initialVal] && currentTags[initialVal].name) {
        initialVal = currentTags[initialVal].name;
      }

      primaryInput.value = initialVal;
      primaryInput.setAttribute('autocomplete', 'off');
      primaryInput.setAttribute('spellcheck', 'false');
      primaryInput.setAttribute('placeholder', meta.areas.map(areaRangeText).join(' / '));

      let dl = document.getElementById('ladder-address-list');
      if (!dl) { dl = document.createElement('datalist'); dl.id = 'ladder-address-list'; document.body.appendChild(dl); }
      dl.innerHTML = allAddressesFor(node.type).map((a) => `<option value="${a}">${getTagName(a)}</option>`).join('');
      primaryInput.setAttribute('list', 'ladder-address-list');

      if (paramGroup && paramInput && paramLabel) {
        if (node.type === 'TON') {
          paramGroup.style.display = 'flex';
          paramLabel.textContent = 'Tempo limite (PT em segundos, 0.1 a 3600):';
          paramInput.value = node.pt || 3;
          paramInput.setAttribute('step', '0.1'); paramInput.setAttribute('min', '0.1');
        } else if (node.type === 'CTU') {
          paramGroup.style.display = 'flex';
          paramLabel.textContent = 'Contagem limite (PV em pulsos, 1 a 9999):';
          paramInput.value = node.pv || 3;
          paramInput.setAttribute('step', '1'); paramInput.setAttribute('min', '1');
        } else {
          paramGroup.style.display = 'none';
        }
      }
      this.setModalError('');
      modal.classList.add('active');
      primaryInput.focus();
      primaryInput.select();
    },

    setModalError(msg) {
      const primaryInput = document.getElementById('config-primary-tag');
      if (!primaryInput) return;
      let box = document.getElementById('config-error');
      if (!box) {
        box = document.createElement('div');
        box.id = 'config-error';
        box.className = 'config-error';
        box.setAttribute('role', 'alert');
        (primaryInput.parentElement || primaryInput).appendChild(box);
      }
      box.textContent = msg;
      box.style.display = msg ? 'block' : 'none';
      primaryInput.classList.toggle('invalid', !!msg);
    },

    closeModal() {
      const modal = document.getElementById('config-modal-overlay');
      if (modal) modal.classList.remove('active');
      editingNode = null;
    },

    saveModalConfig() {
      if (!editingNode) return;
      let rawValue = document.getElementById('config-primary-tag').value.trim().toUpperCase();
      const paramEl = document.getElementById('config-param-val');
      const paramVal = paramEl ? paramEl.value.trim() : '';

      let matchedAddr = Object.keys(currentTags).find((addr) => currentTags[addr].name.toUpperCase() === rawValue);
      if (matchedAddr) rawValue = matchedAddr;

      const v = validateAddress(editingNode.type, rawValue);
      if (!v.ok) { this.setModalError(v.error); return; }

      let pt; let pv;
      if (editingNode.type === 'TON') {
        pt = parseFloat(paramVal.replace(',', '.'));
        if (!isFinite(pt) || pt < 0.1 || pt > 3600) { this.setModalError('Tempo inválido: use um valor entre 0.1 e 3600 segundos.'); return; }
      } else if (editingNode.type === 'CTU') {
        pv = parseInt(paramVal, 10);
        if (!isFinite(pv) || pv < 1 || pv > 9999) { this.setModalError('Contagem inválida: use um inteiro entre 1 e 9999.'); return; }
      }

      History.checkpoint();
      const changedTag = editingNode.target !== v.tag;
      editingNode.target = v.tag;
      if (pt !== undefined) {
        editingNode.pt = Math.round(pt * 100) / 100;
        const t = ensureTimer(v.tag, editingNode.pt);
        t.pt = editingNode.pt;
        if (changedTag) { t.acc = 0; t.dn = false; }
      }
      if (pv !== undefined) {
        editingNode.pv = pv;
        const c = ensureCounter(v.tag, pv);
        c.pv = pv;
        c.dn = c.cv >= c.pv;
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

      bindOnce(document.getElementById('config-modal-overlay'), 'modal', (el) => {
        el.addEventListener('mousedown', (e) => { if (e.target === el) this.closeModal(); });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') { e.preventDefault(); this.closeModal(); }
          else if (e.key === 'Enter') { e.preventDefault(); this.saveModalConfig(); }
        });
      });
      bindOnce(document.getElementById('config-primary-tag'), 'input', (el) => el.addEventListener('input', () => this.setModalError('')));

      this.bindHardware();
      this.bindPalette();
      this.bindWorkspace();

      if (!this._globalBound) {
        this._globalBound = true;
        window.addEventListener('pointerup', () => this.releaseAllInputs());
        window.addEventListener('pointercancel', () => this.releaseAllInputs());
        window.addEventListener('blur', () => this.releaseAllInputs());
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
      }
    },

    bindHardware() {
      bindOnce(document.getElementById('plc-inputs-container'), 'hw', (box) => {
        box.addEventListener('pointerdown', (e) => {
          if (e.target.closest('.io-mode-btn')) return;
          const card = e.target.closest('.input-card');
          if (!card) return;
          e.preventDefault();
          this.pressInput(parseInt(card.dataset.input, 10));
        });
        box.addEventListener('click', (e) => {
          const b = e.target.closest('.io-mode-btn');
          if (b) this.toggleInputMode(parseInt(b.dataset.inputMode, 10));
        });
        box.addEventListener('keydown', (e) => {
          const card = e.target.closest && e.target.closest('.input-card');
          if (card && e.target === card && (e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            this.pressInput(parseInt(card.dataset.input, 10));
          }
        });
        box.addEventListener('keyup', (e) => {
          const card = e.target.closest && e.target.closest('.input-card');
          if (card && e.target === card && (e.key === ' ' || e.key === 'Enter')) this.releaseInput(parseInt(card.dataset.input, 10));
        });
      });
    },

    detectPaletteType(item) {
      const direct = item.dataset.type || item.dataset.nodeType || item.dataset.component;
      if (direct && (TYPE_META[direct] || direct === 'PARALLEL' || direct === 'BRANCH')) return direct === 'BRANCH' ? 'PARALLEL' : direct;

      const inline = item.getAttribute('ondragstart') || '';
      const m = inline.match(/['"]([A-Z_]+)['"]/);
      if (m && (TYPE_META[m[1]] || m[1] === 'PARALLEL' || m[1] === 'BRANCH')) return m[1] === 'BRANCH' ? 'PARALLEL' : m[1];

      const labelEl = item.querySelector('.palette-label');
      const text = ((labelEl ? labelEl.textContent : item.textContent) || '').toLowerCase();
      if (text.includes('paralelo') || text.includes('selo')) return 'PARALLEL';
      if (text.includes('reset')) return 'RESET';
      if (text.includes('set')) return 'SET';
      if (text.includes('direta') || text.includes('bobina')) return 'COIL';
      if (text.includes('contato na')) return 'NO';
      if (text.includes('contato nf')) return 'NC';
      if (text.includes('pulso') || text.includes('borda')) return 'P_EDGE';
      if (text.includes('temporizador') || text.includes('ton')) return 'TON';
      if (text.includes('contador') || text.includes('ctu')) return 'CTU';
      return null;
    },

    bindPalette() {
      document.querySelectorAll('.palette-item, .btn-palette').forEach((item) => {
        const type = this.detectPaletteType(item);
        if (!type) return;
        bindOnce(item, 'palette', () => {
          item.dataset.nodeType = type;
          item.setAttribute('draggable', 'true');
          item.setAttribute('tabindex', '0');
          item.setAttribute('role', 'button');
          item.addEventListener('dragstart', (e) => this.handleDragStart(e, type));
          item.addEventListener('dragend', () => this.endDrag());
          item.addEventListener('click', () => this.addFromPalette(type));
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.addFromPalette(type); }
          });
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
        else if (a === 'import') { const f = document.getElementById('ladder-import-file'); if (f) f.click(); }
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

    isTyping(e) {
      const t = e.target;
      return !!(t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'));
    },

    onKeyDown(e) {
      const ws = document.getElementById('ladder-workspace');
      if (!ws || ws.offsetParent === null) return;
      const modalOpen = document.getElementById('config-modal-overlay');
      if (modalOpen && modalOpen.classList.contains('active')) return;
      if (this.isTyping(e)) return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
      else if (ctrl && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); this.redo(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) { e.preventDefault(); this.deleteNode(selectedNodeId); }
      else if (e.key === 'Enter' && selectedNodeId) { e.preventDefault(); this.openConfigModal(selectedNodeId); }
      else if (e.key === 'Escape' && selectedNodeId) { this.selectNode(null); }
    }
  };

  /* ========================================================================
   * 8. PEQUENOS COMPONENTES DE UI
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
   * 9. EXPORTAÇÃO GLOBAL
   * ====================================================================== */
  window.SimulatorModule = SimulatorModule;
  window.LadderEvaluator = LadderEvaluator;
  window.LadderRenderer = LadderRenderer;
  window.cpuState = cpuState;
  window.ladderProgram = ladderProgram;
  window.LadderHistory = History;
})();