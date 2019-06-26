process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const knex = require("../connection");
chai.use(require("chai-sorted"));

describe("/", () => {
  beforeEach(() => {
    return knex.seed.run();
  });
  after(() => {
    knex.destroy();
  });
  describe("/topics", () => {
    describe("default-behaviour", () => {
      it("GET response with 200", () => {
        return request.get("/api/topics").expect(200);
      });
      it("GET response with an array of topics", () => {
        return request.get("api/topics");
      });
    });
  });
});
