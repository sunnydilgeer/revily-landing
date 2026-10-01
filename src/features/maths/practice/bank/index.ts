import type { Template } from '../types'
import { accuracyTemplates } from './accuracy'
import { standardFormTemplates } from './standardForm'
import { likeTermsTemplates } from './likeTerms'
import { indicesTemplates } from './indices'
import { expandingTemplates } from './expanding'
import { factorisingTemplates } from './factorising'
import { equationsTemplates } from './equations'
import { rearrangingTemplates } from './rearranging'
import { quadraticsTemplates } from './quadratics'
import { calculationTemplates } from './calculation'
import { fractionTemplates } from './fractions'
import { moneyTemplates } from './money'

/** Every Practice template. Number only for now: the other branches are not taught yet. */
export const templates: Template[] = [...calculationTemplates, ...moneyTemplates, ...fractionTemplates, ...accuracyTemplates, ...standardFormTemplates, ...likeTermsTemplates, ...indicesTemplates, ...expandingTemplates, ...factorisingTemplates, ...equationsTemplates, ...rearrangingTemplates, ...quadraticsTemplates]
