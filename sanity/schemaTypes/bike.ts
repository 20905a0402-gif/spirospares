import {defineField, defineType} from 'sanity'

export const bikeSchema = defineType({
  name: 'bike',
  title: 'Bikes',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Bike Name',
      type: 'string',
      options: {
        list: [
          {title: 'EKON450M1V1', value: 'EKON450M1V1'},
          {title: 'EKON450M1V2', value: 'EKON450M1V2'},
          {title: 'VEO', value: 'VEO'},
          {title: 'EKON400M1', value: 'EKON400M1'},
          {title: 'EKON450M1', value: 'EKON450M1'},
          {title: 'EKON450M2', value: 'EKON450M2'},
          {title: 'EKON400M2', value: 'EKON400M2'},
          {title: 'COMMANDO', value: 'COMMANDO'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (KES)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'}],
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
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'motor',
      title: 'Motor Power',
      type: 'string',
      description: 'e.g., 5.0kW Peak',
    }),
    defineField({
      name: 'range',
      title: 'Range',
      type: 'string',
      description: 'e.g., 110 km',
    }),
    defineField({
      name: 'battery',
      title: 'Battery Capacity',
      type: 'string',
      description: 'e.g., 72V 45Ah Swappable',
    }),
    defineField({
      name: 'speed',
      title: 'Top Speed',
      type: 'string',
      description: 'e.g., 85 km/h',
    }),
    defineField({
      name: 'chargingTime',
      title: 'Charging Time',
      type: 'string',
      description: 'e.g., 3.5 hours',
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
