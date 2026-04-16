import {defineField, defineType} from 'sanity'

export const gadgetSchema = defineType({
  name: 'gadget',
  title: 'Gadgets & Accessories',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Gadget Name',
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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'compatibility',
      title: 'Compatibility Information',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Phone Holders', value: 'Phone holders'},
          {title: 'Chargers', value: 'Chargers'},
          {title: 'Safety', value: 'Safety'},
          {title: 'Security', value: 'Security'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technicalDetails',
      title: 'Technical Details',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
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
      image: 'images.0',
    },
    prepare(selection) {
      const {title, price} = selection
      return {
        title: title,
        subtitle: `KES ${price?.toLocaleString()}`,
        image: selection.image,
      }
    },
  },
})
