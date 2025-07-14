
const x =[1,2,3,4];

const res = x.reduce((acc, curr) => {

   if(curr % 2 == 0) acc = acc + curr;

    return acc
}, 0)

console.log(res)