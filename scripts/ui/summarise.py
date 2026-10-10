"""Summarise sweep.cjs output: python3 scripts/ui/summarise.py ui-results/*.jsonl
Per group and screen size: crashes, page scroll, inner scroll, sideways clipping, small text, small tap targets, the roll, fitting."""
import json, sys

rows = [json.loads(line) for path in sys.argv[1:] for line in open(path) if line.strip()]
lessons = lambda rs: sorted({r['lesson'] for r in rs})
for group in ['numbers', 'graphs', 'diagrams']:
    if not any(r['group'] == group for r in rows): continue
    print(f'\n=== {group.upper()}')
    for size in ['desktop', 'laptop', 'phone', 'small']:
        R = [r for r in rows if r['group'] == group and r['size'] == size and r.get('kind') in ('card', 'done')]
        if not R: continue
        errs = [r for r in rows if r['group'] == group and r['size'] == size and r.get('errors')]
        over = [r for r in R if r.get('over', 0) > 2]
        wide = [r for r in R if r.get('wide', 0) > 4]
        small = [r for r in R if r.get('smallText', 99) < 11]
        taps = [r for r in R if r.get('tinyTaps', 0) > 0]
        rolls = [r for r in R if r.get('roll')]
        zoomed = [r for r in R if r.get('zoomed', 1) < 1]
        print(f"{size:8} screens {len(R):4} | crashes {len(errs)} {lessons(errs)} | page scroll {sum(r['pageScroll'] for r in R)} | "
              f"inner scroll {len(over)} ({100 * len(over) // len(R)}%) worst {max([r['over'] for r in over], default=0)}px")
        print(f"         clipped sideways {len(wide)} {lessons(wide)[:10]} | text under 11px {len(small)} (min {min(r.get('smallText', 99) for r in R)}px) {lessons(small)[:10]} | "
              f"small tap targets on {len(taps)} screens | roll on {len(rolls)} ({sum(r['roll']['capped'] for r in rolls)} capped) | diagram zoomed {len(zoomed)}")
        worst = sorted(over, key=lambda r: -r['over'])[:5]
        if worst: print('         worst inner scroll:', ', '.join(f"L{r['lesson']}#{r['i']} {r['over']}px" for r in worst))
