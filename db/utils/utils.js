//formatted date below so that it will return a non millisecond date/time
exports.formatDate = list => {
  const formattedDateArr = list.map(ele => {
    const newObj = { ...ele };
    let date = new Date(newObj.created_at);
    newObj.created_at = date;

    return newObj;
  });
  return formattedDateArr;
};

//created function to enable reference object to be keyed by each item's title
exports.makeRefObj = list => {
  return list.reduce((acc, obj) => {
    acc[obj.title] = obj.article_id;
    return acc;
  }, {});
};

//
exports.formatComments = (comments, articleRef) => {
  return (formattedCommentsArr = comments.map(ele => {
    const newObj = { ...ele };
    newObj["author"] = ele["created_by"];
    delete newObj["created_by"];
    newObj["article_id"] = articleRef[ele.belongs_to];
    delete newObj["belongs_to"];
    let date = new Date(newObj.created_at);
    newObj.created_at = date;

    return newObj;
  }));
}; //call function inside function

// This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.

// Each formatted comment must have:

// - Its `created_by` property renamed to an `author` key
// - Its `belongs_to` property renamed to an `article_id` key
// - The value of the new `article_id` key must be the id corresponding to the original title value provided
// - Its `created_at` value converted into a javascript date object
// - The rest of the comment's properties must be maintained
