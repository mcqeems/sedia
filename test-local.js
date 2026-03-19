const fs = require('fs');

const p = JSON.parse(fs.readFileSync('./src/data/provinsi.json', 'utf8'));

function testFind() {
  const testProvinsi = "Daerah Khusus Ibukota Jakarta";
  
  const getProvinsiIncludes = p.find(({ name }) => 
    name.toLowerCase().includes(testProvinsi.toLowerCase()) ||
    testProvinsi.toLowerCase().includes(name.toLowerCase())
  );
  console.log('Provinsi matched via includes?', getProvinsiIncludes);
}

testFind();
