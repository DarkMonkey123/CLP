/**
 * Gerenciador de Armazenamento Local (localStorage)
 */
const StorageManager = {
  FAVORITES_KEY: 'autotech_favorites_v1',

  // Obter lista de IDs favoritados
  getFavorites() {
    const data = localStorage.getItem(this.FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Alternar estado de favorito (adicionar ou remover)
  toggleFavorite(id) {
    let favorites = this.getFavorites();
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  },

  // Checar se determinado ID é favorito
  isFavorite(id) {
    return this.getFavorites().includes(id);
  }
};