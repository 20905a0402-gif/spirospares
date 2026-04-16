import {defineField, defineType} from 'sanity'

export const heroSectionSchema = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Bikes', value: 'bikes'},
          {title: 'Spares', value: 'spares'},
          {title: 'Gadgets', value: 'gadgets'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      page: 'page',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: `${selection.page} page`,
      }
    },
  },
})
