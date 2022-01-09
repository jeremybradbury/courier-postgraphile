const path = require("path");
const scriptName = path.basename(__filename);
const { query } = require("../" + scriptName);
const { testQuery, alsoLookupThenDeleteCb } = require("../../test_helpers");
const faker = require("faker");

const variables = {
  publicKey: faker.random.alphaNumeric(64),
};

// one test to create, lookup by id & delete
testQuery(query, scriptName, variables, alsoLookupThenDeleteCb);
