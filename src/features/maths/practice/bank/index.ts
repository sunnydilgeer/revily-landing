import type { Template } from '../types'
import { accuracyTemplates } from './accuracy'
import { calculationTemplates } from './calculation'
import { fractionTemplates } from './fractions'

/** Every Practice template. Number only for now: the other branches are not taught yet. */
export const templates: Template[] = [...calculationTemplates, ...fractionTemplates, ...accuracyTemplates]
