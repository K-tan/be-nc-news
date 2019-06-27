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
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an("array");
          });
      });
      it("GET status 404 when trying to access a wrong endpoint", () => {
        return request
          .get("/api/topics/notvalid")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("page not found");
          });
      });
      it("POST status 405 when trying to POST, PUT, DELETE to endpoint which does not allow this", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/users", () => {
    it("GET response with 200 all users", () => {
      return request.get("/api/users").expect(200);
    });
    describe("/:username", () => {
      it("GET status 200 returns user obj of passed id", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys("username", "avatar_url", "name");
          });
      });
      it("GET status 404 when invalid username has been provided", () => {
        return request
          .get("/api/users/notvalid")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("page not found");
          });
      });
      // it("POST status 405 when trying to POST, PUT, DELETE to article_id endpoint", () => {
      //   const invalidMethods = ["post", "patch", "put", "delete"];
      //   const methodPromises = invalidMethods.map(method => {
      //     return request[method]("/api/articles/1")
      //       .expect(405)
      //       .then(({ body: { msg } }) => {
      //         expect(msg).to.equal("method not allowed");
      //       });
      //   });
      //   return Promise.all(methodPromises);
      // });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("GET status 200 returns article obj of passed id", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "votes",
              "created_at",
              "topic",
              "comment_count"
            );
          });
      });
      it("GET status 404 when invalid article_id has been provided", () => {
        return request
          .get("/api/articles/notvalid")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
    });
  });
  describe("PATCH", () => {
    it("increases the vote count by the inc_votes passed through and returns the updated article ", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(101);
        });
    });
    it("decreases the vote count by the inc_votes passed through and returns the updated article ", () => {
      const input = { inc_votes: -1 };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(99);
        });
    });
    // it("patch 400 error Bad Request if invalid key is given", () => {
    //   const input = {
    //     incvotes: 1
    //   };
    //   return request
    //     .patch("/api/articles/1")
    //     .send(input)
    //     .expect(400)
    //     .then(({ body: { msg } }) => {
    //       expect(msg).to.equal("Bad Request Invalid Data");
    //     });
    // });
  });
  describe("POST", () => {});
});
