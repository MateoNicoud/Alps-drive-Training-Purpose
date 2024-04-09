// const date = new Date();
// let day;
// if(date.getDate()<10){day='0'+date.getDate()}else{day=date.getDate()}
// let month;
// if((date.getMonth()+1)<10){month='0'+(date.getMonth()+1)}else{month=date.getMonth()+1}
// const year =date.getFullYear();
//
// const frenchFormatDate = "Nous sommes le "+day+"/"+month+"/"+year;
//
// console.log(frenchFormatDate);

const date = new Date();
const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
const year = date.getFullYear();

const frenchFormatDate = "Nous sommes le " + day + "/" + month + "/" + year;

console.log(frenchFormatDate);
