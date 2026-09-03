import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const excelFile = 'c:\\Users\\ronty\\Downloads\\archive\\Indian Coal Mines Dataset_January 2021-1.xlsx';
const outputFile = 'src/data/realMinesData.json';

console.log('Reading Excel file...');

try {
  const wb = XLSX.readFile(excelFile);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);

  console.log(`Loaded ${data.length} records`);

  function getMineType(typeStr) {
    if (!typeStr) return 'OPENCAST';
    const str = String(typeStr).toUpperCase();
    if (str.includes('UG')) return 'UNDERGROUND';
    if (str.includes('MIXED')) return 'MIXED';
    return 'OPENCAST';
  }

  function getSubsidiary(ownerName) {
    if (!ownerName) return 'CIL_HQ';
    const str = String(ownerName).toUpperCase();
    if (str.includes('ECL') || str.includes('EASTERN')) return 'ECL';
    if (str.includes('BCCL') || str.includes('BHARAT')) return 'BCCL';
    if (str.includes('CCL') || str.includes('CENTRAL')) return 'CCL';
    if (str.includes('WCL') || str.includes('WESTERN')) return 'WCL';
    if (str.includes('SECL') || str.includes('SOUTH')) return 'SECL';
    if (str.includes('MCL') || str.includes('MAHANADI')) return 'MCL';
    if (str.includes('NCL') || str.includes('NORTH')) return 'NCL';
    return 'CIL_HQ';
  }

  function safeFloat(val, defaultVal = 0) {
    if (!val) return defaultVal;
    const f = parseFloat(val);
    return isNaN(f) ? defaultVal : f;
  }

  const mines = [];
  const stateCount = {};

  data.forEach((row, idx) => {
    const state = String(row['State/UT Name'] || 'Unknown').trim();
    const mineName = String(row['Mine Name'] || '').trim();

    if (!mineName) return;

    stateCount[state] = (stateCount[state] || 0) + 1;

    const production = safeFloat(row['Coal/ Lignite Production (MT) (2019-2020)'], 0);

    const mine = {
      id: `real-mine-${String(idx + 1).padStart(4, '0')}`,
      name: mineName,
      code: String(row['SL No.'] || idx + 1),
      subsidiary: getSubsidiary(row['Coal Mine Owner Name']),
      state: state,
      district: String(row['District Name'] || 'Unknown').trim(),
      type: getMineType(row['Type of Mine (OC/UG/Mixed)']),
      coordinates: {
        lat: safeFloat(row['Latitude '], 0),
        lng: safeFloat(row['Longitude '], 0)
      },
      productionCapacityMTPA: production * 1.2,
      currentProductionMT: production,
      coalType: String(row['Coal/Lignite'] || 'Coal').trim(),
      ownership: String(row['Govt Owned/Private'] || 'Unknown').trim(),
      source: 'Indian Coal Mines Dataset - January 2021',
      accuracy: String(row['Accuracy (exact vs approximate)'] || 'Approximate').trim()
    };

    mines.push(mine);
  });

  const output = {
    metadata: {
      source: 'Indian Coal Mines Dataset - January 2021',
      totalMines: mines.length,
      minesByState: stateCount,
      dataCollectionDate: 'January 2021',
      lastUpdated: new Date().toISOString()
    },
    mines: mines
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

  console.log(`✓ Saved ${mines.length} mines to ${outputFile}`);
  console.log(`✓ States represented: ${Object.keys(stateCount).length}`);
  console.log(`✓ State distribution:`, stateCount);
  console.log('\nSample mines:');
  mines.slice(0, 3).forEach(m => {
    console.log(`  - ${m.name} (${m.state}, ${m.district})`);
  });

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
