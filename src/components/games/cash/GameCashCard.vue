<template>
  <div class="cash" ref="gameRef">
    <canvas
      ref="canvaGame"
      @mousedown="startScratch"
      @mouseup="stopScratch"
      @mousemove="handleMouseMove"
    ></canvas>
    <div class="game-grid">
      <div class="number" v-for="item in numero" :key="item.number">
        <span class="number">{{ item.number }}</span>
        <span class="gain">{{ item.gain }} ZPC</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="win-grid">
      <div class="number" v-for="number in winningNumbers" :key="number">
        <span class="number">{{ number }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from "vue";

defineProps({
  winningNumbers: Array as PropType<number[]>,
  numero: Array as PropType<{ number: number; gain: number }[]>,
});
const canvaGame = ref<HTMLCanvasElement | null>(null);
const gameRef = ref<HTMLDivElement | null>(null);

let isScratching = false;

const getTouchPos = (canvas: HTMLCanvasElement, touch: Touch) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
};

const startScratch = () => {
  isScratching = true;
};

const stopScratch = () => {
  isScratching = false;
};

const scratch = (x: number, y: number) => {
  const canvas = canvaGame.value;
  if (!canvas || !isScratching) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
};

const handleMouseMove = (event: MouseEvent) => {
  scratch(event.offsetX, event.offsetY);
};

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault();

  const canvas = canvaGame.value;
  if (!canvas || event.touches.length === 0) return;

  const touch = event.touches[0];
  const pos = getTouchPos(canvas, touch);
  scratch(pos.x, pos.y);
};

const PADDING = 20;
onMounted(() => {
  const canvas = canvaGame.value;
  if (!canvas) return;

  canvas.height = gameRef.value?.clientHeight
    ? gameRef.value.clientHeight + PADDING
    : 0;
  canvas.width = gameRef.value?.clientWidth
    ? gameRef.value.clientWidth + PADDING
    : 0;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const dollarSize = 25;
  const dollarSpacing = 45;
  const margin = 10;

  ctx.fillStyle = "yellow";
  ctx.font = `${dollarSize}px Arial`;

  for (
    let y = margin + dollarSize;
    y < canvas.height - margin;
    y += dollarSpacing
  ) {
    for (let x = margin; x < canvas.width - margin; x += dollarSpacing) {
      ctx.fillText("$", x, y);
    }
  }

  canvas.addEventListener("touchstart", (event) => {
    startScratch();
    const touch = event.touches[0];
    const pos = getTouchPos(canvas, touch);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener("touchend", stopScratch);
  canvas.addEventListener("touchmove", handleTouchMove);
});
</script>

<style scoped>
div.cash {
  display: flex;
  flex-wrap: nowrap;
  gap: 1em;
  font-size: 24px;
  position: relative;

  canvas {
    position: absolute;
    z-index: 1000;
    border: 10px solid greenyellow;
    transform: translate(-20px, -20px);
  }

  .separator {
    width: 0.1em;
    background-color: yellow;
  }

  .game-grid {
    display: grid;
    grid-template-rows: repeat(4, minmax(0, 1fr));
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 2em;
    place-items: center;

    div {
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span.gain {
        font-size: 12px;
        font-weight: bold;
      }
    }
  }

  .win-grid {
    display: grid;
    grid-template-rows: repeat(3, minmax(0, 1fr));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2em;
    place-items: center;

    div {
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &:nth-of-type(3) {
        grid-column: span 2;
      }
    }
  }
}
</style>
