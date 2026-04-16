import {defineField, defineType} from 'sanity'

export const restockRequestSchema = defineType({
  name: 'restockRequest',
  title: 'Restock Requests',
  type: 'document',
  fields: [
    defineField({
      name: 'productId',
      title: 'Product ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          {title: 'Spare', value: 'spare'},
          {title: 'Bike', value: 'bike'},
          {title: 'Gadget', value: 'gadget'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU / Part Code',
      type: 'string',
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Fulfilled', value: 'fulfilled'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'requestedAt',
      title: 'Requested At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'requestedAtDesc',
      by: [{field: 'requestedAt', direction: 'desc'}],
    },
  ],
})
