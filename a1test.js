// Read in data from stdin.
// process.stdin.resume();
// process.stdin.setEncoding('ascii');
// var input = '';
// process.stdin.on('data', function(chunk) {
//   input += chunk;
// });

const input = JSON.stringify([
  { id: 1, name: 'San Francisco Bay Area', parent_id: null },
  { id: 2, name: 'San Jose', parent_id: 3 },
  { id: 3, name: 'South Bay', parent_id: 1 },
  { id: 4, name: 'San Francisco', parent_id: 1 },
  { id: 5, name: 'Manhattan', parent_id: 6 },
  { id: 6, name: 'New York', parent_id: null }
]);

// ```New York
//   - Manhattan
// San Francisco Bay Area
//   - San Francisco
//   - South Bay
//   -- San Jose
// ```

// Print to stdout.
// process.stdin.on('end', function() {
// });

const data = JSON.parse(input);

const dataObj = data.reduce((res, city) => {
  res[city.id] = {
    name: city.name,
    parent_id: city.parent_id
  };
  return res;
}, {});

dataObj;

Object.keys(dataObj).forEach(id => {});

// const parseChildren = arr => {
//   const resArr = [];
//   while (arr.length) {
//     arr.forEach((city, index) => {
//       if (!city.parent_id) {
//         resArr.push(city.name);
//         data.splice(index, 1);
//       }
//       if (res.includes(data[city.parent_id].name)) {
//         res.splice(res.indexOf(data[city.parent_id].name)+ 1, 0, []);
//       }
//     });
//   }
// };

// const getLevel = id => {
//   let level = 0
//   if
// }

data.reduce((res, city) => {
  if (!city.parent_id) {
    res[city.id] = {
      name: city.name,
      level: 0
    };
  } else {
  }
  return res;
}, {});
// var locations = JSON.parse(input);
// console.log(locations);
