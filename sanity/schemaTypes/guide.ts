import {defineField, defineType} from 'sanity'

export const guideSchema = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'summary', title: 'Summary', type: 'text'}),
    defineField({name: 'content', title: 'Content', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'isPublished', title: 'Published', type: 'boolean', initialValue: true}),
  ],
})