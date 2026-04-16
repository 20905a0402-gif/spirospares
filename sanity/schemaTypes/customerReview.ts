import {defineField, defineType} from 'sanity'

export const customerReviewSchema = defineType({
  name: 'customerReview',
  title: 'Customer Review',
  type: 'document',
  fields: [
    defineField({name: 'customerName', title: 'Customer Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'rating', title: 'Rating', type: 'number', validation: (Rule) => Rule.required().min(1).max(5)}),
    defineField({name: 'comment', title: 'Comment', type: 'text', validation: (Rule) => Rule.required()}),
    defineField({name: 'isApproved', title: 'Approved', type: 'boolean', initialValue: false}),
  ],
})