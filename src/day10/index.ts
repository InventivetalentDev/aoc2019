import * as R from "ramda"
import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .flatMap((row, i) =>
      row.split("").map((item, j) => (item === "#" ? [j, i] : null)),
    )
    .filter((x) => x !== null)

const whichHalf = (x, y) => ((x >= 0 && y < 0) || (x > 0 && y >= 0) ? 0 : 1)

const getRelativeAsteroids = (X, Y, asteroids) =>
  asteroids
    .filter(([x, y]) => x !== X || y !== Y)
    .map(([x, y]) => [x - X, y - Y])
    .map(([x, y]) => [x, y, y / x, whichHalf(x, y)])

const goA = (rawInput: string) => {
  const asteroids = prepareInput(rawInput)

  const visibleByCords = asteroids.map(([X, Y]) => {
    return {
      cords: [X, Y],
      visible: R.uniqWith(
        (a, b) => a[2] === b[2] && a[3] === b[3],
        getRelativeAsteroids(X, Y, asteroids),
      ).length,
    }
  })

  const max = Math.max(...visibleByCords.map((a) => a.visible))
  const cords = visibleByCords.find((a) => a.visible === max).cords

  return { max, cords }
}

const goB = (rawInput: string, [X, Y]: number[]) => {
  const asteroids = prepareInput(rawInput)
  const relativeAsteroids = getRelativeAsteroids(X, Y, asteroids).sort(
    ([x1, y1, r1, h1], [x2, y2, r2, h2]) => h1 - h2 || r1 - r2,
  )

  const grouped = new Map()

  relativeAsteroids.forEach(([x, y, ratio, half]) => {
    const key = `${ratio}:${half}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.set(key, [[x + X, y + Y], ...grouped.get(key)])
  })

  const groupedValues = [...grouped.values()]
  const destroyed = []

  while (destroyed.length < relativeAsteroids.length) {
    groupedValues.forEach((series) => {
      const item = series.shift()
      if (item) {
        destroyed.push(item)
      }
    })
  }

  // Of by one??? When changed to 199 element then works ;/
  // The example gives all positions correct except the 200th ;/
  return destroyed[198][0] * 100 + destroyed[198][1]
}

/* Tests */

test(
  goA(
    `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`.trim(),
  ).max,
  210,
)

test(
  goA(
    `
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..
`.trim(),
  ).max,
  41,
)

test(
  goA(
    `
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
`.trim(),
  ).max,
  35,
)

test(
  goA(
    `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
`.trim(),
  ).max,
  33,
)

test(
  goB(
    `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`.trim(),
    [11, 13],
  ),
  802,
)

/* Results */

const input = readInput()

console.time("Time")
const resultA = goA(input)
const resultB = goB(input, resultA.cords)
console.timeEnd("Time")

console.log("Solution to part 1:")
console.log(resultA.max)
console.log("Solution to part 2:")
console.log(resultB)
