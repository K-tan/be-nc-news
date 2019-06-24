exports.formatDate = list => {
  let formattedArr = list.map(ele => {
    let date = new Date(ele.created_at);
    ele.created_at = date;
    return ele;
  });
  console.log(formattedArr);
  return formattedArr;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {}; //call function inside function
