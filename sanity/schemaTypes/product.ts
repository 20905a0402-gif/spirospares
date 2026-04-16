import {defineField, defineType} from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          {title: 'Bike', value: 'bike'},
          {title: 'Spare Part', value: 'sparePart'},
          {title: 'Gadget', value: 'gadget'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'brand', title: 'Brand', type: 'reference', to: [{type: 'brand'}]}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}]}),
    defineField({name: 'sku', title: 'SKU', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'number', validation: (Rule) => Rule.required().positive()}),
    defineField({name: 'compareAtPrice', title: 'Compare At Price', type: 'number'}),
    defineField({name: 'stock', title: 'Stock', type: 'number', validation: (Rule) => Rule.required().min(0)}),
    defineField({name: 'images', title: 'Images', type: 'array', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
  ],
})