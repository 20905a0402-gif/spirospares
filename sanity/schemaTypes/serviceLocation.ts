import {defineField, defineType} from 'sanity'

export const serviceLocationSchema = defineType({
  name: 'serviceLocation',
  title: 'Service Locations',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Area/Zone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
    }),
    defineField({
      name: 'services',
      title: 'Services Offered',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'hours',
      title: 'Operating Hours',
      type: 'string',
      description: 'e.g., Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
    }),
    defineField({
      name: 'mapLink',
      title: 'Google Maps Link',
      type: 'url',
    }),
    defineField({
      name: 'batterySwapping',
      title: 'Battery Swapping Available',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
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
      city: 'city',
      area: 'area',
    },
    prepare(selection) {
      const {title, city, area} = selection
      return {
        title: title,
        subtitle: `${area}, ${city}`,
      }
    },
  },
})
