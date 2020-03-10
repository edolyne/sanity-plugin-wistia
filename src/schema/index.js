import WistiaInput from '../components/input'

export default {
  name: 'wistia',
  type: 'object',
  title: 'Wistia Video Input with Preview',
  fields: [
    {
      name: 'id',
      type: 'string',
      required: true
    },{
      name: 'title',
      type: 'string'
    }
  ],
  inputComponent: WistiaInput
}