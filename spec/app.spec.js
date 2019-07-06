process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const knex = require("../connection");
chai.use(require("chai-sorted"));
const endpoints = require("../endpoints.json");

describe("/", () => {
  beforeEach(() => {
    return knex.seed.run();
  });
  after(() => {
    knex.destroy();
  });
  describe("/, GET all endpoints", () => {
    it("JSON describing all the available endpoints on the API", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql(endpoints);
        });
    });
    it("Status 405 - delete `/api`", () => {
      return request.delete("/api").expect(405);
    });
  });
  describe("/topics", () => {
    describe("default-behaviour", () => {
      it("GET status 200", () => {
        return request.get("/api/topics").expect(200);
      });
      it("GET status 200 response with an array of topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an("array");
          });
      });
      it("*ERROR* status 404 when trying to access a wrong endpoint", () => {
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

    it("GET status 200 returns user obj of passed id", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          console.log(user);
          expect(user).to.contain.keys("username", "avatar_url", "name");
        });
    });
    it("*ERROR* GET status 404 when invalid username has been provided", () => {
      return request
        .get("/api/users/notvalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("page not found");
        });
    });
  });
  describe("/articles/:article_id", () => {
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
    it("*ERROR* GET status 404 when invalid article_id has been provided", () => {
      return request
        .get("/api/articles/notvalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
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
    it("ignore a `patch` request with no information in the request body, and send the unchanged article to the client provide a default argument of 0 to the increment method, otherwise it will automatically increment by 1 ", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: 0 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(100);
        });
    });
    it("*ERROR* PATCH 400 error Bad Request Invalid Data if invalid key is provided", () => {
      const input = {
        in_votes: 1
      };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request Invalid Data");
        });
    });
  });
  describe("POST", () => {
    it("posts a comment with properties username and body, responds with the posted comment ", () => {
      const input = {
        username: "butter_bridge",
        body: "This is a test comment"
      };
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.author).to.eql("butter_bridge");
          expect(comment.body).to.eql("This is a test comment");
        });
    });
    it("*ERROR* POST 400 recieve error Bad Request Invalid Data invalid data when we post invalid comment", () => {
      const input = {};
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
        });
    });
    it("*ERROR* POST 400 recieve error Bad Request Invalid Data when we post valid comment with invalid values", () => {
      const input = {
        username: 1,
        body: 1
      };
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
        });
    });
    it("*ERROR* POST 400 recieve error Bad Request Invalid Data when we trying to add add to a comment with valid article_id that is not there", () => {
      const input = {};
      return request
        .post("/api/articles/10000/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
        });
    });
    it("*ERROR* POST 400 recieve error Bad Request Invalid Data when trying to add to a comment with a bad article_id", () => {
      const input = {};
      return request
        .post("/api/articles/not-valid-path/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
        });
    });
    //CREATE TESTS TO BREAK THE ABOVE FOR ERROR HANDLING
  });
  describe("GET comments for given article_id", () => {
    it("returns an array of comments for given article_id, with correct properties", () => {
      return request
        .get("/api/articles/1/comments")
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an("array");
        });
    });
  });
  describe("Querys", () => {
    it("GET sorts by is defaulted by valid column", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET comments by article_id sorts by valid column", () => {
      return request
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET comments by article_id sorts by valid column and ascending order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=comment_id&&order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("comment_id", {
            descending: false
          });
        });
    });
    it("GET comments by article_id sorts by valid column and ascending order", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("author", {
            descending: false
          });
        });
    });
    it("GET returns 400 for an invalid sort_by query", () => {
      return request.get("/api/articles?sort_by=invalid").expect(400);
    });
  });
  describe("/api/articles", () => {
    it("GET returns array of article objects with properties", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
        });
    });
    it("GET returns array of article objects with correct keys", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "votes",
            "created_at",
            "topic",
            "comment_count"
          );
        });
    });
  });
  describe("Querys, /api/articles", () => {
    it("GET sorts by is defaulted by created_at", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET sorts by title and ascending order", () => {
      return request
        .get("/api/articles?sort_by=title&&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.sortedBy("title", {
            descending: false
          });
        });
    });
    it("status : 200, author, which filters the articles by the username value specified in the query", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].author).to.eql("butter_bridge");
          expect(articles[1].author).to.eql("butter_bridge");
        });
    });
    it("status: 200, topic, which filters the articles by the topic value specified in the query", () => {
      return request
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].topic).to.eql("mitch");
          expect(articles[1].topic).to.eql("mitch");
        });
    });
    it("*ERROR* 400 for an invalid sort_by query", () => {
      return request.get("/api/articles?sort_by=address").expect(400);
    });
  });
  describe("PATCH, /api/comments/:comment_id", () => {
    it("increases the vote count by the inc_votes passed through and returns the updated comment", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/comments/1")
        .send(input)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(17);
        });
    });
    it("decreases the vote count by the inc_votes passed through and returns the updated comment", () => {
      const input = { inc_votes: -1 };
      return request
        .patch("/api/comments/1")
        .send(input)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(15);
        });
    });
    it("*ERROR* PATCH 400 Error Bad Request Invalid Data, if invalid key is provided to update vote", () => {
      const input = {
        in_votes: 1
      };
      return request
        .patch("/api/comments/1")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request Invalid Data");
        });
    });
  });
  describe("DELETE, /api/comments/:comment_id", () => {
    it("delete the given comment by comment_id, status 204 and no content", () => {
      return request.delete("/api/comments/1").expect(204);
    });
    it("*ERROR* DELETE 400 a comment that doesn't exist", () => {
      return request
        .delete("/api/comments/invalidData")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request Invalid Data");
        });
    });
  });
});
