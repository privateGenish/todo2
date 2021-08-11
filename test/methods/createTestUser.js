const { DocumentClient } = require("aws-sdk/clients/dynamodb");
const cred = require("../../config/aws-credentials");
const client = new DocumentClient(cred);
const table = process.env.TABLE;

async function createTestUser(uid) {
  const response = await client
    .put({
      TableName: table,
      Item: {
        PK: "USER#" + uid,
        Lists: {
          public: ["LIST#<LID1>", "LIST#<LID2>"],
          private: ["LIST#<LID3>"],
        },
        About: "@the.real.genish",
        LikedLists: ["LIST#<LID3>"],
        Name: "TRG",
      },
    })
    .promise();
  return response;
}

async function deleteTestUser(uid) {
  await client.delete({ TableName: table, Key: { PK: "UID#" + uid } }).promise();
}
module.exports = { createTestUser, deleteTestUser };
