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
  const formattedCommentsArr = comments.map(ele => {
    const newObj = { ...ele, created_by: articleRef[ele.author] };
    console.log(newObj);
    return newObj;
  });

  return formattedCommentsArr;
}; //call function inside function
