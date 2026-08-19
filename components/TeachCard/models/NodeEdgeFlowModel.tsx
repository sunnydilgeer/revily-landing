import { MathSpan } from "@/components/MathText";

// ── NodeEdgeFlowModel ─────────────────────────────────────────────────────
// Renders the actual nodes/edges shape MD-16's teach row has in the DB
// right now (confirmed live — the jsonb_set patch mentioned in the prior
// handoff notes was never applied). Each node is a labeled box (a bold
// value plus a smaller descriptive sublabel); each edge's operationLabel
// is shown in a "Step N" box above the arrow connecting the node at index
// i to the node at index i+1, with a numbered circle on the arrow itself.
// This is a distinct component from FlowStepsModel above (which expects
// the steps/arrowLabels shape) — the two share the "flowSteps" style
// string but are discriminated by "nodes" vs "steps".
//
// Node color follows the doc's convention: first node (given quantity) =
// purple, last node (required quantity) = green, any node(s) in between
// (intermediate quantities) = neutral. This is positional, not per-node
// data, since the DB shape doesn't carry a color field for nodes.

const NODE_COLOR = {
  start: { fill: "#a78bfa", border: "#c4b5fd" }, // purple — given quantity
  middle: { fill: "#8a8fa8", border: "#8a8fa8" }, // neutral — intermediate quantity
  end: { fill: "#4ade80", border: "#86efac" }, // green — required quantity
};

function nodeColorFor(index: number, total: number) {
  if (index === 0) return NODE_COLOR.start;
  if (index === total - 1) return NODE_COLOR.end;
  return NODE_COLOR.middle;
}

export function NodeEdgeFlowModel({
  nodes,
  edges,
}: {
  nodes: Array<{ id: string; label: string; sublabel?: string }>;
  edges: Array<{ from: string; to: string; operationLabel: string }>;
}) {
  // The previous min-w + whitespace-nowrap combo forced each node to be
  // as wide as its longest word, so the row as a whole was wider than
  // the card and got clipped/scrolled. Fix: nodes are flex-1/min-w-0 so
  // they truly share the available width and wrap their text onto a
  // second/third line instead of pushing the row wider. Step badges stay
  // fixed-size (their text is short and doesn't need to wrap), so nodes
  // give up exactly the space the badges need.
  return (
    <div className="flex w-full items-start justify-center gap-1">
      {nodes.map((node, i) => {
        const { fill, border } = nodeColorFor(i, nodes.length);
        return (
          <div key={node.id} className="flex min-w-0 flex-1 items-start gap-1">
            <div
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg border px-1.5 py-1.5"
              style={{ borderColor: `${border}55`, background: `${fill}1f` }}
            >
              <div className="text-center text-[11px] font-bold leading-tight text-[#f1f0ee]">
                {node.label}
              </div>
              {node.sublabel && (
                <div className="text-center text-[8px] leading-snug text-[#8a8fa8]">{node.sublabel}</div>
              )}
            </div>
            {i < edges.length && (
              <div className="flex flex-shrink-0 flex-col items-center gap-0.5 pt-1.5">
                <div className="flex items-center gap-0.5 whitespace-nowrap rounded-md border border-[#2e3248] bg-[#1a1d2e] px-1 py-0.5">
                  <span className="text-[7px] font-bold text-[#8a8fa8]">{i + 1}.</span>
                  <span className="text-[9px] font-bold text-[#f1f0ee]">
                    <MathSpan latex={edges[i].operationLabel} />
                  </span>
                </div>
                <div className="text-xs text-[#8a8fa8]">→</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}