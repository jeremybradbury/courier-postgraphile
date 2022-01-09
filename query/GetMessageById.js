module.exports = {
  query: `
  query GetMessageById($id: UUID!) {
    message(id: $id) {
      id
      body
      from {
        id
        publicKey
      }
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
