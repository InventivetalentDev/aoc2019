import "./monkey"
import { test } from "./test"
import { readInput } from "./readInput"
import { arr, com, mul, dis } from "@arrows/arrows"
import * as math from "mathjs"
import * as iter from "iter-tools"
import * as R from "ramda"
import * as graph from "graphlib"

const log = (data) => console.dir(data, { colors: true, depth: 99 })

export { test, readInput, arr, com, mul, dis, math, iter, R, graph, log }
export default { test, readInput }
