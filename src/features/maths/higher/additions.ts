/*
 * Higher-only sections inside Foundation Maths lessons, from the Higher revision guide's Level 6-7 boxes. Each goes into
 * its lesson just before the Review and is shown only to Higher students (../tier.ts), with the H tile. Foundation
 * lessons are never edited for Higher content. Screen ids carry an H (L11-H-01), so they never clash with Foundation ids.
 */
import { boundsCalculations } from './boundsCalculations'
import { orderingTerms } from './orderingTerms'
import { squareRoots } from './squareRoots'
import { rearrangingTwice } from './rearrangingTwice'
import { quadraticsHarderSquares, quadraticsNumberInFront } from './quadraticsHigher'
import { quadraticEquationsNumberInFront, quadraticSketching } from './quadraticEquationsHigher'
import { quadraticSequences, sequencesSurds } from './sequencesHigher'
import { graphicalInequalities, quadraticInequalities } from './inequalitiesHigher'
import { nonLinearSimultaneous } from './simultaneousHigher'
import { harderProofs } from './proofHigher'
import { ratioOnLine } from './coordinatesHigher'
import { perpendicularLines } from './perpendicularHigher'
import { lineAndCircle } from './lineCircleHigher'
import { reciprocalExponential } from './reciprocalExponentialHigher'
import type { HigherAddition } from './helpers'

export type { HigherAddition } from './helpers'

export const higherAdditions: readonly HigherAddition[] = [
  orderingTerms, squareRoots, boundsCalculations,
  rearrangingTwice, quadraticsNumberInFront, quadraticsHarderSquares, quadraticEquationsNumberInFront, quadraticSketching,
  sequencesSurds, quadraticSequences, quadraticInequalities, graphicalInequalities, nonLinearSimultaneous, harderProofs,
  ratioOnLine, perpendicularLines, lineAndCircle, reciprocalExponential,
]
