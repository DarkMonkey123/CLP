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

      tabButtons.forEach(b => b.classList.remove('active'));
      viewSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`view-${targetTab}`).classList.add('active');

      // Se mudar para a aba do simulador, reconstrói o DOM com segurança
      if (targetTab === 'simulator') {
        LadderRenderer.buildDOMStructure();
      }
    });
  });

  // 3. Alternador de Tema (Claro / Escuro)
  const themeBtn = document.getElementById('btn-theme-toggle');
  const htmlTag = document.documentElement;

  const savedTheme = localStorage.getItem('autotech_theme') || 'light';
  htmlTag.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('autotech_theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
});