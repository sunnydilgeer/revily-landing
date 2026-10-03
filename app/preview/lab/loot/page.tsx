import type { Metadata } from 'next'
import LootPacker from '../../../../src/features/maths/labs/loot/LootPacker'

export const metadata: Metadata = {
  title: 'Loot Packer | Revily lab',
  description: 'Prototype chapter: volume of cuboids in cubes, cm³ and litres, by packing loot chests before the drop ship leaves.',
}

export default function LootLabPage() {
  return <div className="lab-page"><LootPacker /></div>
}
