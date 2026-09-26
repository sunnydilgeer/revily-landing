import { AlveolarExchange, AlveolarNetwork, LungAirway } from './LungVisuals'
import { CoronaryVisual, DoubleCirculation, HeartAnatomy, PacemakerVisual, ValveVisual } from './HeartVisuals'
import { CapillaryNetwork, CapillaryWall, VesselComparison } from './VesselVisuals'

export function CirculationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('lung-airway') || focus === 'lung-route-question') return <LungAirway focus={focus} assessment={assessment}/>
  if (focus === 'lung-alveolus-network' || focus === 'lung-adaptation-area') return <AlveolarNetwork area={focus === 'lung-adaptation-area'}/>
  if (focus.startsWith('lung-')) return <AlveolarExchange focus={focus} assessment={assessment}/>
  if (focus.startsWith('heart-double')) return <DoubleCirculation focus={focus} assessment={assessment}/>
  if (focus === 'heart-valves') return <ValveVisual/>
  if (focus === 'heart-coronary') return <CoronaryVisual/>
  if (focus.startsWith('heart-pacemaker')) return <PacemakerVisual artificial={focus.endsWith('artificial')}/>
  if (focus.startsWith('heart-')) return <HeartAnatomy focus={focus} assessment={assessment}/>
  if (focus === 'vessel-exchange-network') return <CapillaryNetwork/>
  if (focus === 'vessel-exchange-wall') return <CapillaryWall/>
  return <VesselComparison focus={focus} assessment={assessment}/>
}
