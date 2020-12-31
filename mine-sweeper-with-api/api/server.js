// ################################################################################
//   マインスイーパー APIサーバー
// ################################################################################
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.API_PORT | 8080;

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


app.post('/createTiles', (req, res) => {
  // ゲームを開始するタイル座標: この座標には地雷を配置しない
  const row = req.body.row;
  const col = req.body.col;

  // 盤面のタイル数
  const width = req.body.width;
  const height = req.body.height;

  // 地雷をセット
  const mineCount = req.body.mineCount;
  const tiles = initTiles(width, height);
  putMines(tiles, col, row, width, height, mineCount);
  applyNumbers(tiles, width, height);

  // 生成した盤面を返す
  return res.json(tiles);
});


/**
 * 空の盤面を生成します。
 * @param {Number} width 盤面横方向タイル数
 * @param {Number} height 盤面縦方向タイル数
 * @returns {Array} 二次元タイル盤面
 */
const initTiles = (width, height) => {
  const tiles = [...Array(height)].map(() =>
    [...Array(width)].map(() => null)
  );

  tiles.forEach((row, rowIndex) =>
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
      tiles[rowIndex].splice(colIndex, 1, col);
    })
  );

  return tiles;
};

/**
 * 指定されたタイルに地雷を埋めないようにして地雷を配置します。
 * @param {Array} tiles 二次元タイル盤面
 * @param {Number} col 列インデックス
 * @param {Number} row 行インデックス
 * @param {Number} width 盤面横方向タイル数
 * @param {Number} height 盤面縦方向タイル数
 * @param {Number} mineCount 配置する地雷の数
 */
const putMines = (tiles, col, row, width, height, mineCount) => {
  let putCount = 0;

  while (putCount < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    if (!tiles[y][x].hasMine && (col !== x || row !== y)) {
      tiles[y][x].hasMine = true;
      putCount++;
    }
  }
};


/**
 * 現在埋められている地雷の位置関係に基づいて各タイルの数字を埋め込みます。
 * @param {Array} tiles 二次元タイル盤面
 * @param {Number} width 盤面横方向タイル数
 * @param {Number} height 盤面縦方向タイル数
 */
const applyNumbers = (tiles, width, height) => {
  tiles.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      if (col.hasMine) {
        col.number = -1;
        return;
      }

      // 周囲8タイルの地雷の数を数える
      let surroundedMineCount = 0;
      OFFSET_MATRIX.forEach((r, subRowIndex) =>
        r.forEach((c, subColIndex) => {
          const tx = OFFSET_MATRIX[subRowIndex][subColIndex][0];
          const ty = OFFSET_MATRIX[subRowIndex][subColIndex][1];
          if (
            colIndex + tx < 0 ||
            width <= colIndex + tx ||
            rowIndex + ty < 0 ||
            height <= rowIndex + ty
          ) {
            return;
          }

          if (tiles[rowIndex + ty][colIndex + tx].hasMine) {
            surroundedMineCount++;
          }
        })
      );

      tiles[rowIndex][colIndex].number = surroundedMineCount;
    })
  );
};


// サーバー起動
app.listen(PORT);
console.log(`MineSweeper API Server Started on port ${PORT}`);
