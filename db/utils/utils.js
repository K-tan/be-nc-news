//formatted date below so that it will return a non millisecond date/time
exports.formatDate = list => {
  let formattedDateArr = list.map(ele => {
    let date = new Date(ele.created_at);
    ele.created_at = date;
    return ele;
  });
  console.log(formattedDateArr);
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
exports.formatComments = (comments, articleRef) => {}; //call function inside function
