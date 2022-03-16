export default {
  name: 'message',
  title: 'Message',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
    },
    {
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
  ],
}
