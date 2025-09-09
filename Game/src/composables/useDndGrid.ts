import { ref } from 'vue';

type Area = 'top' | 'bottom';
type Item = { id: string; label: string };
type Cell = Item | null;

export function useDndGrid() {
  // 9x9 = 81 hücre
  const TOP_COLS = 9;
  const topGrid = ref<Cell[]>(Array.from({ length: TOP_COLS * TOP_COLS }, () => null));
  // 1x9 = 9 hücre
  const bottomGrid = ref<Cell[]>(Array.from({ length: 9 }, () => null));

  // Başlangıç: üst gridin sol üst köşesine bir kutu
  topGrid.value[0] = { id: 'box-1', label: '1' };

  // Drag state
  const dragging = ref<{ area: Area; index: number; id: string } | null>(null);

  function onDragStart(e: DragEvent, area: Area, index: number) {
    const cell = area === 'top' ? topGrid.value[index] : bottomGrid.value[index];
    if (!cell) return;
    dragging.value = { area, index, id: cell.id };

    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', JSON.stringify(dragging.value));
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  function onDragEnd() {
    dragging.value = null;
  }

  function onDragOver(e: DragEvent) {
    // Drop çalışabilsin diye şart
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  }

  function moveTo(area: Area, index: number, payload: { area: Area; index: number; id: string }) {
    const srcArr = payload.area === 'top' ? topGrid.value : bottomGrid.value;
    const dstArr = area === 'top' ? topGrid.value : bottomGrid.value;

    // Hedef dolu ise taşıma
    if (dstArr[index] !== null) return;

    // Kaynaktan sil
    const item = srcArr[payload.index];
    if (!item) return;
    srcArr[payload.index] = null;

    // Hedefe koy
    dstArr[index] = { id: item.id, label: item.label };
  }

  function onDrop(area: Area, index: number, e: DragEvent) {
    e.preventDefault();

    let data: { area: Area; index: number; id: string } | null = null;
    const dt = e.dataTransfer?.getData('text/plain');
    if (dt) {
      try { data = JSON.parse(dt); } catch { /* ignore */ }
    }
    if (!data && dragging.value) data = dragging.value;
    if (!data) return;

    moveTo(area, index, data);
    dragging.value = null;
  }

  return {
    TOP_COLS,
    topGrid,
    bottomGrid,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  };
}