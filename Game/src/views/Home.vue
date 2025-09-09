<template>
    <div class="app-container">
    <!-- Header: Para ve oyun bilgileri -->
    <!--<header class="game-header">
        <div class="money-display">💰 {{ money }} $</div>
        <div class="user-name"><router-link to="/login">{{ name }}</router-link></div>
    </header>-->

    <!-- Ana oyun alanı -->
    <main>
      <div class="wrap">
        <!-- ÜST GRID: 9x9 -->
        <div class="grid top"
            :style="{ gridTemplateColumns: `repeat(${TOP_COLS}, ${CELL}px)` }">
          <div v-for="(cell, i) in topGrid" :key="'t'+i"
              class="cell"
              @dragover="onDragOver"
              @drop="(e) => onDrop('top', i, e)">
            <div v-if="cell"
                class="box"
                draggable="true"
                @dragstart="(e)=>onDragStart(e,'top',i)"
                @dragend="onDragEnd">
              {{ cell.label }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer: Satın alma, Envanter -->
    <footer class="game-footer">
      <div>
        <!-- Envanter'i Açma -->
        <button style="margin-left: 10px"
          @click="toggleEnvanterMode"
          :disabled="buyMode !== null || selectedItemForAction !== null"
          :class="{
            'btn-blue': !isMoving,
            'btn-purple': isMoving,
            'btn-default': buyMode !== null || selectedItemForAction !== null
          }"
          class="btn">
          {{ isMoving ? 'Çıkış' : 'Envanter' }}
        </button>

        <!-- ALT GRID: 1x9 -->
        <div class="grid bottom"
            :style="{ gridTemplateColumns: `repeat(9, ${CELL}px)`, display: isMoving ? 'flex' : 'none' }">
          <div v-for="(cell, i) in bottomGrid" :key="'b'+i"
              class="cell"
              @dragover="onDragOver"
              @drop="(e) => onDrop('bottom', i, e)">
            <div v-if="cell"
                class="box"
                draggable="true"
                @dragstart="(e)=>onDragStart(e,'bottom',i)"
                @dragend="onDragEnd">
              {{ cell.label }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Marketi Açma -->
        <button style="margin-left: 10px"
          @click="toggleMarketMode"
          :disabled="buyMode === null || selectedItemForAction === null"
          :class="{
            'btn-blue': !buyMode,
            'btn-purple': buyMode,
            'btn-default': buyMode !== null || selectedItemForAction !== null
          }"
          class="btn">
          {{ buyMode ? 'Çıkış' : 'Market' }}
        </button>

        <!-- ALT GRID: 1x9 -->
        <div class="grid bottom"
            :style="{ gridTemplateColumns: `repeat(9, ${CELL}px)`, display: buyMode ? 'flex' : 'none' }">
          <div v-for="(cell, i) in bottomGrid" :key="'b'+i"
              class="cell"
              @dragover="onDragOver"
              @drop="(e) => onDrop('bottom', i, e)">
            <div v-if="cell"
                class="box"
                draggable="true"
                @dragstart="(e)=>onDragStart(e,'bottom',i)"
                @dragend="onDragEnd">
              {{ cell.label }}
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useGame, gridWidth, gridHeight, cellSize } from '../composables/useGame';
import { loggingIn } from '../composables/database';
import { useRouter } from 'vue-router';
import { useDndGrid } from '../composables/useDndGrid';

const CELL = 56;

const {
  TOP_COLS,
  topGrid,
  bottomGrid,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
} = useDndGrid();

// Kullanıcı verileri
const { name } = loggingIn();
const router = useRouter();
//if(!name.value) router.push('/login');

// Oyun içi değerler
const {
  money,
  buyMode,
  hasFurnace,
  isMoving,
  selectedItemForAction,
  blockCost,
  setBuyMode,
  cancelAction,
  deleteItem,
  toggleEnvanterMode,
  toggleMarketMode,
  grid,
  envanter,
  handleGridCellClick,
  handleEnvanterCellClick,
} = useGame();
</script>

<style scoped>
.wrap {
  max-width: 940px;
  margin: 24px auto;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
h1 { margin: 0 0 16px 0; }

.grid {
  display: grid;
  gap: 8px;
}
.top { margin-bottom: 24px; }
.bottom { margin-top: 16px; }

.cell {
  width: 56px;
  height: 56px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  display: grid;
  place-items: center;
}

.box {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  font-weight: 600;
  user-select: none;
  cursor: grab;
  box-shadow: 0 6px 16px rgba(0,0,0,.15);
}
.box:active { cursor: grabbing; }

.hint { color:#64748b; margin-top: 12px; }
</style>