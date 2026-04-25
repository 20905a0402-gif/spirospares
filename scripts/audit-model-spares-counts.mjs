import dotenv from 'dotenv'
import {getLegacySpareParts} from '../lib/sanity/queries-data.ts'
import {homeAndSparesModelTargets} from '../lib/modelTargets.ts'

dotenv.config({path: '.env.local'})

const normalize = (value) => String(value || '').trim().toUpperCase()

const parts = await getLegacySpareParts()

for (const model of homeAndSparesModelTargets) {
  const tokens = [...model.searchTokens, ...(model.fallbackTokens || [])].map(normalize)
  const count = parts.filter((part) =>
    part.compatible_models.some((compatibleModel) => {
      const normalized = normalize(compatibleModel)
      return tokens.some((token) => normalized.includes(token))
    })
  ).length
  console.log(`${model.label}: ${count}`)
}
