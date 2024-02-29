const exp = require("constants");
const { isGameOver, getBestMove } = require("./script.js");
const { log } = require("console");

describe("isGameOver function", () => {
  test("x wins", () => {
    const gameOverValue = isGameOver([
      ["x", "o", "x"],
      ["o", "x", "o"],
      ["x", "o", "x"],
    ]);

    expect(gameOverValue).toBe("x");
  });
  test("o wins", () => {
    const gameOverValue = isGameOver([
      ["o", "o", "o"],
      ["o", "x", "x"],
      ["x", "o", "x"],
    ]);

    expect(gameOverValue).toBe("o");
  });
});

describe("getBestMove function", () => {
  test("o should move 2|2", () => {
    const { x, y, winner } = getBestMove(
      [
        ["x", "-", "-"],
        ["-", "x", "-"],
        ["o", "-", "-"],
      ],
      "o"
    );

    log(x, y, winner);
    expect(x).toBe(2);
    expect(y).toBe(2);
    expect(winner).toBe("d");
  });
});
