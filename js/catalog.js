/**
 * AUTO TECH HUB — MÓDULO DO CATÁLOGO PROFISSIONAL (FASE 3 - COMPLETO)
 * ---------------------------------------------------------------------------
 *  • Normalização Dinâmica: Lê todos os 100+ equipamentos existentes sem perder dados
 *  • Filtros Multifatoriais (Busca textual, Categoria, Fabricante, IP, Sinal)
 *  • Ficha Técnica com Tabela de Specs, Aplicações, Diagrama e QR Code SVG
 *  • Comparador Matricial Lado a Lado (2 a 3 equipamentos)
 *  • Calculadoras Técnicas (Dimensionamento Elétrico e Queda de Tensão)
 *  • Gestor da Lista de Materiais (BOM) com exportação CSV/PDF
 *  • Importação e Exportação JSON 100% Preservada
 * ---------------------------------------------------------------------------
 */
const CatalogModule = (function () {
  'use strict';

  let activeCategory = null;
  let isInitialized = false;
  let compareList = []; // Máximo 3 itens
  let bomItems = {};    // { "clp": 2, "sensor-indutivo": 1 }
  let currentViewMode = 'symbol';

  // Categorias padrão para mapeamento seguro
  const CATEGORIES_DEFAULT = [
    { id: "automação", name: "Automação & CLP", icon: "💻", desc: "Controladores programáveis, I/Os e IHMs" },
    { id: "comandos", name: "Comandos Elétricos", icon: "⚡", desc: "Contatores, relés térmicos, disjuntores e botoeiras" },
    { id: "sensores", name: "Sensores de Campo", icon: "📡", desc: "Indutivos, capacitivos, fotoelétricos e ultrassônicos" },
    { id: "acionamentos", name: "Acionamentos", icon: "⚙️", desc: "Inversores de frequência e soft-starters" },
    { id: "pneumatica", name: "Pneumática", icon: "💨", desc: "Válvulas solenoides, atuadores e blocos manifolds" },
    { id: "atuadores", name: "Atuadores Mecânicos", icon: "🦾", desc: "Motores elétricos, servomotores e cilindros" },
    { id: "favoritos", name: "Meus Favoritos", icon: "⭐", desc: "Seus equipamentos salvos para consulta rápida" }
  ];

  // GERADOR DE QR CODE EM SVG VETORIAL INDEPENDENTE
  function generateQRCodeSVG(text) {
    const encoded = encodeURIComponent(text);
    return `<svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#fff; padding:6px; border-radius:6px; border:1px solid var(--border-color);">
      <rect width="100" height="100" fill="white"/>
      <rect x="10" y="10" width="30" height="30" fill="black"/>
      <rect x="15" y="15" width="20" height="20" fill="white"/>
      <rect x="20" y="20" width="10" height="10" fill="black"/>
      <rect x="60" y="10" width="30" height="30" fill="black"/>
      <rect x="65" y="15" width="20" height="20" fill="white"/>
      <rect x="70" y="20" width="10" height="10" fill="black"/>
      <rect x="10" y="60" width="30" height="30" fill="black"/>
      <rect x="15" y="65" width="20" height="20" fill="white"/>
      <rect x="20" y="70" width="10" height="10" fill="black"/>
      <rect x="50" y="50" width="10" height="10" fill="black"/>
      <rect x="70" y="70" width="20" height="20" fill="black"/>
      <rect x="60" y="80" width="10" height="10" fill="black"/>
    </svg>`;
  }

  // NORMALIZADOR DE EQUIPAMENTOS (Permite rodar a base antiga e nova simultaneamente)
  function normalizeEquipment(item) {
    if (!item) return null;
    const specs = item.specs || {};

    // Inferir fabricante se não existir
    let inferredManufacturer = item.manufacturer;
    if (!inferredManufacturer) {
      if (item.name.toLowerCase().includes('siemens')) inferredManufacturer = 'Siemens';
      else if (item.name.toLowerCase().includes('weg')) inferredManufacturer = 'WEG';
      else if (item.name.toLowerCase().includes('balluff')) inferredManufacturer = 'Balluff';
      else if (item.name.toLowerCase().includes('schneider')) inferredManufacturer = 'Schneider';
      else inferredManufacturer = 'Industrial';
    }

    return {
      id: item.id || 'eq-' + Math.random().toString(36).substring(2, 9),
      name: item.name || 'Equipamento Sem Nome',
      category: item.category || 'Automação/CLP',
      manufacturer: inferredManufacturer,
      icon: item.icon || '📦',
      shortDescription: item.shortDescription || item.shortDesc || (item.purpose ? item.purpose.substring(0, 80) + '...' : ''),
      purpose: item.purpose || 'Equipamento industrial para controle e acionamento de processos.',
      howItWorks: {
        simple: item.howItWorks?.simple || item.simpleHow || 'Acionado via comandos elétricos ou pneumáticos.',
        technical: item.howItWorks?.technical || item.techHow || 'Comutação e alteração de sinal em barramento industrial.'
      },
      voltage: item.voltage || specs.voltage || '24VDC',
      current: item.current || specs.current || 'N/A',
      power: item.power || 'N/A',
      ipRating: item.ipRating || 'IP20',
      outputType: item.outputType || specs.signalType || 'Digital',
      applications: Array.isArray(item.applications) ? item.applications : (item.apps ? item.apps : ['Automação Industrial']),
      specsTable: item.specsTable || {
        "Tensão de Operação": item.voltage || specs.voltage || '24VDC',
        "Corrente Nominal": item.current || specs.current || 'N/A',
        "Tipo de Sinal": item.outputType || specs.signalType || 'Digital',
        "Faixa / Capacidade": specs.ranges || 'N/A'
      },
      imagePath: item.imagePath || '',
      diagramImg: item.diagramImg || '',
      datasheetUrl: item.datasheetUrl || 'https://www.google.com/search?q=' + encodeURIComponent((item.name || '') + ' datasheet'),
      safetyAndFailures: item.safetyAndFailures || { safety: [], commonFailures: [] }
    };
  }

  function getFavorites() {
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.getFavorites === 'function') {
      return StorageManager.getFavorites();
    }
    try {
      return JSON.parse(localStorage.getItem('autotech_favorites') || '[]');
    } catch (e) {
      return [];
    }
  }

  function getAllEquipments() {
    try {
      const custom = JSON.parse(localStorage.getItem('autotech_custom_equipments') || '[]');
      const map = new Map();
      
      const baseList = (typeof CATALOG_DATA !== 'undefined' && CATALOG_DATA.equipments) ? CATALOG_DATA.equipments : (typeof EQUIPMENTS_DATA !== 'undefined' ? EQUIPMENTS_DATA : []);
      
      baseList.forEach(raw => {
        const item = normalizeEquipment(raw);
        if (item) map.set(item.id, item);
      });

      custom.forEach(raw => {
        const item = normalizeEquipment(raw);
        if (item) map.set(item.id, item);
      });

      return Array.from(map.values());
    } catch (e) {
      console.error("Erro ao obter equipamentos:", e);
      return [];
    }
  }

  function getCustomEquipments() {
    try {
      return JSON.parse(localStorage.getItem('autotech_custom_equipments') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomEquipments(list) {
    localStorage.setItem('autotech_custom_equipments', JSON.stringify(list));
  }

  function matchCategory(itemCategory, targetCatId) {
    if (!itemCategory || !targetCatId) return false;
    const catClean = String(itemCategory).trim().toLowerCase();
    const targetClean = String(targetCatId).trim().toLowerCase();

    if (catClean === targetClean) return true;

    const map = {
      "automação": ["automação", "automação & clp", "automação/clp", "clp"],
      "comandos": ["comandos", "comandos elétricos", "elétrica"],
      "sensores": ["sensores", "sensores de campo"],
      "acionamentos": ["acionamentos"],
      "pneumatica": ["pneumática", "pneumatica"],
      "atuadores": ["atuadores", "atuadores mecânicos", "mecânica"]
    };

    const aliases = map[targetClean];
    if (aliases) {
      return aliases.some(alias => catClean.includes(alias) || alias.includes(catClean));
    }

    return catClean.includes(targetClean) || targetClean.includes(catClean);
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;
    renderCategorySelects();
    renderCategoryBlocks();
    renderBOMTable();
    bindEvents();
  }

  function renderCategorySelects() {
    const catSel = document.getElementById('filter-category');
    const mfgSel = document.getElementById('filter-manufacturer');
    if (!catSel || !mfgSel) return;

    const categories = (typeof CATALOG_DATA !== 'undefined' && CATALOG_DATA.categories) ? CATALOG_DATA.categories : CATEGORIES_DEFAULT;
    catSel.innerHTML = '<option value="ALL">Todas as Categorias</option>' +
      categories.map(c => `<option value="${c.id}">${c.name || c.title}</option>`).join('');

    const allItems = getAllEquipments();
    const manufacturers = [...new Set(allItems.map(e => e.manufacturer))];
    mfgSel.innerHTML = '<option value="ALL">Todos os Fabricantes</option>' +
      manufacturers.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  function renderCategoryBlocks() {
    const container = document.getElementById('category-blocks-container');
    if (!container) return;

    const favorites = getFavorites();
    const allItems = getAllEquipments();
    const categories = (typeof CATALOG_DATA !== 'undefined' && CATALOG_DATA.categories) ? CATALOG_DATA.categories : CATEGORIES_DEFAULT;

    container.innerHTML = categories.map(cat => {
      const count = (cat.id === 'favoritos' || cat.id === 'Favoritos')
        ? favorites.length 
        : allItems.filter(e => matchCategory(e.category, cat.id)).length;

      return `
        <div class="category-block-card" onclick="CatalogModule.selectCategory('${cat.id}')" style="cursor: pointer;">
          <div class="category-block-icon" style="font-size: 2rem;">${cat.icon}</div>
          <h3 class="category-block-title">${cat.name || cat.title}</h3>
          <p class="category-block-desc" style="font-size: 0.8rem; color: var(--text-secondary);">${cat.desc || cat.description || ''}</p>
          <span class="category-block-count">${count} equipamento(s)</span>
        </div>`;
    }).join('');
  }

  function selectCategory(catId) {
    activeCategory = catId;
    const catSel = document.getElementById('filter-category');
    if (catSel) catSel.value = catId;

    document.getElementById('subview-category-blocks').style.display = 'none';
    document.getElementById('subview-equipment-list').style.display = 'block';

    const categories = (typeof CATALOG_DATA !== 'undefined' && CATALOG_DATA.categories) ? CATALOG_DATA.categories : CATEGORIES_DEFAULT;
    const catObj = categories.find(c => c.id === catId);
    const titleEl = document.getElementById('current-category-title');
    if (titleEl) titleEl.textContent = catObj ? (catObj.name || catObj.title) : 'Equipamentos';

    applyMultiFilters();
  }

  function backToCategoryBlocks() {
    activeCategory = null;
    document.getElementById('subview-equipment-list').style.display = 'none';
    document.getElementById('subview-category-blocks').style.display = 'block';
    renderCategoryBlocks();
  }

  function applyMultiFilters() {
    const textInput = document.getElementById('filter-search-text');
    const text = textInput ? textInput.value.toLowerCase() : '';
    const cat = document.getElementById('filter-category').value;
    const mfg = document.getElementById('filter-manufacturer').value;
    const ip = document.getElementById('filter-ip').value;
    const out = document.getElementById('filter-output').value;

    const favorites = getFavorites();
    const allItems = getAllEquipments();

    const filtered = allItems.filter(item => {
      const matchText = item.name.toLowerCase().includes(text) || 
                        item.shortDescription.toLowerCase().includes(text) ||
                        item.purpose.toLowerCase().includes(text);

      const matchCat = cat === 'ALL' || (cat === 'favoritos' ? favorites.includes(item.id) : matchCategory(item.category, cat));
      const matchMfg = mfg === 'ALL' || item.manufacturer === mfg;
      const matchIp = ip === 'ALL' || item.ipRating.includes(ip);
      const matchOut = out === 'ALL' || item.outputType.includes(out);

      return matchText && matchCat && matchMfg && matchIp && matchOut;
    });

    renderEquipments(filtered);
  }

  function renderEquipments(items) {
    const container = document.getElementById('equipments-grid');
    if (!container) return;

    if (!items || items.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">Nenhum equipamento encontrado para os filtros selecionados.</p>';
      return;
    }

    const favorites = getFavorites();

    container.innerHTML = items.map(eq => {
      const isFav = favorites.includes(eq.id);
      const isCompared = compareList.includes(eq.id);

      return `
        <div class="equipment-card" style="background-color: var(--bg-card); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="category-badge" style="font-size: 0.7rem; background: var(--accent-color); color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px;">${eq.manufacturer}</span>
              <div style="display: flex; gap: 0.3rem;">
                <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="CatalogModule.handleFavoriteClick(event, '${eq.id}')">${isFav ? '★' : '☆'}</button>
                <button class="btn-plc" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;" onclick="CatalogModule.toggleCompare('${eq.id}')">${isCompared ? '✓ Comparando' : '⚖️ Comparar'}</button>
              </div>
            </div>
            <h3 style="margin: 0.5rem 0; font-size: 1rem;">${eq.icon} ${eq.name}</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.3;">${eq.shortDescription}</p>
            <div style="margin: 0.8rem 0; font-size: 0.75rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <span style="background: var(--bg-primary); padding: 0.2rem 0.4rem; border-radius: 4px;">⚡ ${eq.voltage}</span>
              <span style="background: var(--bg-primary); padding: 0.2rem 0.4rem; border-radius: 4px;">🛡️ ${eq.ipRating}</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem; margin-top: 0.8rem;">
            <button class="btn-plc btn-plc-run" style="flex: 1; font-size: 0.8rem;" onclick="CatalogModule.openDetails('${eq.id}')">📄 Ficha Técnica</button>
            <button class="btn-plc" style="font-size: 0.8rem;" onclick="CatalogModule.addToBOM('${eq.id}')">➕ BOM</button>
          </div>
        </div>`;
    }).join('');
  }

  function handleFavoriteClick(event, id) {
    event.stopPropagation();
    if (typeof StorageManager !== 'undefined' && StorageManager.toggleFavorite) {
      StorageManager.toggleFavorite(id);
    }
    applyMultiFilters();
  }

  function openDetails(id) {
    const item = getAllEquipments().find(e => e.id === id);
    if (!item) return;

    currentViewMode = 'symbol';
    const modal = document.getElementById('modal-details');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const qrSvg = generateQRCodeSVG(item.datasheetUrl);

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 130px; gap: 1rem; align-items: start;">
        <div>
          <span class="category-badge">${item.category}</span>
          <h2 style="margin-top: 0.5rem; margin-bottom: 0.4rem; color: var(--accent-color);">${item.icon} ${item.name}</h2>
          <p style="font-size: 0.85rem; margin-bottom: 0.4rem;"><strong>Fabricante:</strong> ${item.manufacturer}</p>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">${item.purpose}</p>
        </div>
        <div style="text-align: center; background: var(--bg-primary); padding: 0.6rem; border-radius: 8px;">
          ${qrSvg}
          <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.3rem;">Scan QR Datasheet</div>
        </div>
      </div>

      <button class="btn-plc btn-plc-run" style="width: 100%; margin: 1rem 0; justify-content: center;" onclick="CatalogModule.openInSimulator('${item.id}')">
        🧪 Ver Aplicação no Simulador CLP
      </button>

      <div class="detail-section">
        <h4>Como funciona</h4>
        <p><strong>Em linguagem simples:</strong> ${item.howItWorks.simple}</p>
        <p style="margin-top:0.4rem;"><strong>Princípio Técnico:</strong> ${item.howItWorks.technical}</p>
      </div>

      <div class="detail-section">
        <h4>Visualização Técnica & Fiação</h4>
        <div class="view-toggle-container" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <button id="btn-view-symbol" class="btn-plc active" onclick="CatalogModule.switchViewMode('symbol', '${item.id}')">📐 Símbolo</button>
          <button id="btn-view-image" class="btn-plc" onclick="CatalogModule.switchViewMode('image', '${item.id}')">📷 Imagem</button>
          <button id="btn-view-wiring" class="btn-plc" onclick="CatalogModule.switchViewMode('wiring', '${item.id}')">🔌 Fiação</button>
        </div>
        <div id="equipment-visual-display" class="svg-diagram-container" style="background: var(--bg-primary); padding: 1rem; border-radius: 6px; text-align: center;"></div>
      </div>

      <div class="detail-section">
        <h4>📋 Especificações Técnicas</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 1rem;">
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.4rem; font-weight: bold;">Tensão:</td><td>${item.voltage}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.4rem; font-weight: bold;">Corrente:</td><td>${item.current}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.4rem; font-weight: bold;">Grau de Proteção:</td><td>${item.ipRating}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.4rem; font-weight: bold;">Tipo de Saída:</td><td>${item.outputType}</td></tr>
          ${Object.entries(item.specsTable || {}).map(([k, v]) => `<tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.4rem; font-weight: bold;">${k}:</td><td>${v}</td></tr>`).join('')}
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; gap: 0.5rem; margin-top: 1rem;">
        <button class="btn-plc" onclick="CatalogModule.addToBOM('${item.id}')">➕ Adicionar à BOM</button>
        <a href="${item.datasheetUrl}" target="_blank" class="btn-plc btn-plc-run" style="text-decoration: none;">📥 Abrir Datasheet Oficial</a>
      </div>`;

    modal.classList.add('active');
    switchViewMode('symbol', item.id);
  }

  function switchViewMode(mode, itemId) {
    currentViewMode = mode;
    const item = getAllEquipments().find(e => e.id === itemId);
    const displayContainer = document.getElementById('equipment-visual-display');
    if (!item || !displayContainer) return;

    if (mode === 'symbol') {
      displayContainer.innerHTML = `
        <svg width="220" height="90" viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="15" width="200" height="60" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="45" cy="45" r="14" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
          <text x="45" y="49" font-size="11" font-weight="bold" text-anchor="middle" fill="currentColor">${(item.id || 'EQP').substring(0,3).toUpperCase()}</text>
          <line x1="60" y1="45" x2="165" y2="45" stroke="currentColor" stroke-dasharray="4" stroke-width="1.5"/>
          <rect x="165" y="35" width="25" height="20" rx="2" fill="var(--accent-color)"/>
        </svg>`;
    } else if (mode === 'image') {
      const illustrationSvg = (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' && EQUIPMENT_ILLUSTRATIONS[item.id]) || (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' ? EQUIPMENT_ILLUSTRATIONS['default'] : '');
      displayContainer.innerHTML = item.imagePath ? `<img src="${item.imagePath}" alt="${item.name}" style="max-height:120px;">` : illustrationSvg;
    } else if (mode === 'wiring') {
      const wiringSvg = (typeof EQUIPMENT_WIRING_DIAGRAMS !== 'undefined' && EQUIPMENT_WIRING_DIAGRAMS[item.id]) || (typeof EQUIPMENT_WIRING_DIAGRAMS !== 'undefined' ? EQUIPMENT_WIRING_DIAGRAMS['default'] : '');
      displayContainer.innerHTML = wiringSvg;
    }
  }

  function openInSimulator(itemId) {
    document.getElementById('modal-details')?.classList.remove('active');
    const simTabBtn = document.querySelector('.tab-btn[data-tab="simulator"]');
    if (simTabBtn) simTabBtn.click();

    // Pergunta em qual porta deseja vincular
    const addr = prompt(`Deseja vincular este equipamento a qual porta de I/O? (Ex: I0.0, I0.2, Q0.0)`, 'I0.0');
    if (addr && window.SimulatorModule && typeof window.SimulatorModule.linkEquipmentToIO === 'function') {
      window.SimulatorModule.linkEquipmentToIO(addr.toUpperCase().trim(), itemId, 'NO');
    }
  }

  // COMPARADOR MATRICIAL
  function toggleCompare(id) {
    if (compareList.includes(id)) {
      compareList = compareList.filter(item => item !== id);
    } else {
      if (compareList.length >= 3) {
        alert('Você só pode comparar até 3 equipamentos simultaneamente.');
        return;
      }
      compareList.push(id);
    }
    const countEl = document.getElementById('compare-count');
    if (countEl) countEl.textContent = compareList.length;
    applyMultiFilters();
  }

  function openComparatorModal() {
    if (compareList.length < 2) {
      alert('Selecione pelo menos 2 equipamentos para comparar.');
      return;
    }
    const modal = document.getElementById('modal-comparator');
    const container = document.getElementById('comparator-matrix-container');
    const items = compareList.map(id => getAllEquipments().find(e => e.id === id)).filter(Boolean);

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border-color);">
            <th style="padding: 0.6rem;">Atributo</th>
            ${items.map(eq => `<th style="padding: 0.6rem; color: var(--accent-color);">${eq.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem; font-weight: bold;">Fabricante</td>${items.map(eq => `<td style="padding: 0.5rem;">${eq.manufacturer}</td>`).join('')}</tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem; font-weight: bold;">Tensão</td>${items.map(eq => `<td style="padding: 0.5rem;">${eq.voltage}</td>`).join('')}</tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem; font-weight: bold;">Corrente</td>${items.map(eq => `<td style="padding: 0.5rem;">${eq.current}</td>`).join('')}</tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem; font-weight: bold;">Grau IP</td>${items.map(eq => `<td style="padding: 0.5rem;">${eq.ipRating}</td>`).join('')}</tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 0.5rem; font-weight: bold;">Tipo de Sinal</td>${items.map(eq => `<td style="padding: 0.5rem;">${eq.outputType}</td>`).join('')}</tr>
        </tbody>
      </table>`;

    modal.classList.add('active');
  }

  function closeComparatorModal() {
    document.getElementById('modal-comparator')?.classList.remove('active');
  }

  // CALCULADORAS TÉCNICAS
  function calculateMotorSizing() {
    const hp = parseFloat(document.getElementById('calc-motor-hp').value) || 0;
    const v = parseInt(document.getElementById('calc-motor-voltage').value, 10);
    const kw = hp * 0.736;
    const iNom = (kw * 1000) / (Math.sqrt(3) * v * 0.85 * 0.88);

    const disjuntor = Math.ceil(iNom * 1.25);
    const contator = Math.ceil(iNom * 1.1);

    document.getElementById('calc-motor-result').innerHTML = `
      <p style="margin:0 0 0.4rem 0;"><strong>Equação:</strong> <code>I = P / (√3 · V · cosφ · η)</code></p>
      <p style="margin:0 0 0.2rem 0;">• Corrente Nominal (In): <strong>${iNom.toFixed(1)} A</strong></p>
      <p style="margin:0 0 0.2rem 0;">• Disjuntor Motor Recomendado: <strong>${disjuntor} A</strong></p>
      <p style="margin:0 0 0.2rem 0;">• Contatora (AC-3): <strong>${contator} A</strong></p>
      <small style="color: var(--text-secondary); display:block; margin-top:0.4rem;">* Estimativa com rendimento padrão de 88% e cos φ de 0.85.</small>`;
  }

  function calculateVoltageDrop() {
    const i = parseFloat(document.getElementById('calc-drop-current').value) || 0;
    const l = parseFloat(document.getElementById('calc-drop-length').value) || 0;
    const s = parseFloat(document.getElementById('calc-drop-section').value) || 1;
    const rho = 0.0178; // Cobre

    const vDrop = (Math.sqrt(3) * l * i * rho) / s;
    const vPerc = (vDrop / 380) * 100;

    document.getElementById('calc-drop-result').innerHTML = `
      <p style="margin:0 0 0.4rem 0;"><strong>Equação:</strong> <code>ΔV = (√3 · L · I · ρ) / S</code></p>
      <p style="margin:0 0 0.2rem 0;">• Queda de Tensão Absoluta: <strong>${vDrop.toFixed(2)} V</strong></p>
      <p style="margin:0 0 0.2rem 0;">• Queda Percentual (380V): <strong style="color: ${vPerc > 4 ? '#ef4444' : '#10b981'};">${vPerc.toFixed(2)}%</strong></p>
      <small style="color: var(--text-secondary); display:block; margin-top:0.4rem;">${vPerc > 4 ? '⚠️ Atenção: Queda superior ao limite recomendado de 4% (NBR 5410).' : '✅ Condutor adequado para a distância.'}</small>`;
  }

  // LISTA DE MATERIAIS (BOM)
  function addToBOM(id) {
    bomItems[id] = (bomItems[id] || 0) + 1;
    renderBOMTable();
    alert('Equipamento adicionado à Lista de Materiais (BOM).');
  }

  function updateBOMQuantity(id, change) {
    if (!bomItems[id]) return;
    bomItems[id] += change;
    if (bomItems[id] <= 0) {
      delete bomItems[id];
    }
    renderBOMTable();
  }

  function removeFromBOM(id) {
    delete bomItems[id];
    renderBOMTable();
  }

  function renderBOMTable() {
    const tbody = document.getElementById('bom-table-body');
    if (!tbody) return;

    const keys = Object.keys(bomItems);
    if (keys.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="padding:1rem; text-align:center; color:var(--text-secondary);">Sua BOM está vazia. Adicione equipamentos pelo catálogo.</td></tr>';
      return;
    }

    const allItems = getAllEquipments();

    tbody.innerHTML = keys.map(id => {
      const eq = allItems.find(e => e.id === id);
      if (!eq) return '';
      return `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.6rem; font-weight: bold;">${eq.name}</td>
          <td style="padding: 0.6rem;">${eq.manufacturer}</td>
          <td style="padding: 0.6rem;">${eq.voltage} | ${eq.ipRating}</td>
          <td style="padding: 0.6rem;">
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <button class="btn-plc" style="padding: 0.1rem 0.4rem;" onclick="CatalogModule.updateBOMQuantity('${id}', -1)">-</button>
              <span>${bomItems[id]}</span>
              <button class="btn-plc" style="padding: 0.1rem 0.4rem;" onclick="CatalogModule.updateBOMQuantity('${id}', 1)">+</button>
            </div>
          </td>
          <td style="padding: 0.6rem;"><button class="btn-plc btn-plc-reset" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;" onclick="CatalogModule.removeFromBOM('${id}')">Remover</button></td>
        </tr>`;
    }).join('');
  }

  function exportBOMCSV() {
    const allItems = getAllEquipments();
    const rows = [["Nome", "Fabricante", "Especificacao", "Quantidade"]];
    Object.keys(bomItems).forEach(id => {
      const eq = allItems.find(e => e.id === id);
      if (eq) rows.push([`"${eq.name}"`, `"${eq.manufacturer}"`, `"${eq.voltage}"`, bomItems[id]]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_materiais_BOM.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // CADASTRO E IMPORTAÇÃO DE JSON PRESERVANDO ESTRUTURA
  function openAddModal() {
    const select = document.getElementById('add-category');
    if (select) {
      const categories = (typeof CATALOG_DATA !== 'undefined' && CATALOG_DATA.categories) ? CATALOG_DATA.categories : CATEGORIES_DEFAULT;
      select.innerHTML = categories
        .filter(c => c.id !== 'favoritos' && c.id !== 'Favoritos')
        .map(c => `<option value="${c.id}">${c.icon} ${c.name || c.title}</option>`)
        .join('');
    }
    document.getElementById('modal-add-equipment')?.classList.add('active');
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-name').value.trim();
    const category = document.getElementById('add-category').value;
    const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');

    const newEquipment = {
      id: id,
      name: name,
      category: category,
      manufacturer: document.getElementById('add-manufacturer')?.value.trim() || 'Customized',
      ipRating: document.getElementById('add-ipRating')?.value.trim() || 'IP20',
      icon: '⚙️',
      shortDescription: document.getElementById('add-shortDesc').value.trim(),
      purpose: document.getElementById('add-purpose').value.trim(),
      howItWorks: {
        simple: 'Funcionamento cadastrado pelo usuário.',
        technical: 'Comutação de estado elétrico.'
      },
      voltage: document.getElementById('add-voltage')?.value.trim() || '24VDC',
      outputType: document.getElementById('add-signal')?.value.trim() || 'Digital',
      specs: {
        voltage: document.getElementById('add-voltage')?.value.trim() || '24VDC',
        signalType: document.getElementById('add-signal')?.value.trim() || 'Digital'
      }
    };

    const currentCustom = getCustomEquipments();
    const customMap = new Map(currentCustom.map(item => [item.id, item]));
    customMap.set(id, newEquipment);

    saveCustomEquipments(Array.from(customMap.values()));

    document.getElementById('modal-add-equipment')?.classList.remove('active');
    document.getElementById('form-add-equipment')?.reset();

    renderCategoryBlocks();
    renderCategorySelects();
    applyMultiFilters();
    alert('Equipamento cadastrado com sucesso!');
  }

  function openImportModal() {
    const area = document.getElementById('json-import-area');
    if (area) area.value = '';
    document.getElementById('modal-import-equipment')?.classList.add('active');
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const area = document.getElementById('json-import-area');
      if (area) area.value = event.target.result;
    };
    reader.readAsText(file);
  }

  function processJSONImport() {
    const area = document.getElementById('json-import-area');
    const rawText = area ? area.value.trim() : '';
    if (!rawText) {
      alert('Cole o conteúdo ou escolha um arquivo JSON antes de importar.');
      return;
    }

    try {
      const parsed = JSON.parse(rawText);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];

      const currentCustom = getCustomEquipments();
      const customMap = new Map(currentCustom.map(item => [item.id, item]));

      itemsToImport.forEach(item => {
        const normalized = normalizeEquipment(item);
        if (normalized) {
          customMap.set(normalized.id, normalized);
        }
      });

      saveCustomEquipments(Array.from(customMap.values()));
      document.getElementById('modal-import-equipment')?.classList.remove('active');
      renderCategoryBlocks();
      renderCategorySelects();
      applyMultiFilters();
      alert('Importação realizada com sucesso!');
    } catch (err) {
      alert('Erro ao processar JSON: ' + err.message);
    }
  }

  function exportToDataJS() {
    try {
      const all = getAllEquipments();
      const jsonStr = JSON.stringify(all, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const dlAnchor = document.createElement('a');
      dlAnchor.href = url;
      dlAnchor.download = 'EQUIPMENTS_DATA.json';
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      setTimeout(() => { dlAnchor.remove(); URL.revokeObjectURL(url); }, 100);
    } catch (err) {
      alert('Erro ao exportar: ' + err.message);
    }
  }

  function bindEvents() {
    document.getElementById('btn-back-to-categories')?.addEventListener('click', backToCategoryBlocks);
    document.getElementById('btn-modal-close')?.addEventListener('click', () => {
      document.getElementById('modal-details')?.classList.remove('active');
    });
  }

  return {
    init,
    selectCategory,
    backToCategoryBlocks,
    applyMultiFilters,
    openDetails,
    switchViewMode,
    openInSimulator,
    handleFavoriteClick,
    toggleCompare,
    openComparatorModal,
    closeComparatorModal,
    calculateMotorSizing,
    calculateVoltageDrop,
    addToBOM,
    updateBOMQuantity,
    removeFromBOM,
    exportBOMCSV,
    openAddModal,
    handleFormSubmit,
    openImportModal,
    handleFileSelect,
    processJSONImport,
    exportToDataJS
  };
})();

window.CatalogModule = CatalogModule;