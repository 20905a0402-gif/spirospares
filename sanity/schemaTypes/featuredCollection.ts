import {defineField, defineType} from 'sanity'

export const featuredCollectionSchema = defineType({
  name: 'featuredCollection',
  title: 'Featured Collection',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'products', title: 'Products', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}]}),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
  ],
})