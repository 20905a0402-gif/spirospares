import {defineField, defineType} from 'sanity'

export const faqSchema = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'text', validation: (Rule) => Rule.required()}),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
  ],
})