const concurrently = require("concurrently");

concurrently(["npm:start", "npm:tests"], {
  prefix: "test runner: ",
  killOthers: ["failure", "success"],
  restartTries: 0,
}).then(
  function onSuccess(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed successfully.
    process.exit(0);
  },
  function onFailure(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed because of a failure.
    process.exit(0);
  }
);
