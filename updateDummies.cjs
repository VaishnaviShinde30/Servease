const fs = require('fs');
let code = fs.readFileSync('src/data/dummyShops.js', 'utf8');

const addresses = [
  'MG Road, Camp', 'JM Road, Shivajinagar', 'FC Road, Deccan', 'Koregaon Park', 
  'Viman Nagar', 'Kothrud', 'Baner', 'Hinjewadi', 'Wakad', 'Pimple Saudagar', 
  'Aundh', 'Kalyani Nagar', 'Magarpatta', 'Hadapsar', 'Swargate', 
  'Katraj', 'Bibwewadi', 'Sinhagad Road', 'Karve Nagar', 'Bavdhan'
];

code = code.replace(/(\{ id: '[0-9]+', .*?)( \})/g, (match, p1, p2) => {
  let newStr = p1;
  if (!newStr.includes('contact:')) {
    const randomPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);
    newStr += `, contact: '${randomPhone}'`;
  }
  if (!newStr.includes('address:')) {
    const randomAddr = addresses[Math.floor(Math.random() * addresses.length)] + ', Pune';
    newStr += `, address: '${randomAddr}'`;
  }
  return newStr + p2;
});

fs.writeFileSync('src/data/dummyShops.js', code);
console.log('dummyShops.js updated with contacts and addresses.');
