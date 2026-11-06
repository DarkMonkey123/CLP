/**
 * Inicializador da Aplicação & Gerenciador de Roteamento SPA
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Módulos
  CatalogModule.init();
  SimulatorModule.init();

  // 2. Navegação por Abas (SPA)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const viewSections = document.querySelectorAll('.view-section');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      const targetView = document.getElementById(`view-${targetTab}`);
      if (!targetView) return;

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      viewSections.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('hidden', '');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      targetView.classList.add('active');
      targetView.removeAttribute('hidden');

      // Se mudar para a aba do simulador, reconstrói o DOM com segurança
      if (targetTab === 'simulator') {
        LadderRenderer.buildDOMStructure();
      }
    });
  });

  // 3. Alternador de Tema (Claro / Escuro)
  const themeBtn = document.getElementById('btn-theme-toggle');
  const htmlTag = document.documentElement;

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('autotech_theme') === 'dark' ? 'dark' : 'light';
  } catch (error) {
    // The app still works when browser storage is unavailable.
  }
  htmlTag.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlTag.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('autotech_theme', newTheme);
    } catch (error) {
      // Keep the selected theme for this session if storage is unavailable.
    }
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', `Ativar tema ${newTheme === 'dark' ? 'claro' : 'escuro'}`);
  });
});