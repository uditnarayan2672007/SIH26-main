# Coal Mines Dataset Integration Guide

## Overview

The Indian Coal Mines Dataset (January 2021) has been successfully integrated into the SIH26 project. This dataset contains information about **459 coal and lignite mines** across **12 Indian states**.

## Dataset Contents

### Metadata
- **Total Mines**: 459
- **States Covered**: 12
- **Data Collection Date**: January 2021
- **Primary Fields**: Name, State, District, Production, Type, Coordinates, Ownership

### States Represented
1. **Jharkhand** - 114 mines (25%)
2. **Telangana** - 57 mines (12%)
3. **Maharashtra** - 54 mines (12%)
4. **Madhya Pradesh** - 56 mines (12%)
5. **West Bengal** - 70 mines (15%)
6. **Chhattisgarh** - 52 mines (11%)
7. **Orissa** - 29 mines (6%)
8. **Gujarat** - 9 mines (2%)
9. **Rajasthan** - 7 mines (2%)
10. **Uttar Pradesh** - 5 mines (1%)
11. **Assam** - 3 mines (1%)
12. **Tamil Nadu** - 3 mines (1%)

## File Structure

```
src/
├── data/
│   ├── mockData.ts                 # Updated with REAL_MINES from JSON
│   └── realMinesData.json          # Raw dataset (459 mines)
├── lib/
│   └── mineFilters.ts              # Filtering & sorting utilities
└── components/
    └── StateWiseFilter.tsx         # State-wise filter component
```

## Usage

### 1. Using the Real Mines Data in Components

```typescript
import { MOCK_MINES } from '../data/mockData';

// MOCK_MINES now contains 459 real coal mines
console.log(MOCK_MINES.length); // 459
console.log(MOCK_MINES[0].state); // State information
```

### 2. Import Filtering Functions

```typescript
import {
  getMinesByState,
  getUniqueStates,
  getMinesCountByState,
  getProductionByState,
  filterMines,
  sortMinesByProduction,
  getStateStatistics
} from '../lib/mineFilters';

// Get unique states
const states = getUniqueStates(MOCK_MINES);

// Filter by state
const jharkhardMines = getMinesByState(MOCK_MINES, 'Jharkhand');

// Get statistics
const stats = getStateStatistics(MOCK_MINES);
```

### 3. Use the State-Wise Filter Component

```typescript
import { StateWiseFilter } from './components/StateWiseFilter';
import { MOCK_MINES } from './data/mockData';

function App() {
  const [filteredMines, setFilteredMines] = useState(MOCK_MINES);
  const [selectedState, setSelectedState] = useState(null);

  return (
    <StateWiseFilter
      mines={MOCK_MINES}
      onStateSelect={setSelectedState}
      onMinesFiltered={setFilteredMines}
    />
  );
}
```

## Component Features

### StateWiseFilter Component

The `StateWiseFilter` component provides three different views:

#### 1. **Chart View**
- Bar chart showing mines count by state
- Bar chart showing total production by state
- Interactive charts (click to filter)

#### 2. **List View**
- Grid layout of states as clickable cards
- Shows mines count and production for each state
- Easy-to-click interface

#### 3. **Table View**
- Comprehensive table with all states
- Columns: State, Number of Mines, Total Production, Average Production/Mine
- Action buttons to filter by state

### Features
- ✅ State-wise filtering
- ✅ Production analytics
- ✅ Mine distribution visualization
- ✅ Callback functions for integration with parent components
- ✅ Responsive design
- ✅ Multiple view options (Chart, List, Table)

## Available Filter Functions

### `getMinesByState(mines, state)`
Filter mines by a specific state.

```typescript
const bengalMines = getMinesByState(MOCK_MINES, 'West Bengal');
```

### `getUniqueStates(mines)`
Get all unique states from the mines dataset.

```typescript
const allStates = getUniqueStates(MOCK_MINES);
// Returns: ['Assam', 'Chhattisgarh', 'Gujarat', ...]
```

### `getMinesCountByState(mines)`
Get count of mines for each state.

```typescript
const counts = getMinesCountByState(MOCK_MINES);
// Returns: { 'Jharkhand': 114, 'West Bengal': 70, ... }
```

### `getProductionByState(mines)`
Get total production by state.

```typescript
const production = getProductionByState(MOCK_MINES);
// Returns: { 'Jharkhand': 245.3, 'West Bengal': 125.8, ... }
```

### `filterMines(mines, options)`
Advanced filtering with multiple criteria.

```typescript
const filtered = filterMines(MOCK_MINES, {
  state: 'Jharkhand',
  mineType: 'OPENCAST',
  minProductionMT: 5
});
```

### `sortMinesByProduction(mines, order)`
Sort mines by production.

```typescript
const sorted = sortMinesByProduction(MOCK_MINES, 'desc');
```

### `getStateStatistics(mines)`
Get comprehensive statistics for all states.

```typescript
const stats = getStateStatistics(MOCK_MINES);
// Returns: Array of { state, totalMines, totalProduction, averageProduction, mineTypes }
```

## Data Enhancement

The original dataset has been enriched with:
- Synthetic compliance scores (75-95)
- Safety ratings (A+, A, B, C)
- Workforce estimates based on mine size
- DGMS zones
- Project officer names

This ensures backward compatibility with existing components that expect these fields.

## Jupyter Notebook Analysis

A Jupyter notebook (`Coal_Mines_Dataset_Analysis.ipynb`) is available for:
- Exploratory Data Analysis (EDA)
- State-wise analysis
- Production analysis
- Mine type distribution
- Geographic analysis
- Top producers identification
- Summary statistics

### Running the Notebook

```bash
jupyter notebook Coal_Mines_Dataset_Analysis.ipynb
```

## Integration Steps Completed

✅ **Step 1**: Converted Excel file to JSON format
✅ **Step 2**: Created `realMinesData.json` with 459 mines
✅ **Step 3**: Updated `mockData.ts` to load real data
✅ **Step 4**: Created `mineFilters.ts` utility library
✅ **Step 5**: Built `StateWiseFilter.tsx` component
✅ **Step 6**: Created Jupyter notebook for analysis

## Next Steps (Optional)

1. **Add to App.tsx**
   - Import StateWiseFilter component
   - Display in relevant dashboard section

2. **Integrate with GIS Map**
   - Use coordinates to plot mines on map
   - Implement interactive map filtering

3. **Enhanced Filtering**
   - Add more filter criteria (mine type, subsidiary, etc.)
   - Implement search functionality

4. **Data Updates**
   - Set up periodic dataset refresh
   - Add version tracking

5. **Performance Optimization**
   - Implement data pagination for large datasets
   - Add caching mechanisms

## Data Source

- **Dataset**: Indian Coal Mines Dataset - January 2021
- **Records**: 459 mines
- **Coverage**: 12 states across India
- **Last Updated**: August 30, 2026

## Notes

- Production data is for 2019-2020 fiscal year
- Geographic coordinates are available for most mines
- Ownership split: Government (G) vs Private (P)
- Mine types: OPENCAST (OC), UNDERGROUND (UG), MIXED

## Support

For questions or issues:
1. Check the Jupyter notebook for data analysis examples
2. Review mineFilters.ts for available functions
3. Examine StateWiseFilter.tsx component for implementation details
