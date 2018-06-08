'use strict';
function addressToZipcode() {
  const fs = require('fs');
  const readline = require('readline');
  const rs = fs.ReadStream('./x-ken-all2.csv');
  const rl = readline.createInterface({ 'input': rs, 'output': {} });
  rl.on('line', (lineString) => {
    //console.log(lineString);
    const columns = lineString.split(',');
    const zipcode = columns[2];
    const address = columns[6].replace(/\"/g,'') + columns[7] + columns[8];
    
    console.log(zipcode);    
    console.log(address);
    

  });
  rl.resume();
}

addressToZipcode();