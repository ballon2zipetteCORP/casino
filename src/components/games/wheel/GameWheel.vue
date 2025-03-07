<template>
    <div class="center">
        <game-wheel-spin @on-result="showResult" ref="spinRef" />
        <game-wheel-table ref="tableRef" />
    </div>
    
    {{  tableRef!?.pickedChoice }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import GameWheelTable from './GameWheelTable.vue';
import GameWheelSpin from './GameWheelSpin.vue';

const spinRef = ref<typeof GameWheelSpin|null>(null);
const tableRef = ref<typeof GameWheelSpin|null>(null);

const showResult = (number: number) => {
    alert(number); // TODO propper result
}

onMounted(() => {
    spinRef.value?.spin(0);
})
</script>

<style scoped>
div.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>