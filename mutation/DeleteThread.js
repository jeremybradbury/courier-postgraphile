module.exports = {
  query: `
  mutation DeleteThread($id: String!) {
    deleteThread(input: { id: $id }) {
      deletedThreadNodeId
    }
  }
`,
};
