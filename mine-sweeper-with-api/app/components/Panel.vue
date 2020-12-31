<template>
  <!-- 地雷が埋め込まれているかもしれないタイルを敷き詰めたパネル -->
  <div id="panel-wrapper" class="form-group">
    <div id="panel" class="d-inline-block">
      <div v-for="(row, rowIndex) in tiles" :key="rowIndex" class="row">
        <div v-for="(col, colIndex) in row" :key="colIndex" class="col">
          <Tile
            :row="rowIndex"
            :col="colIndex"
            :number="col.number"
            :has-mine="col.hasMine"
            :opened="col.opened"
            :flagged="col.flagged"
            :bad-flagged="col.badFlagged"
            :frozen="isFrozen"
            @open="open"
            @flag="flag"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/style.scss";

#panel {
  @include border-3d(5px, #808080, #dfdfdf, lightgray);
  margin: 0 auto;

  .row {
    @extend .flex;

    &:first-child {
      .col {
        label {
          border-top: none;
        }
      }
    }
    &:last-child {
      .col {
        label {
          border-bottom: none;
        }
      }
    }
  }

  .col {
    &:first-child {
      label {
        border-left: none;
      }
    }
    &:last-child {
      label {
        border-right: none;
      }
    }
  }
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import shuffle from 'shuffle-array';
import Tile from '~/components/Tile';

// 周囲8タイルを数えるのに使うオフセット用行列
const OFFSET_MATRIX = [
  [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  [
    [-1, 0],
    [1, 0],
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
];

export default {
  name: 'Panel',
  components: {
    Tile,
  },

  props: {
    /**
     * 盤面の横方向タイル数
     */
    sizeWidth: {
      type: Number,
      required: true,
      default: 7,
    },

    /**
     * 盤面の縦方向タイル数
     */
    sizeHeight: {
      type: Number,
      required: true,
      default: 9,
    },

    /**
     * 敷き詰める地雷の数
     */
    mineCount: {
      type: Number,
      required: true,
      default: 10,
    },
  },

  data () {
    return {
      /**
       * このパネル内に敷き詰められたタイル
       */
      tiles: [],

      /**
       * 大量アニメーション用タイマー群
       */
      timers: [],
    };
  },

  computed: {
    ...mapState('minesweeper', ['isStarted', 'isCleared', 'isGameOver']),
    ...mapGetters('minesweeper', ['isFrozen']),

    /**
     * 画面上にまだ見えていない地雷ではないタイルの個数
     */
    safeCountOfRemaining: {
      get () {
        return this.tiles.reduce(
          (accumulator, row) =>
            accumulator +
            row.reduce(
              (acc, col) => acc + (!col.opened && !col.hasMine ? 1 : 0),
              0
            ),
          0
        );
      },
    },

    /**
     * 画面上にまだ見えていない地雷タイルの個数
     */
    hiddenMineCountOfRemaining: {
      get () {
        return this.tiles.reduce(
          (accumulator, row) =>
            accumulator +
            row.reduce(
              (acc, col) => acc + (!col.opened && col.hasMine ? 1 : 0),
              0
            ),
          0
        );
      },
    },

    /**
     * 地雷タイルを抽出した1次元配列
     */
    mineTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => col.hasMine)).flat();
      },
    },

    /**
     * フラグが立てられたタイルを抽出した1次元配列
     */
    flaggedTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => col.flagged)).flat();
      },
    },

    /**
     * まだ開けられていないタイルを抽出した1次元配列
     */
    closedTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => !col.opened)).flat();
      },
    },
  },

  watch: {
    // 盤面の大きさが変更されたらゲームを初期化
    sizeWidth () {
      this.init();
    },
    sizeHeight () {
      this.init();
    },
  },

  created () {
    this.init();

    // ストアのアクションをフックしてゲームの初期化時にパネルを初期化できるようにする
    const that = this;
    this.$store.subscribeAction((action) => {
      if (action.type === 'minesweeper/initialize') {
        that.init();
      }
    });
  },

  methods: {
    ...mapActions('minesweeper', ['startGame', 'clearGame', 'gameOver']),

    /**
     * 盤面を初期化します。
     */
    init () {
      this.timers.forEach(timer => clearTimeout(timer));
      this.timers = [];
      this._initTiles();
    },

    /**
     * 空の盤面を生成します。
     */
    _initTiles () {
      this.tiles = [...Array(this.sizeHeight)].map(() =>
        [...Array(this.sizeWidth)].map(() => null)
      );

      this.tiles.forEach((row, rowIndex) =>
        row.forEach((col, colIndex) => {
          col = {
            row: rowIndex,
            col: colIndex,
            flagged: false,
            badFlagged: false,
            opened: false,
            number: 0,
            hasMine: false,
          };

          // このタイルに対する変更を反映
          this.tiles[rowIndex].splice(colIndex, 1, col);
        })
      );
    },

    /**
     * 任意のタイルを開けてゲームを始めます。
     * @param {Number} row 行インデックス
     * @param {Number} col 列インデックス
     */
    start (row, col) {
      this.startGame();
      this.$emit('start');

      // APIサーバーから地雷を配置済みの盤面を取得する
      return this.$axios.$post('http://localhost:8081/createTiles', {
        row,
        col,
        width: this.sizeWidth,
        height: this.sizeHeight,
        mineCount: this.mineCount,
      });
    },

    /**
     * 任意のタイルのフラグを更新します。
     * @param {Number} row 行インデックス
     * @param {Number} col 列インデックス
     * @param {Boolean} value フラグを立てるかどうか。指定しなかった場合は反転する
     */
    flag ([row, col, value] = []) {
      if (this.isFrozen) {
        return;
      }

      this.tiles[row][col].flagged =
        value !== undefined ? value : !this.tiles[row][col].flagged;
    },

    /**
     * 任意のタイルを開けます。
     * @param {Number} row 行インデックス
     * @param {Number} col 列インデックス
     */
    async open ([row, col]) {
      if (this.isFrozen || this.tiles[row][col].opened) {
        return;
      }

      if (!this.isStarted) {
        // 最初のタイルを開く瞬間にゲームを開始する
        this.tiles = await this.start(row, col);
      }

      this.openRecursive(row, col);

      if (this.tiles[row][col].hasMine) {
        // ゲームオーバー
        this.gameOver();
        this.$emit('end', false);
        this.openMinesAndFlagsAll();
        return;
      }

      if (this.safeCountOfRemaining === 0 && !this.isCleared) {
        // 残った地雷タイルにすべてフラグを立てる
        const that = this;
        this.closedTiles.forEach(tile =>
          that.flag([tile.row, tile.col, true])
        );

        // ゲームクリア
        this.clearGame();
        this.$emit('end', true);
      }
    },

    /**
     * 指定されたタイルを開き、その周囲8タイルのうち数字が 0 であるタイルを再帰的に開きます。
     * @param {Number} row 行インデックス
     * @param {Number} col 列インデックス
     */
    openRecursive (row, col) {
      if (this.tiles[row][col].opened) {
        return;
      }

      // 指定されたタイルを開く
      this.tiles[row][col].opened = true;
      this.tiles[row][col].flagged = false;
      if (this.tiles[row][col].number !== 0) {
        return;
      }

      // 再帰的に周囲のタイルを開ける
      OFFSET_MATRIX.forEach((r, subRowIndex) =>
        r.forEach((c, subColIndex) => {
          const tx = OFFSET_MATRIX[subRowIndex][subColIndex][0];
          const ty = OFFSET_MATRIX[subRowIndex][subColIndex][1];
          if (
            col + tx < 0 ||
            this.sizeWidth <= col + tx ||
            row + ty < 0 ||
            this.sizeHeight <= row + ty
          ) {
            return;
          }

          this.openRecursive(row + ty, col + tx);
        })
      );
    },

    /**
     * すべての地雷タイルとフラグが立てられたタイルを開けます。
     */
    openMinesAndFlagsAll () {
      // タイルの開ける順序をランダムにする
      this.timers = [];
      const mines = this.mineTiles;
      const flags = this.flaggedTiles;
      const openTargetTiles = mines.concat(flags);
      shuffle(openTargetTiles);

      // 徐々にアニメーションしながらタイルを開けていく
      const that = this;
      openTargetTiles.forEach((tile, i) => {
        that.timers.push(
          setTimeout(() => {
            that.setBadFlagIfNeeded(tile.row, tile.col);
            that.tiles[tile.row][tile.col].opened = true;
          }, 50 * (i + 1))
        );
      });
    },

    /**
     * 指定したタイルが地雷ではないのにフラグを置かれていた場合にスカフラグを立てます。
     */
    setBadFlagIfNeeded (row, col) {
      this.tiles[row][col].badFlagged =
        !this.tiles[row][col].hasMine && this.tiles[row][col].flagged;
    },
  },
};
</script>
