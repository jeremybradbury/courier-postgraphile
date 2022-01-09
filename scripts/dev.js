const concurrently = require("concurrently");

concurrently(["npm:start", "npm:open"], {
  prefix: "dev: ",
  restartTries: 3,
}).then(
  function onSuccess(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed successfully.
    console.info("Thank you");
    //process.exit();
  },
  function onFailure(exitInfo) {
    // This code is necessary to make sure the parent terminates
    // when the application is closed because of a failure.
    console.error("Thank you");
    process.exit();
  }
);
