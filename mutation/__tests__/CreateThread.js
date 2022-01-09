const path = require("path");
const scriptName = path.basename(__filename);
const {
  alsoDeleteCb,
  postQuery,
  uncap,
  debugRequest,
  DEBUG,
} = require("../../test_helpers");
const faker = require("faker");
const CreateSession = require("../CreateSession");
const JoinThread = require("../JoinThread");
const CreateThread = require("../CreateThread");
const GetSessionById = require("../../query/GetSessionById");
const GetThreadById = require("../../query/GetThreadById");

describe("Query", () => {
  it("Create Thread", async () => {
    if (!DEBUG || DEBUG.trim() == "true") {
      // run this with a delay for cleaner logging
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    // mock owner
    let variables = {
      publicKey: faker.random.alphaNumeric(64),
    };
    let label;
    let query = CreateSession.query;
    let { data, errors } = await postQuery({ query, variables });
    if (errors) return console.error(errors);
    errors = null;
    let owner = data.createSession.session;
    // test owner
    expect(owner).toBeTruthy(); // created?
    let title = scriptName.split(".")[0];
    label = "Mutation: " + title + " 1 - CreateSession - Owner";
    debugRequest({ name: label, variables, data });

    // mock thread
    variables = { sessionId: owner.id };
    query = CreateThread.query;
    ({ data, errors } = await postQuery({ query, variables })); // create
    const createThreadData = data;
    if (errors) return console.error(errors);
    errors = null;
    const thread = data.createThread.thread;
    // test thread
    expect(thread).toBeTruthy(); // created?
    expect(thread.owner.id).toEqual(owner.id); // owned?
    label = "Mutation: " + title + " 2 - CreateThread - Owner";
    debugRequest({ name: label, variables, data });

    // join owned thread
    variables = { sessionId: owner.id, threadId: thread.id };
    query = JoinThread.query;
    ({ data, errors } = await postQuery({ query, variables })); // create
    if (errors) return console.error(errors);
    errors = null;
    owner = data.updateSession.session;

    // test owner session update
    expect(owner).toBeTruthy(); // created?
    expect(owner.thread.id).toEqual(thread.id); // joined?

    label = "Mutation: " + title + " 3 - JoinThread - Guest";
    debugRequest({ name: label, variables, data });

    // mock guest & join thread
    variables = {
      publicKey: faker.random.alphaNumeric(64),
      threadId: thread.id,
    };
    query = CreateSession.query;
    ({ data, errors } = await postQuery({ query, variables }));
    if (errors) return console.error(errors);
    errors = null;
    const guest = data.createSession.session;
    // test create session & join thread
    expect(guest).toBeTruthy(); // created?
    expect(guest.thread.id).toEqual(thread.id); // joined?

    label = "Mutation: " + title + " 4 - CreateSession - Guest";
    debugRequest({ name: label, variables, data });

    // lookup thread
    variables = { id: thread.id };
    query = GetThreadById.query;
    ({ data, errors } = await postQuery({ query, variables })); // Create
    if (errors) return console.error(errors);
    errors = null;

    const thread2 = data.thread;
    // test both threads
    expect(thread2).toBeTruthy(); // created?
    expect(thread2).toEqual(thread); // matching?
    expect(thread2.owner.id).toEqual(owner.id); // owned?

    label = "Query: " + title + " 5 - GetThreadById";
    debugRequest({ name: label, variables, data });

    // lookup owner
    variables = { id: owner.id };
    query = GetSessionById.query;
    ({ data, errors } = await postQuery({ query, variables })); // Create
    if (errors) return console.error(errors);
    errors = null;
    const owner2 = data.session;
    // test both owners
    expect(owner2).toBeTruthy(); // created?
    expect(owner2.thread.id).toEqual(owner.thread.id); // same?
    expect(owner2.id).toEqual(owner.id); // same?
    expect(owner2.id).toEqual(thread.owner.id); // owned?

    label = "Query: " + title + " 6 - GetSessionById - Owner";
    debugRequest({ name: label, variables, data });

    // lookup guest
    variables = { id: guest.id };
    query = GetSessionById.query;
    ({ data, errors } = await postQuery({ query, variables })); // Create
    if (errors) return console.error(errors);

    const guest2 = data.session;
    // test both guests
    expect(guest2).toBeTruthy(); // created?
    expect(guest2.thread.id).toEqual(guest.thread.id); // same?
    expect(guest2.thread.owner.id).toEqual(owner.id); // same?
    expect(guest2.id).toEqual(guest.id); // same?

    label = "Query: " + title + " 7 - GetSessionById - Guest";
    debugRequest({ name: label, variables, data });

    // wipe thread
    const threadDeleted = await alsoDeleteCb({
      name: scriptName,
      data: createThreadData,
    }); // do lookup & expect(), before deleting
    // test deleted
    expect(threadDeleted).toBeTruthy(); // deleted?

    // wipe owner - cascade handles this
    // wipe guest - cascade handles this
  });
});
