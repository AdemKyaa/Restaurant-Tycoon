import { ref, onMounted, onBeforeUnmount, type Ref, watch } from 'vue';
import { userData, updateEnvanter } from './database';

const { users } = userData();

// Grid değerleri
export const gridWidth = 20;
export const gridHeight = 8;
export const cellSize = 64;

// Item tür ve durumları
export type ItemType = 'furnace' | 'table' | 'chair';
export type CellState = null | 'dirty' | 'occupied';

// Item ücretleri
export const blockCost = {
  furnace: 50,
  table: 30,
  chair: 20,
};

// Müşteri bilgileri
export interface Customer {
  id: number;
  timer: number;
  payout: number;
}

// Hücre bilgileri
export interface GridCell {
  type: ItemType | null;
  state: CellState;
  customer?: Customer;
}

export interface EnvanterCell {
  type: ItemType | null;
  state: CellState;
  customer?: Customer;
  count?: number;
}

const createEmptyGrid = (): GridCell[] => {
  return Array.from({ length: gridWidth * gridHeight }, () => ({
    type: null,
    state: null,
  }));
};

const createEmptyEnvanter = (): EnvanterCell[] => {
  return Array.from({ length: 20 }, () => ({
    type: null,
    state: null,
    count: 0,
  }));
};

export const hasFurnace = ref(false);
export function useGame() {
  const money = ref(100);
  const grid: Ref<GridCell[]> = ref(createEmptyGrid());
  const envanter: Ref<EnvanterCell[]> = ref(createEmptyEnvanter());

  const isBuying = ref<ItemType | null>(null);
  const isMoving = ref(false);

  type Selection =
  | {from: 'grid'; index: number; type: ItemType}
  | {from: 'envanter'; index: number; type: ItemType}
  | null;
  const selection = ref<Selection>(null);
  
  let customerId = 0;
  let customerInterval: number;
  let gameLoopInterval: number;

  function toItemType(s: string): ItemType{
    const valid: ItemType[] = ['furnace', 'table', 'chair'];
    if (valid.includes(s as ItemType)) {
      return s as ItemType;
    }
    throw new Error();
  }

  function getItemType(s: string): ItemType{
    const type = s.split(':')[0];
    return toItemType(type);
  }

  function getItemCount(s: string): number{
    const parts = s.split(':');
    if(parts.length < 2) return 0;

    const num = Number(parts[1].trim());
    return isNaN(num) ?0 :num;
  }

  const {users} = userData();
  watch(users, (newUsers) => {
    if (newUsers.length === 0) return;
    const user = newUsers.find(u => u.name === 'adem');
    if (user) {
      for(let i = 0; i < 20; i++) {
        envanter.value[i].type = getItemType(user.Envanter[i]);
        envanter.value[i].count = getItemCount(user.Envanter[i]);
      }
    }
    else {
        console.log("Fail")
    }
  })

  onMounted(() => {
    customerInterval = setInterval(() => addCustomer(), 5000) as unknown as number;
    gameLoopInterval = setInterval(() => gameLoop(), 1000) as unknown as number;
  });

  onBeforeUnmount(() => {
    clearInterval(customerInterval);
    clearInterval(gameLoopInterval);
  });
  
  const placeItem = (index: number, type: ItemType) => {
    if (grid.value[index].type === null && money.value >= blockCost[type]) {
      if (type === "furnace")
      {
        hasFurnace.value = true;
      }
      grid.value[index] = { type: type, state: null };
      money.value -= blockCost[type];
    }
  };

  const collectPayment = (index: number) => {
    const cell = grid.value[index];
    if (cell.type === 'chair' && cell.customer && cell.customer.timer <= 0) {
      money.value += cell.customer.payout;
      grid.value[index].state = 'dirty';
      grid.value[index].customer = undefined;
    }
  };

  const cleanTable = (index: number) => {
    if (grid.value[index].type === 'chair' && grid.value[index].state === 'dirty') {
      grid.value[index].state = null;
    }
  };

  const deleteItem = () => {
    if (selection.value) {
      const { type, index } = selection.value;
      if (type === 'furnace') hasFurnace.value = false;
      money.value += blockCost[type];
      grid.value[index] = { type: null, state: null };
      selection.value = null;
    }
  };

  const cancelAction = () => {
    isBuying.value = null;
    selection.value = null;
  };
  
  const toggleEnvanterMode = () => {
    isBuying.value = null;
    selection.value = null;
    isMoving.value = !isMoving.value;
  };

  const toggleMarketMode = () => {
    isBuying.value = 'furnace';
    selection.value = null;
    isMoving.value = false;
  };

  const addCustomer = () => {
    const availableChairs = grid.value
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell, index }) => {
        if (cell.type !== 'chair' || cell.state !== null) {
          return false;
        }
        
        const row = Math.floor(index / gridWidth);
        const col = index % gridWidth;
  
        const directions = [
          [0, 1], [0, -1], [1, 0], [-1, 0]
        ];
  
        for (const [dr, dc] of directions) {
          const nr = row + dr;
          const nc = col + dc;
  
          if (nr >= 0 && nr < gridHeight && nc >= 0 && nc < gridWidth) {
            const neighborIndex = nr * gridWidth + nc;
            if (grid.value[neighborIndex].type === 'table') {
              return true;
            }
          }
        }
        return false;
      });
  
    if (availableChairs.length > 0) {
      const { index } = availableChairs[Math.floor(Math.random() * availableChairs.length)];
      const payout = 20;
      grid.value[index].state = 'occupied';
      grid.value[index].customer = {
        id: ++customerId,
        timer: 10,
        payout,
      };
    }
  };
  
  const gameLoop = () => {
    let stateChanged = false;
    const newGrid = [...grid.value];

    newGrid.forEach((cell, index) => {
      if (cell.type === 'chair' && cell.customer) {
        if (cell.customer.timer > 0) {
          cell.customer.timer--;
          stateChanged = true;
        }
  
        if (cell.customer.timer < -5) {
          newGrid[index].state = 'dirty';
          newGrid[index].customer = undefined;
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      grid.value = newGrid;
    }
  };

  const handleGridCellClick = (index: number) => {
    const cell = grid.value[index];

    if (isBuying.value) {
      // In buy mode
      placeItem(index, isBuying.value);
    } else if (isMoving.value) {
      // In move mode
      if (selection.value === null) {
        // Item selection
        if (cell.type !== null) {
          selection.value = { from: 'grid', type: cell.type, index };
        }
      } else {
        // Move item or cancel selection
        if (cell.type === null) {
          // Move to an empty space
          const { type, index: oldIndex } = selection.value;
          grid.value[index] = { type, state: null };
          if (selection.value.from === 'grid') grid.value[oldIndex] = { type: null, state: null };
          else envanter.value[oldIndex] = { type: null, state: null };
          selection.value = null;
        } else if (index === selection.value.index) {
          // Click on the same item, cancel selection
          selection.value = null;
        }
      }
    } else {
      // In normal mode
      if (cell.type === 'chair' && cell.state === 'dirty') {
        cleanTable(index);
      } else if (cell.type === 'chair' && cell.customer && cell.customer.timer <= 0) {
        collectPayment(index);
      }
    }
  };

  const handleEnvanterCellClick = (index: number) => {
    const cell = envanter.value[index];

    if (isMoving.value) {
      // In move mode
      if (selection.value === null) {
        // Item selection
        if (cell.type !== null) {
          selection.value = { from: 'envanter', type: cell.type, index };
        }
      } else {
        // Move item or cancel selection
        if (cell.type === null) {
          // Move to an empty space
          const { type, index: oldIndex } = selection.value;
          envanter.value[index] = { type, state: null };
          cell.type = envanter.value[index].type;

          if (selection.value.from === 'grid') {
            grid.value[oldIndex] = { type: null, state: null };
          }
          else {
            const oldCell = envanter.value[oldIndex];
            let oldCount = oldCell.count;
            if (oldCount) oldCount++;
            oldCell.count = oldCount;

            updateEnvanter(oldIndex, `${oldCell.type}:${oldCell.count}`);
            envanter.value[oldIndex] = { type: null, state: null };
          }
          selection.value = null;

          cell.count =+ 1;
          updateEnvanter(index, `${cell.type}:${cell.count}`);

        } else if (index === selection.value.index) {
          // Click on the same item, cancel selection
          selection.value = null;
        }
      }
    }
  }

  const setBuyMode = (mode: ItemType | null) => {
    isBuying.value = mode;
    isMoving.value = false;
    selection.value = null;
  };

  return {
    money,
    grid,
    envanter,
    buyMode: isBuying,
    hasFurnace,
    isMoving,
    selectedItemForAction: selection,
    blockCost,
    handleGridCellClick,
    handleEnvanterCellClick,
    setBuyMode,
    cancelAction,
    deleteItem,
    toggleEnvanterMode,
    toggleMarketMode,
  };
}