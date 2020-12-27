<template>
  <!-- 地雷が埋め込まれているかもしれない単一のタイル -->
  <div class="tile button" :class="[{ 'button-disabled': !canOpen }]">
    <!-- 内部的にはチェックボックスの切り替えで表現する -->
    <input
      :id="id"
      type="checkbox"
      :checked="opened"
      :disabled="!canOpen"
      @click="$emit('open', [row, col])"
    />

    <!-- 開けた後に見えるようになる下地 -->
    <label
      :for="id"
      :class="[
        numberClass,
        openedClass,
        mineClass,
        flaggedClass,
        badFlaggedClass,
      ]"
      @click.right.prevent="$emit('flag', [row, col])"
      @touchstart="touchstart([row, col])"
      @touchend="touchend"
    />

    <!-- 地雷 -->
    <transition name="transition-bomb">
      <font-awesome-icon
        v-if="opened && hasMine"
        class="fa fa-bomb"
        icon="bomb"
        size="lg"
      />
    </transition>

    <!-- フラグ -->
    <font-awesome-icon
      v-if="!opened && flagged"
      class="fa fa-flag"
      icon="flag"
      size="lg"
      @click.right.prevent="$emit('flag', [row, col])"
      @touchstart="touchstart([row, col])"
      @touchend="touchend"
    />

    <!-- 地雷ではないタイルに立てたスカフラグのアイコン -->
    <font-awesome-icon
      v-if="opened && badFlagged"
      class="fa fa-times"
      icon="times"
      size="lg"
    />
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/style.scss";

.tile {
  position: relative;
  user-select: none;

  .fa {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);

    // 地雷爆発トランジション
    &.transition-bomb {
      &-enter-active {
        animation: bounce-in 0.5s;
      }

      @keyframes bounce-in {
        0% {
          transform: translate(-50%, -50%) scale(0);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    // 各種アイコンの色
    &.fa-flag {
      color: red;
    }
    &.fa-bomb {
      color: black;
    }
    &.fa-times {
      color: red;
    }
  }

  input[type='checkbox'] {
    display: none;

    & + label {
      $size: 32px;

      width: $size;
      height: $size;
      display: block;
      text-align: center;

      // 右クリック抑制
      user-select: none;

      &.opened {
        background: lightgray;
        border: dotted 1px #333;
        box-sizing: border-box;

        &.mine {
          background-color: red;

          &.flagged {
            background-color: yellow;
          }
        }

        // 開けた後に見える数字
        @for $i from 1 through 8 {
          &.number-#{$i}:not(.flagged-bad) {
            &:after {
              @extend .font-notosans-bold;

              content: '#{$i}';
              font-size: $size - 8px;
              line-height: $size;

              @if $i == 1 {
                color: blue;
              } @else if $i == 2 {
                color: green;
              } @else if $i == 3 {
                color: red;
              } @else if $i == 4 {
                color: darkblue;
              } @else if $i == 5 {
                color: darkred;
              } @else if $i == 6 {
                color: darkturquoise;
              } @else if $i == 7 {
                color: black;
              } @else if $i == 8 {
                color: dimgray;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: 'Tile',

  props: {
    /**
     * パネル上の行番号
     */
    row: {
      type: Number,
      required: true,
    },

    /**
     * パネル上の列番号
     */
    col: {
      type: Number,
      required: true,
    },

    /**
     * 周囲8タイルにいくつの地雷が仕掛けられているかを表す数字
     */
    number: {
      type: Number,
      required: true,
      default: 0,
    },

    /**
     * 開けたかどうか
     */
    opened: {
      type: Boolean,
      default: false,
    },

    /**
     * 地雷が埋め込まれているかどうか
     */
    hasMine: {
      type: Boolean,
      default: false,
    },

    /**
     * フラグが立てられているかどうか
     */
    flagged: {
      type: Boolean,
      default: false,
    },

    /**
     * 地雷がないところに立てられたスカフラグであることを知らせるかどうか
     */
    badFlagged: {
      type: Boolean,
      default: false,
    },

    /**
     * プレイヤーから操作できない状態にするかどうか
     */
    frozen: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      /**
       * 開けた後に見えるようになる数字を表すクラス名
       */
      numberClass: '',

      /**
       * 開けたかどうかを表すクラス名
       */
      openedClass: '',

      /**
       * 地雷が見えているかどうかを表すクラス名
       */
      mineClass: '',

      /**
       * フラグが立てられているかどうかを表すクラス名
       */
      flaggedClass: '',

      /**
       * 地雷がないところに立てられたスカフラグであるかどうかを表すクラス名
       */
      badFlaggedClass: '',

      /**
       * スマホ向け: 長押しタイマー
       */
      timer: null,
    };
  },

  computed: {
    /**
     * このタイルを一意に表すID
     */
    id: {
      get () {
        return `tile-${this.row}-${this.col}`;
      },
    },

    /**
     * このタイルを開けるかどうか
     */
    canOpen: {
      get () {
        return !this.opened && !this.flagged && !this.frozen;
      },
    },
  },

  watch: {
    // タイルの状態変化を検知してクラス名を動的に更新する
    number () {
      this.numberClass = this.number > 0 ? `number-${this.number}` : '';
    },
    opened () {
      this.openedClass = this.opened ? 'opened' : '';
      this.mineClass = this.hasMine && this.opened ? 'mine' : '';
    },
    flagged () {
      this.flaggedClass = this.flagged ? 'flagged' : '';
    },
    badFlagged () {
      this.badFlaggedClass = this.badFlagged ? 'flagged-bad' : '';
    },
  },

  methods: {
    /**
     * スマホ向け: 長押しタップでフラグを立てます。
     * @params {Number} row 行インデックス
     * @params {Number} col 列インデックス
     */
    touchstart ([row, col]) {
      // 一定時間経過後に離されていなければフラグを立てる
      const that = this;
      this.timer = setTimeout(() => {
        that.$emit('flag', [row, col]);
        that.timer = null;
      }, 1000);
    },

    /**
     * スマホ向け: 長押しタップの操作をキャンセルします。
     */
    touchend () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>
