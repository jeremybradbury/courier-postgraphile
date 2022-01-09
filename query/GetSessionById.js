module.exports = {
  query: `
  query GetSessionById($id: UUID!) {
    session(id: $id) {
      id
      publicKey
      thread {
        id
        owner {
          publicKey
          id
        }
      }
    }
  }
`,
};
