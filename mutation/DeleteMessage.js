module.exports = {
  query: `
  mutation DeleteMessage($id: UUID!) {
    deleteMessage(input: { id: $id }) {
      deletedMessageNodeId
    }
  }
`,
};
