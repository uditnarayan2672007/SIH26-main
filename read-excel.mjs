import XLSX from 'xlsx';

const path = 'c:\\Users\\ronty\\Downloads\\archive\\Indian Coal Mines Dataset_January 2021-1.xlsx';

try {
  const wb = XLSX.readFile(path);
  const sheetNames = wb.SheetNames;
  console.log('Sheet names:', sheetNames);
  
  const ws = wb.Sheets[sheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);
  
  console.log('\nDataset shape:', data.length, 'rows');
  if (data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
    console.log('\nFirst 10 rows:');
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
  }
} catch (error) {
  console.error('Error reading file:', error.message);
}
