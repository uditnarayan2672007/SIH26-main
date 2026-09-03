import { MineSite } from '../types';

// Sort mines by state
export const getMinesByState = (mines: MineSite[], state?: string): MineSite[] => {
  if (!state) return mines;
  return mines.filter(mine => mine.state === state);
};

// Get unique states from mines
export const getUniqueStates = (mines: MineSite[]): string[] => {
  const states = new Set(mines.map(mine => mine.state));
  return Array.from(states).sort();
};

// Get mines count by state
export const getMinesCountByState = (mines: MineSite[]): Record<string, number> => {
  return mines.reduce((acc, mine) => {
    acc[mine.state] = (acc[mine.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// Get total production by state
export const getProductionByState = (mines: MineSite[]): Record<string, number> => {
  return mines.reduce((acc, mine) => {
    acc[mine.state] = (acc[mine.state] || 0) + mine.currentProductionMT;
    return acc;
  }, {} as Record<string, number>);
};

// Filter mines by multiple criteria
export interface MineFilterOptions {
  state?: string;
  mineType?: string;
  subsidiary?: string;
  minProductionMT?: number;
  maxProductionMT?: number;
}

export const filterMines = (
  mines: MineSite[],
  options: MineFilterOptions
): MineSite[] => {
  return mines.filter(mine => {
    if (options.state && mine.state !== options.state) return false;
    if (options.mineType && mine.type !== options.mineType) return false;
    if (options.subsidiary && mine.subsidiary !== options.subsidiary) return false;
    if (
      options.minProductionMT !== undefined &&
      mine.currentProductionMT < options.minProductionMT
    )
      return false;
    if (
      options.maxProductionMT !== undefined &&
      mine.currentProductionMT > options.maxProductionMT
    )
      return false;
    return true;
  });
};

// Sort mines by production
export const sortMinesByProduction = (
  mines: MineSite[],
  order: 'asc' | 'desc' = 'desc'
): MineSite[] => {
  return [...mines].sort((a, b) => {
    const diff = a.currentProductionMT - b.currentProductionMT;
    return order === 'desc' ? -diff : diff;
  });
};

// Get state statistics
export interface StateStatistics {
  state: string;
  totalMines: number;
  totalProduction: number;
  averageProduction: number;
  mineTypes: Record<string, number>;
}

export const getStateStatistics = (mines: MineSite[]): StateStatistics[] => {
  const states = getUniqueStates(mines);
  return states.map(state => {
    const stateMines = getMinesByState(mines, state);
    const totalProduction = stateMines.reduce((sum, m) => sum + m.currentProductionMT, 0);
    const mineTypes: Record<string, number> = {};
    
    stateMines.forEach(mine => {
      mineTypes[mine.type] = (mineTypes[mine.type] || 0) + 1;
    });

    return {
      state,
      totalMines: stateMines.length,
      totalProduction,
      averageProduction: totalProduction / stateMines.length,
      mineTypes
    };
  });
};
