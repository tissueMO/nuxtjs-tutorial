// ################################################################################
//   ゲーム情報の状態
// ################################################################################

export const state = () => ({
  /**
   * ゲームが開始されたかどうか
   */
  isStarted: false,

  /**
   * ゲームがクリアされたかどうか
   */
  isCleared: false,

  /**
   * 地雷タイルを開けてゲームオーバーになったかどうか
   */
  isGameOver: false,

  /**
   * 選択された難易度のキー
   */
  selectedLevelName: '',
});

export const getters = {
  /**
   * プレイヤー操作が行えない状態であるかどうか
   */
  isFrozen: state => state.isGameOver || state.isCleared,
};

export const mutations = {
  started (state, value) {
    state.isStarted = value;
  },
  cleared (state, value) {
    state.isCleared = value;
  },
  gameOver (state, value) {
    state.isGameOver = value;
  },
  selectedLevelName (state, value) {
    state.selectedLevelName = value;
  },
};

export const actions = {
  initialize ({ commit }) {
    commit('started', false);
    commit('cleared', false);
    commit('gameOver', false);
  },

  startGame ({ commit }) {
    commit('started', true);
  },

  clearGame ({ commit }) {
    commit('cleared', true);
  },

  gameOver ({ commit }) {
    commit('gameOver', true);
  },
};
