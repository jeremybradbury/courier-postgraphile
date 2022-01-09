module.exports = {
  query: `
  mutation CreateThread(
    $sessionId: UUID!
  ) {
    createThread(
      input: {
        thread: {
          ownerId: $sessionId
        }
      }
    ) {
      thread {
        id
        owner {
          id
          publicKey
        }
      }
    }
  }
`,
};
