import {defineField, defineType} from 'sanity'

export const seoDefaultsSchema = defineType({
  name: 'seoDefaults',
  title: 'SEO Defaults',
  type: 'document',
  fields: [
    defineField({name: 'defaultTitle', title: 'Default Title', type: 'string'}),
    defineField({name: 'defaultDescription', title: 'Default Description', type: 'text'}),
    defineField({name: 'defaultOgImage', title: 'Default OG Image', type: 'image', options: {hotspot: true}}),
  ],
})