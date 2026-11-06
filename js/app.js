/**
 * Inicializador da Aplicação & Gerenciador de Roteamento SPA
 */
document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('btn-install-app');
  const installHelpDialog = document.getElementById('install-help-dialog');
  let deferredInstallPrompt = null;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true;

  if (isStandalone) {
    installButton.hidden = true;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.textContent = '⬇️ Instalar app';
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      installHelpDialog.showModal();
      return;
    }

    try {
      const installPrompt = deferredInstallPrompt;
      deferredInstallPrompt = null;
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        installButton.hidden = true;
      } else {
        installButton.textContent = 'Como instalar?';
      }
    } catch (error) {
      console.error('Não foi possível abrir a instalação do app:', error);
      installButton.textContent = 'Como instalar?';
      installHelpDialog.showModal();
    }
  });

  document.getElementById('btn-close-install-help').addEventListener('click', () => {
    installHelpDialog.close();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Não foi possível registrar o service worker:', error);
    });
  }

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