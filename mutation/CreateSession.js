module.exports = {
  query: `
  mutation CreateSession(
    $publicKey: String!
    $threadId: String
  ) {
    createSession(
      input: {
        session: {
          publicKey: $publicKey
          threadId: $threadId
        }
      }
    ) {
      session {
        id
        publicKey
        thread {
          id
          owner { id }
        }
      }
    }
  }
`,
};
