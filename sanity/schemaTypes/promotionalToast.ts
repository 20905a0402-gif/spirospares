import {defineField, defineType} from 'sanity'

export const promotionalToastSchema = defineType({
  name: 'promotionalToast',
  title: 'Promotional Toast',
  type: 'document',
  fields: [
    defineField({name: 'message', title: 'Message', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'linkLabel', title: 'Link Label', type: 'string'}),
    defineField({name: 'linkHref', title: 'Link Href', type: 'string'}),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
  ],
})