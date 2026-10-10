import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'
import { DEPTH, cone, cuboid, cylinder, frustum, prism, sphere, squarePyramid, tetrahedron } from '../../geometry/tutor/solidPictures'

/*
 * Geometry lesson 13: 3D shapes. From GM13 in Sunny's revision book (p141–142), with the book's own shapes. Three rungs:
 * naming the eight shapes the book lists (tetrahedron, cube, cuboid, square-based pyramid, triangular prism, cylinder,
 * cone, sphere; Your Turn Q2); counting faces, edges and vertices of flat-faced shapes, including the frustum (Your Turn
 * Q3 and Q4); and the curved ones, where a curved surface counts as a face and a curved edge as an edge (Your Turn Q5).
 * Built like lessons 1 to 12, but with no measuring board: the counting is done on the pictures, lighting each face,
 * edge or corner in turn.
 *
 * Hidden on live like lessons 1 to 12: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(213)
const { add, finish } = lesson
const { worked, practice } = screens(lesson)
const names = 'geometry-3d-names'
const counting = 'geometry-3d-counting'
const curved = 'geometry-3d-curved'

const pic = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => fig(items, spoken, caption, 20)
const corners = (pts: FigurePoint[]): FigureItem[] => pts.map(at => ({ kind: 'point' as const, at }))
const back = ([x, y]: FigurePoint, l: number): FigurePoint => [x + DEPTH[0] * l, y + DEPTH[1] * l]

/* ---------- Rung 1: names ---------- */

{
  const face: FigurePoint[] = [[0, 0], [3, 0], [1.5, 2]]
  const p = pic(prism(face, 5), 'A 3D shape: a triangle at each end joined by three rectangles.')
  worked(names, 'What is this 3D shape called?', 'Naming 3D shapes', 'GM13 p141 3D shapes: faces, edges and vertices', boardModel([], [
    { title: 'Look at the ends', say: 'The front face is a triangle, and the same triangle runs all the way through to the back.', rows: ['>0 Same triangle all the way through'], picture: pic(prism(face, 5, { lit: 'face' }), 'A triangular prism with its triangular end lit.') },
    { title: 'Name it', say: 'A shape with the same cross-section all the way through is a prism. Its cross-section is a triangle.', rows: ['! A triangular prism'], picture: pic(prism(face, 5), 'A triangular prism.', 'Triangular prism') },
  ], 'Name', p), '3D shapes have length, width and depth. A prism has the same cross-section all the way through; a pyramid comes to a point. Learn the eight in the book: tetrahedron, cube, cuboid, square-based pyramid, triangular prism, cylinder, cone and sphere.')
}
{
  const p = pic(squarePyramid(3, 3.5), 'A 3D shape with a square base and four triangles meeting at a point.')
  practice(names, 'What is this 3D shape called?', 'GM13 Your Turn Q2', p,
    choose('Square-based pyramid', ['Tetrahedron', 'A tetrahedron’s base is a triangle. This base is a square.'], ['Triangular prism', 'A prism is the same all the way through. This comes to a point.'], ['Cone', 'A cone has a round base and a curved side.']),
    'Look at the base, then at the top.', boardModel([], [
      { title: 'Base and top', say: 'A square base, with four triangles meeting at a point above it.', rows: ['! Square-based pyramid'], picture: pic(squarePyramid(3, 3.5, {}, 'base'), 'A square-based pyramid with its base lit.', 'Square-based pyramid') },
    ], 'Name', p))
}
{
  const p = pic(cone(1.5, 3.2), 'A 3D shape with a round base and a curved side coming to a point.')
  practice(names, 'What is this 3D shape called?', 'GM13 Your Turn Q2', p,
    choose('Cone', ['Cylinder', 'A cylinder has a circle at both ends. This comes to a point.'], ['Square-based pyramid', 'A pyramid’s base has straight sides. This base is round.'], ['Sphere', 'A sphere is round all over, like a ball.']),
    'Round base, pointed top.', boardModel([], [
      { title: 'Base and top', say: 'A circle for a base and one curved side up to a point.', rows: ['! Cone'], picture: pic(cone(1.5, 3.2, {}, 'base'), 'A cone with its base lit.', 'Cone') },
    ], 'Name', p))
}
{
  const p = pic(tetrahedron(3), 'A 3D shape made of four triangles.')
  practice(names, 'What is this 3D shape called?', 'GM13 p141 Tetrahedron', p,
    choose('Tetrahedron', ['Square-based pyramid', 'Its base is a triangle, not a square.'], ['Triangular prism', 'A prism is the same all the way through. This comes to a point.'], ['Cone', 'Every face here is flat.']),
    'Count the faces: every one is a triangle.', boardModel([], [
      { title: 'Four triangles', say: 'Four faces, every one a triangle: a triangle-based pyramid, called a tetrahedron.', rows: ['! Tetrahedron'], picture: pic(tetrahedron(3, 'edges'), 'A tetrahedron with its edges lit.', 'Tetrahedron') },
    ], 'Name', p))
}

/* ---------- Rung 2: faces, edges and vertices ---------- */

{
  const w = 3, h = 2, l = 3
  const front: FigurePoint[] = [[0, 0], [w, 0], [w, h], [0, h]], rear = front.map(p => back(p, l))
  const base = cuboid(w, h, l, {}, { shade: 'none' })
  const p = pic(base, 'A cuboid.')
  worked(counting, 'How many faces, edges and vertices does a cuboid have?', 'Faces, edges and vertices', 'GM13 p141 3D shapes: vocabulary', boardModel([], [
    { title: 'Faces', say: 'A face is a flat surface: front and back, top and bottom, left and right.', rows: ['Faces = 6'], picture: pic(cuboid(w, h, l, {}, { lit: 'face' }), 'A cuboid with its front face lit.') },
    { title: 'Edges', say: 'An edge is a line where two faces meet: 4 round the front, 4 round the back, and 4 joining them.', rows: ['Edges = 4 + 4 + 4 = 12'], picture: pic([...base, ...front.map((q, i) => ({ kind: 'line' as const, from: q, to: front[(i + 1) % 4], style: 'lit' as const }))], 'A cuboid with the four edges round its front lit.') },
    { title: 'Vertices', say: 'A vertex is a corner, where edges meet: 4 at the front and 4 at the back.', rows: ['Vertices = 4 + 4 = 8', '! 6 faces, 12 edges, 8 vertices'], picture: pic([...base, ...corners([...front, ...rear])], 'A cuboid with its eight corners marked.', 'F 6, E 12, V 8') },
  ], 'Count', p), 'Faces are the flat surfaces, edges are the lines where faces meet, and vertices (one is a vertex) are the corners where edges meet.')
}
for (const [what, shape, right, why, wrong] of [
  ['faces', 'triangular prism', 5, 'Two triangles at the ends, and three rectangles round the sides.', [[6, 'That’s a cuboid. The ends here are triangles, with three sides each: three rectangles.'], [3, 'Count the rectangles and the two triangle ends.']]],
  ['edges', 'square-based pyramid', 8, 'Four round the square base, and four going up to the top.', [[5, 'That’s the faces. Count the lines where faces meet.'], [4, 'Count the base edges too.']]],
  ['vertices', 'tetrahedron', 4, 'Three round the base, and one at the top.', [[6, 'That’s the edges. Count the corners.'], [3, 'Count the corner at the top too.']]],
] as [string, string, number, string, [number, string][]][]) {
  const items = shape === 'triangular prism' ? prism([[0, 0], [3, 0], [1.5, 2]], 5) : shape === 'square-based pyramid' ? squarePyramid(3, 3.5, {}) : tetrahedron(3)
  const litItems = shape === 'triangular prism' ? prism([[0, 0], [3, 0], [1.5, 2]], 5, { lit: 'face' }) : shape === 'square-based pyramid' ? squarePyramid(3, 3.5, {}, 'face') : tetrahedron(3, 'vertices')
  const p = pic(items, `A ${shape}.`)
  practice(counting, `How many ${what} does a ${shape} have?`, shape === 'triangular prism' ? 'GM13 Your Turn Q3' : 'GM13 p141 (book’s shapes)', p, number(right, String(right)), what === 'faces' ? 'Flat surfaces.' : what === 'edges' ? 'Lines where two faces meet.' : 'Corners.', boardModel([], [
    { title: `Count the ${what}`, say: why, rows: [`${what[0].toUpperCase()}${what.slice(1)} = ${right}`, `! ${right} ${what}`], picture: pic(litItems, `A ${shape}.`, `${right} ${what}`) },
  ], 'Count', p), slips(right, wrong), { label: `Number of ${what}`, prefix: `${what[0].toUpperCase()} =` })
}
{
  const p = pic(frustum(3, 1.6, 2.4), 'A frustum: a square-based pyramid with its top cut off flat.')
  practice(counting, 'This frustum is a square-based pyramid with its top cut off. How many edges does it have?', 'GM13 Your Turn Q4', p, number(12, '12'), 'Count round the bottom, round the top, and the sloping edges between.', boardModel([], [
    { title: 'Count the edges', say: '4 round the bottom square, 4 round the top square, and 4 sloping edges joining them.', rows: ['Edges = 4 + 4 + 4 = 12', '! 12 edges'], picture: pic(frustum(3, 1.6, 2.4), 'A frustum.', '6 faces, 12 edges, 8 vertices') },
  ], 'Count', p), slips(12, [[8, 'That’s the pyramid it was cut from. Cutting the top off adds 4 edges round the top.'], [6, 'That’s the faces.']]), { label: 'Number of edges', prefix: 'E =' })
}

/* ---------- Rung 3: curved shapes ---------- */

{
  const p = pic(cylinder(1.4, 3), 'A cylinder.')
  worked(curved, 'How many faces, edges and vertices does a cylinder have?', 'Curved shapes', 'GM13 p141 Cylinder', boardModel([], [
    { title: 'Faces', say: 'Two flat circles, top and bottom, and one curved surface round the side. A curved surface counts as a face.', rows: ['Faces = 2 + 1 = 3'], picture: pic(cylinder(1.4, 3, {}, 'side'), 'A cylinder with its curved side lit.') },
    { title: 'Edges', say: 'An edge is where two faces meet: the circle round the top and the circle round the bottom. Curved edges count.', rows: ['Edges = 2'], picture: pic(cylinder(1.4, 3, {}, 'top'), 'A cylinder with its top lit.') },
    { title: 'Vertices', say: 'There are no corners anywhere: no vertices.', rows: ['Vertices = 0', '! 3 faces, 2 edges, 0 vertices'], picture: pic(cylinder(1.4, 3), 'A cylinder.', 'F 3, E 2, V 0') },
  ], 'Count', p), 'On curved shapes, a curved surface is a face and a curved line where two faces meet is an edge. A vertex is still a point: a cone has one, a cylinder and a sphere have none.')
}
{
  const p = pic(cone(1.5, 3.2), 'A cone.')
  practice(curved, 'How many faces does a cone have?', 'GM13 p141 Cone', p, number(2, '2'), 'Flat surfaces and curved ones both count.', boardModel([], [
    { title: 'Flat and curved', say: 'One flat circle underneath and one curved surface round the side.', rows: ['Faces = 1 + 1 = 2', '! 2 faces'], picture: pic(cone(1.5, 3.2, {}, 'slant'), 'A cone with its curved side lit.', '2 faces, 1 edge, 1 vertex') },
  ], 'Count', p), slips(2, [[1, 'Count the curved side too: a curved surface is a face.'], [0, 'The flat circle underneath is a face, and so is the curved side.']]), { label: 'Number of faces', prefix: 'F =' })
}
{
  const p = pic(sphere(1.6), 'A sphere.')
  practice(curved, 'How many edges does a sphere have?', 'GM13 Your Turn Q5', p, number(0, '0'), 'An edge is where two faces meet. How many faces are there?', boardModel([], [
    { title: 'One face', say: 'A sphere has one curved face all the way round. With only one face, no two faces meet: no edges, and no vertices.', rows: ['Edges = 0', '! 1 face, 0 edges, 0 vertices'], picture: pic(sphere(1.6, undefined, true), 'A sphere.', 'F 1, E 0, V 0') },
  ], 'Count', p), slips(0, [[1, 'The dashed line round the middle is only drawn to show it’s round. It isn’t an edge.']]), { label: 'Number of edges', prefix: 'E =' })
}

add('mixed', '3D shapes', 'GM13 consolidation', text(
  'Prisms: the same cross-section all the way through. Pyramids: up to a point.',
  'Faces: flat or curved surfaces. Edges: where two faces meet. Vertices: corners.',
  'Cuboid 6, 12, 8. Triangular prism 5, 9, 6. Square-based pyramid 5, 8, 5.',
  'Cylinder 3, 2, 0. Cone 2, 1, 1. Sphere 1, 0, 0.',
))

export const tutorSolidsLesson: TutorMethodLesson = {
  id: 'L213', number: 213, title: '3D shapes', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Name the common 3D shapes and count their faces, edges and vertices.',
  labels: { [names]: 'Names', [counting]: 'Faces, edges, vertices', [curved]: 'Curved shapes', mixed: 'Review' },
  states: finish(),
}
