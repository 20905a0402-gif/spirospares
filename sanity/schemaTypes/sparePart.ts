import {defineField, defineType} from 'sanity'

export const sparePartSchema = defineType({
  name: 'sparePart',
  title: 'Spare Parts',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Part Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partCode',
      title: 'Part Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (KES)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Body & Trim', value: 'Body & Trim'},
          {title: 'Frame & Suspension', value: 'Frame & Suspension'},
          {title: 'General', value: 'General'},
          {title: 'Electrical', value: 'Electrical'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'compatibleModels',
      title: 'Compatible Bike Models',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'bike'}],
        },
      ],
    }),
    defineField({
      name: 'function',
      title: 'Function/Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'replacementCycle',
      title: 'Replacement Cycle',
      type: 'text',
      description: 'When and how often to replace this part',
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'quality',
      title: 'Quality Standards',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      image: 'image',
      code: 'partCode',
    },
    prepare(selection) {
      const {title, price, code} = selection
      return {
        title: `${title} (${code})`,
        subtitle: `KES ${price?.toLocaleString()}`,
        image: selection.image,
      }
    },
  },
})
