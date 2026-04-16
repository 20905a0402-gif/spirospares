import {defineField, defineType} from 'sanity'

export const homePageSchema = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'subheadline', title: 'Subheadline', type: 'text'}),
    defineField({name: 'heroBanner', title: 'Hero Banner', type: 'reference', to: [{type: 'banner'}]}),
    defineField({name: 'featuredCollections', title: 'Featured Collections', type: 'array', of: [{type: 'reference', to: [{type: 'featuredCollection'}]}]}),
  ],
})