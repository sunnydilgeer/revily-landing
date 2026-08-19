// ── MultiplesModel ───────────────────────────────────────────────────────
// No fraction bars — two rows of circled numbers, shared multiples
// highlighted, the first shared value given extra emphasis. Used for
// lowest-common-denominator skills where the concept is about matching
// numbers, not shaded parts of a whole.

export function MultiplesModel({
  labelA,
  listA,
  labelB,
  listB,
  commonValues,
  firstCommon,
  annotation,
}: {
  labelA: string;
  listA: number[];
  labelB: string;
  listB: number[];
  commonValues: number[];
  firstCommon: number;
  annotation?: string;
}) {
  function renderRow(label: string, list: number[], key: string) {
    return (
      <div key={key} className="flex items-center gap-3">
        <div className="w-28 flex-shrink-0 text-right text-xs font-bold text-[#f1f0ee] sm:w-32">
          {label}
        </div>
        <div className="flex flex-wrap gap-2">
          {list.map((n, i) => {
            const isCommon = commonValues.includes(n);
            const isFirst = n === firstCommon;
            return (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10"
                style={{
                  border: `${isFirst ? 3 : 2}px solid ${
                    isFirst ? "#4ade80" : isCommon ? "#4ade8066" : "#2e3248"
                  }`,
                  background: isFirst ? "#4ade8022" : isCommon ? "#4ade8011" : "transparent",
                  color: isCommon ? "#86efac" : "#8a8fa8",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {renderRow(labelA, listA, "a")}
      {renderRow(labelB, listB, "b")}
      {annotation && (
        <div className="mt-1 text-center text-xs font-bold text-[#4ade80]">{annotation}</div>
      )}
    </div>
  );
}

