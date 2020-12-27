<template>
  <!-- 単一数字: 7セグメントデジタル数字 -->
  <div class="digit">
    <div v-for="(n, i) in 10" :key="i">
      <div v-if="number === i" class="display" :class="['d' + i]"></div>
    </div>
  </div>
</template>

<style lang="scss">
// サイズは倍率で指定
$size: 0.5;
$color: #f00;
$backColor: #511;

.digit {
  .display {
    width: 60px * $size;
    height: 100px * $size;
    border: solid 4px * $size #111;
    background-color: #111;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 28px * $size;
      height: 28px * $size;
      -webkit-transform: translate(-50%, -50%) rotate(45deg);
      -moz-transform: translate(-50%, -50%) rotate(45deg);
      -ms-transform: translate(-50%, -50%) rotate(45deg);
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px * $size;
      height: 12px * $size;
      border-top: solid 30px * $size #111;
      border-bottom: solid 30px * $size #111;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
  }

  .d0::before {
    background-color: $backColor;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $color, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
  .d1::before {
    background-color: $backColor;
    box-shadow: -30px * $size -30px * $size $backColor,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $backColor,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $backColor;
  }
  .d2::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $backColor,
      0px * $size 30px * $size $color, 30px * $size 0px * $size $backColor,
      30px * $size 30px * $size $color;
  }
  .d3::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $backColor,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
  .d4::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $backColor,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $backColor;
  }
  .d5::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $backColor, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
  .d6::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $backColor, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $color, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
  .d7::before {
    background-color: $backColor;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $backColor;
  }
  .d8::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $color, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
  .d9::before {
    background-color: $color;
    box-shadow: -30px * $size -30px * $size $color,
      0px * $size -30px * $size $color, -30px * $size 0px * $size $color,
      0px * $size 30px * $size $backColor, 30px * $size 0px * $size $color,
      30px * $size 30px * $size $color;
  }
}
</style>

<script>
export default {
  name: 'Digit',
  props: {
    /**
     * 7セグメントデジタル数字で表現する一桁の整数値
     */
    number: {
      type: Number,
      default: 0,
    },
  },
};
</script>
