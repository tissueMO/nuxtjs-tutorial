import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'mine-sweeper',

      // リロード時のみ復元し、新しいタブやウィンドウに対しては復元対象外とする
      storage: window.sessionStorage,

      // 永続化対象とする state
      paths: [
        'minesweeper.selectedLevelName',
      ]
    })(store);
  });
};
