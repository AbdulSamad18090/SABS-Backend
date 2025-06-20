const { Model } = require("objection");
const db = require("../db/index");

Model.knex(db);

class Chat extends Model {
  static get tableName() {
    return "chats";
  }

  static get relationMappings() {
    const User = require("./User");

    return {
      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "chats.sender_id",
          to: "users.id",
        },
      },
      receiver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "chats.receiver_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Chat;
