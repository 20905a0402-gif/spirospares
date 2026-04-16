import {defineField, defineType} from 'sanity'

export const categorySchema = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Category Type',
      type: 'string',
      options: {
        list: [
          {title: 'Bike', value: 'bike'},
          {title: 'Spare Part', value: 'sparePart'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.type,
      }
    },
  },
})
