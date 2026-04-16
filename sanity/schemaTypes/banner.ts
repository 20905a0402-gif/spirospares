import {defineField, defineType} from 'sanity'

export const bannerSchema = defineType({
  name: 'banner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text'}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'ctaLabel', title: 'CTA Label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'CTA Link', type: 'string'}),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
  ],
})