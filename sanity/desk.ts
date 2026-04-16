import {StructureBuilder} from 'sanity/structure'

export const desk = (S: StructureBuilder) =>
  S.list()
    .title('Content Studio')
    .items([
      // 1) Product Catalog
      S.listItem()
        .title('🛠️ Product Catalog')
        .child(
          S.list()
            .title('Product Catalog')
            .items([
              S.listItem()
                .title('Products')
                .child(
                  S.list()
                    .title('Products')
                    .items([
                      S.listItem()
                        .title('All Products')
                        .child(S.documentTypeList('product').title('All Products')),
                      S.listItem()
                        .title('Out of Stock')
                        .child(
                          S.documentList()
                            .title('Out of Stock Products')
                            .schemaType('product')
                            .filter('_type == "product" && stock <= 0')
                        ),
                      S.listItem()
                        .title('Discounted')
                        .child(
                          S.documentList()
                            .title('Discounted Products')
                            .schemaType('product')
                            .filter('_type == "product" && defined(compareAtPrice) && compareAtPrice > price')
                        ),
                    ])
                ),
              S.listItem()
                .title('Categories')
                .child(S.documentTypeList('category').title('Categories')),
              S.listItem()
                .title('Brands')
                .child(S.documentTypeList('brand').title('Brands')),
              S.divider(),
              S.listItem()
                .title('Bikes')
                .child(S.documentTypeList('bike').title('Bikes')),
              S.listItem()
                .title('Spare Parts')
                .child(S.documentTypeList('sparePart').title('Spare Parts')),
              S.listItem()
                .title('Gadgets')
                .child(S.documentTypeList('gadget').title('Gadgets')),
              S.listItem()
                .title('Service Locations')
                .child(S.documentTypeList('serviceLocation').title('Service Locations')),
            ])
        ),

      // 2) Marketing & Storefront
      S.listItem()
        .title('📢 Marketing & Storefront')
        .child(
          S.list()
            .title('Marketing & Storefront')
            .items([
              S.listItem()
                .title('Home Page (Singleton)')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Home Page')
                ),
              S.listItem()
                .title('Hero Banners')
                .child(S.documentTypeList('banner').title('Hero Banners')),
              S.listItem()
                .title('Featured Collections')
                .child(S.documentTypeList('featuredCollection').title('Featured Collections')),
              S.listItem()
                .title('Promotional Toasts')
                .child(S.documentTypeList('promotionalToast').title('Promotional Toasts')),
              S.divider(),
              S.listItem()
                .title('Hero Sections (Legacy)')
                .child(S.documentTypeList('heroSection').title('Hero Sections (Legacy)')),
              S.listItem()
                .title('Pages')
                .child(S.documentTypeList('page').title('Pages')),
            ])
        ),

      // 3) Support & Operations
      S.listItem()
        .title('📝 Support & Operations')
        .child(
          S.list()
            .title('Support & Operations')
            .items([
              S.listItem()
                .title('Customer Reviews')
                .child(S.documentTypeList('customerReview').title('Customer Reviews')),
              S.listItem()
                .title('FAQs')
                .child(S.documentTypeList('faq').title('FAQs')),
              S.listItem()
                .title('Guides')
                .child(S.documentTypeList('guide').title('Guides')),
              S.listItem()
                .title('Restock Requests')
                .child(S.documentTypeList('restockRequest').title('Restock Requests')),
            ])
        ),

      // 4) Global Settings
      S.listItem()
        .title('⚙️ Global Settings')
        .child(
          S.list()
            .title('Global Settings')
            .items([
              S.listItem()
                .title('Site Configuration (Singleton)')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site Configuration')
                ),
              S.listItem()
                .title('Navigation')
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                    .title('Navigation')
                ),
              S.listItem()
                .title('SEO Metadata')
                .child(
                  S.document()
                    .schemaType('seoDefaults')
                    .documentId('seoDefaults')
                    .title('SEO Metadata')
                ),
            ])
        ),
    ])

