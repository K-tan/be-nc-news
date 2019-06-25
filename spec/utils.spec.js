const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
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
  it("does not mutate the original javascript object ", () => {
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
    const actual = formatDate(list);
    expect(actual).to.not.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns one object in which the reference is keyed by the items title", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("returns multiple instances in which the object reference is keyed by the items title", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2, C: 3 };
    expect(actual).to.eql(expected);
  });
});

describe.only("formatComments", () => {
  it("returns a new empty array", () => {
    const data = [];
    const actual = formatComments(data);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("returns a new array with a new reference object", () => {
    const comment = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    const actual = formatComments(comment);
    const expected = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    expect(actual).not.to.equal(expected);
  });
  it('its "created_by" property is renamed to an "author" key ', () => {
    const comment = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    const actual = formatComments(comment);
    const expected = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        author: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    expect(actual).to.eql(expected);
  });
});
