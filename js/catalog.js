/**
 * Módulo de Gestão do Catálogo com Suporte Robusto a Cadastro e Importação Dinâmica
 */
const CatalogModule = {
  activeCategory: null,
  searchQuery: '',
  currentViewMode: 'symbol',

  init() {
    this.renderCategoryBlocks();
    this.bindEvents();
  },

  getFavorites() {
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.getFavorites === 'function') {
      return StorageManager.getFavorites();
    }
    try {
      return JSON.parse(localStorage.getItem('autotech_favorites') || '[]');
    } catch (e) {
      return [];
    }
  },

  getAllEquipments() {
    try {
      const custom = JSON.parse(localStorage.getItem('autotech_custom_equipments') || '[]');
      const map = new Map();
      
      if (typeof EQUIPMENTS_DATA !== 'undefined' && Array.isArray(EQUIPMENTS_DATA)) {
        EQUIPMENTS_DATA.forEach(item => map.set(item.id, item));
      }
      
      custom.forEach(item => map.set(item.id, item));

      return Array.from(map.values());
    } catch (e) {
      console.error("Erro ao obter equipamentos:", e);
      return typeof EQUIPMENTS_DATA !== 'undefined' ? EQUIPMENTS_DATA : [];
    }
  },

  getCustomEquipments() {
    try {
      return JSON.parse(localStorage.getItem('autotech_custom_equipments') || '[]');
    } catch (e) {
      return [];
    }
  },

  saveCustomEquipments(list) {
    localStorage.setItem('autotech_custom_equipments', JSON.stringify(list));
  },

  // Validação flexível para relacionar IDs curtos ("clp") com Nomes Completos ("Automação & CLP")
  matchCategory(itemCategory, targetCategoryId) {
    if (!itemCategory || !targetCategoryId) return false;
    const catClean = String(itemCategory).trim().toLowerCase();
    const targetClean = String(targetCategoryId).trim().toLowerCase();

    if (catClean === targetClean) return true;

    if (typeof CATEGORIES_META !== 'undefined') {
      const meta = CATEGORIES_META.find(c => 
        String(c.id).trim().toLowerCase() === targetClean || 
        String(c.title).trim().toLowerCase() === targetClean
      );
      if (meta) {
        const metaId = String(meta.id).trim().toLowerCase();
        const metaTitle = String(meta.title).trim().toLowerCase();
        return catClean === metaId || catClean === metaTitle;
      }
    }
    return false;
  },

  renderCategoryBlocks() {
    const container = document.getElementById('category-blocks-container');
    if (!container) return;

    const favorites = this.getFavorites();
    const allItems = this.getAllEquipments();

    if (typeof CATEGORIES_META === 'undefined') return;

    container.innerHTML = CATEGORIES_META.map(cat => {
      let count = cat.id === 'Favoritos' 
        ? favorites.length 
        : allItems.filter(e => this.matchCategory(e.category, cat.id) || this.matchCategory(e.category, cat.title)).length;

      return `
        <div class="category-block-card" onclick="CatalogModule.selectCategory('${cat.id}')">
          <div class="category-block-icon">${cat.icon}</div>
          <h3 class="category-block-title">${cat.title}</h3>
          <p class="category-block-desc">${cat.description}</p>
          <span class="category-block-count">${count} equipamento(s)</span>
        </div>
      `;
    }).join('');
  },

  selectCategory(categoryId) {
    this.activeCategory = categoryId;
    this.searchQuery = '';
    const searchInput = document.getElementById('input-search');
    if (searchInput) searchInput.value = '';

    const categoryMeta = typeof CATEGORIES_META !== 'undefined' ? CATEGORIES_META.find(c => c.id === categoryId) : null;
    const titleEl = document.getElementById('current-category-title');
    if (titleEl && categoryMeta) {
      titleEl.textContent = `${categoryMeta.icon} ${categoryMeta.title}`;
    }

    const blocksView = document.getElementById('subview-category-blocks');
    const listView = document.getElementById('subview-equipment-list');
    if (blocksView) blocksView.style.display = 'none';
    if (listView) listView.style.display = 'block';

    this.renderEquipments();
  },

  backToCategoryBlocks() {
    this.activeCategory = null;
    const listView = document.getElementById('subview-equipment-list');
    const blocksView = document.getElementById('subview-category-blocks');
    if (listView) listView.style.display = 'none';
    if (blocksView) blocksView.style.display = 'block';
    this.renderCategoryBlocks();
  },

  renderEquipments() {
    const container = document.getElementById('equipments-grid');
    if (!container) return;

    const favorites = this.getFavorites();
    const allItems = this.getAllEquipments();

    const categoryMeta = typeof CATEGORIES_META !== 'undefined' ? CATEGORIES_META.find(c => c.id === this.activeCategory) : null;
    const categoryTitle = categoryMeta ? categoryMeta.title : this.activeCategory;

    const filtered = allItems.filter(item => {
      const matchesCategory = 
        this.activeCategory === 'Favoritos' ? favorites.includes(item.id) :
        (this.matchCategory(item.category, this.activeCategory) || this.matchCategory(item.category, categoryTitle));

      const matchesSearch = 
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (item.purpose && item.purpose.toLowerCase().includes(this.searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">
          Nenhum equipamento encontrado nesta seção.
        </p>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      const isFav = favorites.includes(item.id);
      return `
        <div class="equipment-card" onclick="CatalogModule.openDetails('${item.id}')">
          <div>
            <div class="card-header">
              <span class="category-badge">${item.category}</span>
              <button class="btn-favorite ${isFav ? 'active' : ''}" 
                      onclick="CatalogModule.handleFavoriteClick(event, '${item.id}')">
                ${isFav ? '★' : '☆'}
              </button>
            </div>
            <div class="card-icon-title">
              <span class="card-icon">${item.icon || '📦'}</span>
              <h3 class="card-title">${item.name}</h3>
            </div>
            <p class="card-description">${item.shortDescription || ''}</p>
          </div>
        </div>
      `;
    }).join('');
  },

  handleFavoriteClick(event, id) {
    event.stopPropagation();
    if (typeof StorageManager !== 'undefined' && StorageManager.toggleFavorite) {
      StorageManager.toggleFavorite(id);
    }
    this.renderEquipments();
  },

  handleImageError(itemId) {
    const displayContainer = document.getElementById('equipment-visual-display');
    if (displayContainer) {
      const illustrationSvg = (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' && EQUIPMENT_ILLUSTRATIONS[itemId]) || (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' ? EQUIPMENT_ILLUSTRATIONS['default'] : '');
      displayContainer.innerHTML = illustrationSvg;
    }
  },

  switchViewMode(mode, itemId) {
    this.currentViewMode = mode;
    
    const btnSymbol = document.getElementById('btn-view-symbol');
    const btnImage = document.getElementById('btn-view-image');
    const btnWiring = document.getElementById('btn-view-wiring');

    if (btnSymbol) btnSymbol.classList.toggle('active', mode === 'symbol');
    if (btnImage) btnImage.classList.toggle('active', mode === 'image');
    if (btnWiring) btnWiring.classList.toggle('active', mode === 'wiring');

    const item = this.getAllEquipments().find(e => e.id === itemId);
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
        </svg>
      `;
    } else if (mode === 'image') {
      const illustrationSvg = (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' && EQUIPMENT_ILLUSTRATIONS[item.id]) || (typeof EQUIPMENT_ILLUSTRATIONS !== 'undefined' ? EQUIPMENT_ILLUSTRATIONS['default'] : '');
      if (item.imagePath && item.imagePath.trim() !== "") {
        displayContainer.innerHTML = `<img src="${item.imagePath}" alt="${item.name}" onerror="CatalogModule.handleImageError('${item.id}')">`;
      } else {
        displayContainer.innerHTML = illustrationSvg;
      }
    } else if (mode === 'wiring') {
      const wiringSvg = (typeof EQUIPMENT_WIRING_DIAGRAMS !== 'undefined' && EQUIPMENT_WIRING_DIAGRAMS[item.id]) || (typeof EQUIPMENT_WIRING_DIAGRAMS !== 'undefined' ? EQUIPMENT_WIRING_DIAGRAMS['default'] : '');
      displayContainer.innerHTML = wiringSvg;
    }
  },

  openInSimulator(itemId) {
    document.getElementById('modal-details')?.classList.remove('active');
    
    const simTabBtn = document.querySelector('.tab-btn[data-tab="simulator"]');
    if (simTabBtn) simTabBtn.click();

    const preset = (typeof EQUIPMENT_PRESETS !== 'undefined' && EQUIPMENT_PRESETS[itemId]) || {
      rungs: [{
        id: "preset-auto-gen",
        comment: `Aplicação genérica para ${itemId}`,
        nodes: [
          { id: "n-gen-1", type: "NO", target: "I0.0" },
          { id: "n-gen-2", type: "COIL", target: "Q0.0" }
        ]
      }]
    };

    if (window.SimulatorModule && typeof window.SimulatorModule.loadPreset === 'function') {
      window.SimulatorModule.loadPreset(preset);
    }
  },

  openDetails(id) {
    const item = this.getAllEquipments().find(e => e.id === id);
    if (!item) return;

    this.currentViewMode = 'symbol';
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <span class="category-badge">${item.category}</span>
      <h2 style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${item.icon || '📦'} ${item.name}</h2>
      
      <button class="btn-plc btn-plc-run" style="width: 100%; margin-bottom: 1rem; justify-content: center;" onclick="CatalogModule.openInSimulator('${item.id}')">
        🧪 Ver Aplicação no Simulador CLP
      </button>

      <div class="detail-section">
        <h4>Para que serve</h4>
        <p>${item.purpose || 'Sem descrição cadastrada.'}</p>
      </div>

      <div class="detail-section">
        <h4>Como funciona</h4>
        <p><strong>Em linguagem simples:</strong> ${item.howItWorks?.simple || 'N/A'}</p>
        <p style="margin-top:0.4rem;"><strong>Princípio Técnico:</strong> ${item.howItWorks?.technical || 'N/A'}</p>
      </div>

      <div class="detail-section">
        <h4>Visualização Técnica & Fiação</h4>
        <div class="view-toggle-container">
          <button id="btn-view-symbol" class="toggle-btn active" onclick="CatalogModule.switchViewMode('symbol', '${item.id}')">📐 Símbolo</button>
          <button id="btn-view-image" class="toggle-btn" onclick="CatalogModule.switchViewMode('image', '${item.id}')">📷 Imagem</button>
          <button id="btn-view-wiring" class="toggle-btn" onclick="CatalogModule.switchViewMode('wiring', '${item.id}')">🔌 Fiação</button>
        </div>
        <div id="equipment-visual-display" class="svg-diagram-container"></div>
      </div>

      <div class="detail-section">
        <h4>Especificações Principais</h4>
        <ul>
          <li><strong>Tensão de Operação:</strong> ${item.specs?.voltage || 'Padrão 24VDC'}</li>
          <li><strong>Corrente Típica:</strong> ${item.specs?.current || 'N/A'}</li>
          <li><strong>Tipo de Sinal:</strong> ${item.specs?.signalType || 'Digital'}</li>
          <li><strong>Faixas / Capacidade:</strong> ${item.specs?.ranges || 'N/A'}</li>
        </ul>
      </div>

      <div class="detail-section">
        <h4>Aplicações Comuns</h4>
        <ul>${(item.applications || ['Automação Industrial']).map(app => `<li>${app}</li>`).join('')}</ul>
      </div>
    `;

    document.getElementById('modal-details')?.classList.add('active');
    this.switchViewMode('symbol', item.id);
  },

  openAddModal() {
    const select = document.getElementById('add-category');
    if (select && typeof CATEGORIES_META !== 'undefined') {
      select.innerHTML = CATEGORIES_META
        .filter(c => c.id !== 'Favoritos')
        .map(c => `<option value="${c.id}">${c.icon} ${c.title}</option>`)
        .join('');
    }
    document.getElementById('modal-add-equipment')?.classList.add('active');
  },

  handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-name').value.trim();
    const category = document.getElementById('add-category').value;
    const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');

    const newEquipment = {
      id: id,
      name: name,
      category: category,
      icon: '⚙️',
      shortDescription: document.getElementById('add-shortDesc').value.trim(),
      purpose: document.getElementById('add-purpose').value.trim(),
      howItWorks: {
        simple: document.getElementById('add-simpleHow').value.trim() || 'Funcionamento padrão.',
        technical: document.getElementById('add-techHow').value.trim() || 'Comutação de estado elétrico.'
      },
      specs: {
        voltage: document.getElementById('add-voltage').value.trim() || '24VDC',
        current: 'N/A',
        signalType: document.getElementById('add-signal').value.trim() || 'Digital',
        ranges: 'N/A'
      },
      applications: document.getElementById('add-apps').value.split(',').map(s => s.trim()).filter(Boolean),
      safetyAndFailures: { safety: ['Manusear com alimentação desligada.'], commonFailures: ['Mau contato em borne.'] }
    };

    const currentCustom = this.getCustomEquipments();
    const customMap = new Map(currentCustom.map(item => [item.id, item]));
    customMap.set(id, newEquipment);

    this.saveCustomEquipments(Array.from(customMap.values()));

    document.getElementById('modal-add-equipment')?.classList.remove('active');
    document.getElementById('form-add-equipment')?.reset();

    this.renderCategoryBlocks();
    if (this.activeCategory) {
      this.renderEquipments();
    }
    alert('Equipamento cadastrado com sucesso!');
  },

  openImportModal() {
    const area = document.getElementById('json-import-area');
    if (area) area.value = '';
    document.getElementById('modal-import-equipment')?.classList.add('active');
  },

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const area = document.getElementById('json-import-area');
      if (area) area.value = event.target.result;
    };
    reader.readAsText(file);
  },

  processJSONImport() {
    const area = document.getElementById('json-import-area');
    const rawText = area ? area.value.trim() : '';
    if (!rawText) {
      alert('Selecione um ficheiro .json ou cole o conteúdo no campo de texto antes de importar.');
      return;
    }

    try {
      const parsed = JSON.parse(rawText);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];

      const currentCustom = this.getCustomEquipments();
      const customMap = new Map(currentCustom.map(item => [item.id, item]));

      let addedCount = 0;
      let updatedCount = 0;

      itemsToImport.forEach(item => {
        const id = item.id || item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
        
        const formatted = {
          id: id,
          name: item.name || 'Sem nome',
          category: item.category || 'Sensores de Campo',
          icon: item.icon || '📦',
          shortDescription: item.shortDescription || '',
          purpose: item.purpose || '',
          howItWorks: item.howItWorks || { simple: '', technical: '' },
          specs: item.specs || { voltage: '24VDC', signalType: 'Digital' },
          applications: Array.isArray(item.applications) ? item.applications : [item.applications || 'Geral'],
          safetyAndFailures: item.safetyAndFailures || { safety: [], commonFailures: [] }
        };

        if (customMap.has(id)) {
          updatedCount++;
        } else {
          addedCount++;
        }
        customMap.set(id, formatted);
      });

      const mergedList = Array.from(customMap.values());
      this.saveCustomEquipments(mergedList);

      document.getElementById('modal-import-equipment')?.classList.remove('active');
      
      this.renderCategoryBlocks();
      if (this.activeCategory) {
        this.renderEquipments();
      }

      alert(`Importação realizada com sucesso!\n\n• ${addedCount} novos equipamentos inseridos\n• ${updatedCount} equipamentos atualizados`);
    } catch (err) {
      alert('Erro ao processar o JSON: ' + err.message);
    }
  },

  exportToDataJS() {
    try {
      const all = this.getAllEquipments();
      if (!all || all.length === 0) {
        alert('Nenhum equipamento encontrado para exportar.');
        return;
      }

      const jsonStr = JSON.stringify(all, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const dlAnchor = document.createElement('a');
      dlAnchor.href = url;
      dlAnchor.download = 'EQUIPMENTS_DATA.json';
      document.body.appendChild(dlAnchor);
      dlAnchor.click();

      setTimeout(() => {
        dlAnchor.remove();
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      alert('Erro ao exportar arquivo: ' + err.message);
    }
  },

  bindEvents() {
    document.getElementById('btn-back-to-categories')?.addEventListener('click', () => {
      this.backToCategoryBlocks();
    });

    document.getElementById('input-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderEquipments();
    });

    document.getElementById('btn-modal-close')?.addEventListener('click', () => {
      document.getElementById('modal-details')?.classList.remove('active');
    });
  }
};

window.CatalogModule = CatalogModule;