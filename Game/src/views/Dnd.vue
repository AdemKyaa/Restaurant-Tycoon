<template>
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

    <!-- ALT GRID: 1x9 -->
    <div class="grid bottom"
         :style="{ gridTemplateColumns: `repeat(9, ${CELL}px)` }">
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
</template>

<script lang="ts" setup>
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