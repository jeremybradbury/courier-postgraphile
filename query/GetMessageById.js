module.exports = {
  query: `
  query GetMessageById($id: UUID!) {
    message(id: $id) {
      id
      body
      fromId
      threadId
    }
  }
`,
};
