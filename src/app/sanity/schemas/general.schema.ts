import { defineType } from 'sanity'

export const general = defineType({
  name: 'general',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Заголовок'
    },
    {
      name: 'description',
      type: 'internationalizedArrayString',
      title: 'Описание'
    },
    {
      name: 'address',
      type: 'internationalizedArrayString',
      title: 'Адрес'
    },
    {
      name: 'seeAll',
      type: 'internationalizedArrayString',
      title: 'Смотреть все'
    },
    {
      name: 'promotionText',
      type: 'internationalizedArrayString',
      title: 'Текст промо'
    },
    {
      name: 'promotionButtonText',
      type: 'internationalizedArrayString',
      title: 'Текст кнопки промо'
    }
  ]
})
