module.exports = {
  query: `
  query GetThreadById($id: String!) {
    thread(id: $id) {
      id
      owner {
        id
        publicKey
      }
    }
  }  
`,
};
