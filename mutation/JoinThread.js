module.exports = {
  query: `
  mutation JoinThread(
    $threadId: String!, 
    $sessionId: UUID!
  ) {
    updateSession(input: { 
      id: $sessionId, 
      patch: { 
        threadId: $threadId 
      } 
    }) {
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
