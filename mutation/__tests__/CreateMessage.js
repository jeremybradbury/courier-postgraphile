const path = require("path");
const scriptName = path.basename(__filename);
const {
  alsoDeleteCb,
  postQuery,
  uncap,
  debugRequest,
  DEBUG,
  delay,
} = require("../../test_helpers");
const faker = require("@jeremybradbury/faker");
const CreateSession = require("../CreateSession");
const JoinThread = require("../JoinThread");
const CreateThread = require("../CreateThread");
const GetSessionById = require("../../query/GetSessionById");
const GetThreadById = require("../../query/GetThreadById");
const CreateMessage = require("../CreateMessage");
const GetMessageById = require("../../query/GetMessageById");

describe("Query", () => {
  it("Create Message", async () => {
    if (!DEBUG || DEBUG.trim() == "true") {
      // run this with a delay for cleaner logging
      await delay(250);
    }
    // 1 mock owner
    const ownerKey = faker.random.alphaNumeric(64);
    let variables = {
      publicKey: ownerKey,
    };
    let label;
    let query = CreateSession.query;
    await delay(250); // pause to let CreateSession test complete
    let { data, errors } = await postQuery({ query, variables });
    if (errors) console.error(errors);
    errors = null;
    let owner = data.createSession.session;
    // test owner
    expect(owner).toBeTruthy(); // created?
    let title = scriptName.split(".")[0];
    label = "Mutation: " + title + " 1 - CreateSession - Owner";
    debugRequest({ name: label, variables, data });

    // 2 mock thread
    variables = { sessionId: owner.id };
    query = CreateThread.query;
    ({ data, errors } = await postQuery({ query, variables })); // create
    const createThreadData = data;
    console.log(data);
    if (errors) console.error(errors);
    errors = null;
    const thread = data.createThread.thread;
    // test thread
    expect(thread).toBeTruthy(); // created?
    expect(thread.owner.id).toEqual(owner.id); // owned?
    label = "Mutation: " + title + " 2 - CreateThread - Owner";
    debugRequest({ name: label, variables, data });

    // 3 owner joins thread
    variables = { sessionId: owner.id, threadId: thread.id };
    query = JoinThread.query;
    ({ data, errors } = await postQuery({ query, variables })); // create
    if (errors) console.error(errors);
    owner = data.updateSession.session;

    // test owner session update
    expect(owner).toBeTruthy(); // created?
    expect(owner.thread.id).toEqual(thread.id); // joined?

    label = "Mutation: " + title + " 3 - JoinThread - Guest";
    debugRequest({ name: label, variables, data });

    // 4 mock guest & join thread
    const guestKey = faker.random.alphaNumeric(64);
    variables = {
      publicKey: guestKey,
      threadId: thread.id,
    };
    query = CreateSession.query;
    ({ data, errors } = await postQuery({ query, variables }));
    if (errors) console.error(errors);
    errors = null;
    const guest = data.createSession.session;
    // test create session & join thread
    expect(guest).toBeTruthy(); // created?
    expect(guest.thread.id).toEqual(thread.id); // joined?

    label = "Mutation: " + title + " 4 - CreateSession - Guest";
    debugRequest({ name: label, variables, data });

    // 5 send message
    variables = {
      threadId: thread.id,
      fromId: owner.id,
      body: faker.hacker.phrase(),
    };
    query = CreateMessage.query;
    ({ data, errors } = await postQuery({ query, variables })); // create
    if (errors) console.error(errors);
    errors = null;
    const message = data.createMessage.message;
    expect(message.id).toBeTruthy(); // created?
    expect(message.fromId).toEqual(owner.id); // owned?
    expect(message.threadId).toEqual(owner.thread.id); // joined?

    label = "Mutation: " + title + " 5 - CreateMessage - Owner";
    debugRequest({ name: label, variables, data });

    // 6 lookup message
    variables = { id: message.id };
    query = GetMessageById.query;
    ({ data, errors } = await postQuery({ query, variables })); // Create
    if (errors) console.error(errors);

    const message2 = data.message;
    // test both messages
    expect(message.id).toBeTruthy(); // created?
    expect(message.createdAt).toBeTruthy(); // created?
    expect(message.fromId).toEqual(owner.id); // from owner?
    expect(message.body).toEqual(message2.body); // same?
    expect(message.fromId).toEqual(message2.fromId); // same?
    expect(message.threadId).toEqual(message2.threadId); // same?

    label = "Query: " + title + " 6 - GetMessageById";
    debugRequest({ name: label, variables, data });

    // 7 wipe thread
    const threadDeleted = await alsoDeleteCb({
      name: "CreateThread",
      label: "CreateMessage",
      data: createThreadData,
    }); // do lookup & expect(), before deleting
    // test deleted
    expect(threadDeleted).toBeTruthy(); // deleted?
    // wipe owner - cascade handles this
    // wipe guest - cascade handles this
    // wipe messages - cascade handles this
  });
});
