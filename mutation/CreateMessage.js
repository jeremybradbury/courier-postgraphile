module.exports = {
  query: `
  mutation CreateMessage(
    $threadId: String!
    $fromId: UUID!
    $body: String!
  ) {
    createMessage(
      input: { 
        message: { 
          body: $body, 
          fromId: $fromId, 
          threadId: $threadId
        }
      }
    ) {
      message {
        createdAt
        body
        fromId
        threadId
        id
      }
    }
  }
`,
};
