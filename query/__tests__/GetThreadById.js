const path = require("path");
const scriptName = path.basename(__filename);
const { query } = require("../" + scriptName);
const { testQuery } = require("../../test_helpers");
testQuery(query, scriptName, { id: "ABC123" });
