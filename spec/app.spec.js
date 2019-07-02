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
    it("GET status 404 when invalid article_id has been provided", () => {
      return request
        .get("/api/articles/notvalid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Page not found");
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
    xit("patch 400 error Bad Request if invalid key is provided", () => {
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
    //CREATE TESTS TO BREAK THE ABOVE FOR ERROR HANDLINGS
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
    it("recieve error bad request invalid data when we post invalid comment", () => {
      const input = {};
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request Invalid Data");
        });
    });
    it("recieve error bad request when we post valid comment with invalid values", () => {
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
    xit("author, which filters the articles by the username value specified in the query", () => {});
    xit("topic, which filters the articles by the topic value specified in the query", () => {});
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
  });
  describe("DELETE, /api/comments/:comment_id", () => {
    it("delete the given comment by comment_id, status 204 and no content", () => {
      return request.delete("/api/comments/1").expect(204);
    });
  });
});
