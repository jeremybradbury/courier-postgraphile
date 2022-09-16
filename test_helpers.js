const axios = require("axios").default;
const { GRAPHQL_ENDPOINT = "http://localhost:5000/graphql", DEBUG } =
  process.env;
const cap = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const uncap = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toLowerCase() + s.slice(1);
};
const postQuery = async (options) => {
  try {
    //console.log(options);
    const { data } = await axios.post(GRAPHQL_ENDPOINT, options);
    return data;
  } catch (err) {
    console.error(
      (err.response && err.response.data && err.response.data.errors[0]) || err
    );
  }
};

const alsoDeleteCb = async ({ name, data, label }) => {
  const q = uncap(name).split(".")[0];
  const t = uncap(name.split("Create")[1]).split(".")[0];
  const { query } = require("./mutation/" + name.replace("Create", "Delete"));
  const variables = {
    id: data[q][t].id,
  };
  ({ data } = await postQuery({
    query,
    variables,
  }));
  debugRequest({
    variables,
    data,
    name:
      "Mutation: " + cap(q) + " - " + label || name.replace("Create", "Delete"),
  });
  return data["delete" + cap(t)][`deleted${cap(t)}NodeId`];
};
const alsoLookupCb = async ({ name, data }) => {
  const q = uncap(name).split(".")[0];
  const t = uncap(name.split("Create")[1]).split(".")[0];
  const lookup = "Get" + cap(t) + "ById";
  const { query } = require("./query/" + lookup);
  const variables = {
    id: data[q][t].id,
  };
  ({ data } = await postQuery({
    query,
    variables,
  }));
  debugRequest({ variables, data, name: "Query: " + cap(q) + " - " + lookup });
  return data;
};
const alsoLookupThenDeleteCb = async ({ name, data }) => {
  expect(await alsoLookupCb({ name, data })).toBeTruthy();
  return await alsoDeleteCb({ name, data });
};
const testQuery = (query, name, variables = null, cb = null) => {
  describe("Query", () => {
    let label = query.includes("mutation") ? "Mutation" : "Query";
    label += ": " + name.split(".")[0];

    it(label, async () => {
      let data;
      let post = { query };
      if (variables)
        post.variables = variables = JSON.stringify(variables, null, 4);

      try {
        ({ data } = await postQuery(post));
        debugRequest({ variables, data, name: label });
        if (cb) {
          // run the callback, & check that instead of a snapshot
          const result = await cb({ name, data });
          expect(result).toBeTruthy();
        } else {
          // run query against the server & snapshot the output
          expect(data).toMatchSnapshot();
        }
      } catch (err) {
        console.error(
          (err.response && err.response.data && err.response.data.errors) || err
        );
        expect(err.message).toBeNull();
      }
      expect(data && data.errors).toBeFalsy();
    });
  });
};

const debugRequest = ({ variables = {}, name = "", data = {} }) => {
  if (DEBUG && DEBUG.trim() == "false") return; // silence is golden
  const q = uncap(name).split(".")[0];
  const t = uncap(q.split("list")[1]).split(".")[0];
  variables =
    (typeof variables === "string" && variables) ||
    JSON.stringify(variables, null, 4);

  /* this is much easier to read pretty printed */
  let output = cap(q) + ":\nreq " + variables;
  output += "\nres ";
  output +=
    (data[q] && JSON.stringify(data[q], null, 4)) ||
    (data[t] && JSON.stringify(data[t].edges, null, 4)) ||
    JSON.stringify(data, null, 4);
  output += "\n";
  process.stdout.write(output);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  postQuery,
  testQuery,
  alsoDeleteCb,
  alsoLookupCb,
  alsoLookupThenDeleteCb,
  cap,
  delay,
  uncap,
  debugRequest,
  GRAPHQL_ENDPOINT,
};
