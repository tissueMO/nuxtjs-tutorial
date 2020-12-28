<template>
  <!-- 任意の整数値を7セグメントデジタル数字で表現する -->
  <div class="digits">
    <Digit v-for="(digit, i) in digits" :key="i" :number="digit" />
  </div>
</template>

<style lang="scss">
@import "~/assets/scss/style.scss";

.digits {
  @extend .flex;
  @include border-3d(2px, #808080, #dfdfdf, lightgray);
  align-self: flex-end;
}
</style>

<script>
import Digit from '~/components/Digit';

export default {
  name: 'Digits',
  components: { Digit },

  props: {
    /**
     * 7セグメントデジタル数字で表現する任意の整数値
     */
    value: {
      type: Number,
      default: 0,
    },

    /**
     * 表示可能な桁数 (これを超えた値はカンスト表示になる)
     */
    digitSize: {
      type: Number,
      default: 3,
    },
  },

  computed: {
    /**
     * 現在の値を桁ごとに分解した配列
     * 例: 123 => [1, 2, 3]
     */
    digits: {
      get () {
        // 表示値をカンスト処理
        let value = Math.min(this.value, Math.pow(10, this.digitSize) - 1);
        const digits = [];

        for (let i = 0; i < this.digitSize; i++) {
          // 1の位を取得し続ける
          const digit = value % 10;
          digits.push(digit);
          value = Math.floor(value / 10);
        }

        // 大きい位から小さい位の順に並ぶようにする
        return digits.reverse();
      },
    },
  },
};
</script>
