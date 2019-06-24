const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe.only("formatDate", () => {
  it("returns a new array of objects", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDate(list);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(actual).not.to.equal(expected);
  });
  it("converts the created_at value to a javascript date object", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    actual = formatDate(list);
    expect(actual[0].created_at).to.be.an.instanceOf(Date);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
