module.exports = {
  query: `
  mutation DeleteSession($id: UUID!) {
    deleteSession(input: { id: $id }) {
      deletedSessionNodeId
    }
  }
`,
};
