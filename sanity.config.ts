import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './sanity/schemaTypes'
import {desk} from './sanity/desk'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ksr83qp0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: desk,
    }),
    media(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
