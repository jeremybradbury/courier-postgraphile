const open = require("open");

(async () => {
  // Specify app arguments.
  await open("http://localhost:5000/graphiql", {
    app: ["google chrome", "--incognito"],
  });
})();
