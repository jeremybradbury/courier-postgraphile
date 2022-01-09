const concurrently = require("concurrently");
const fs = require("fs");

const buildReadOnly = () => {
  const schema = fs.readFileSync("schema.graphql", "utf8");
  let readOnlySchema = schema.replace(/type Mutation {(.+?)}/s, "");
  const comment = `

"""
The root mutation type which contains root level fields which mutate data.
"""
`;
  readOnlySchema = readOnlySchema.replace(comment, "");
  //console.log({ readOnlySchema });
  fs.writeFileSync("readonly.graphql", readOnlySchema);
};

concurrently(
  ["npx postgraphile -w --export-schema-graphql=schema.graphql", "npm:tests"],
  {
    prefix: "build: ",
    killOthers: ["failure", "success"],
    restartTries: 0,
  }
).then(
  function onSuccess(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed successfully.
    process.exit();
  },
  function onFailure(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed because of a failure.
    buildReadOnly();
    process.exit();
  }
);
