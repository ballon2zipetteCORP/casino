<template>
    <div>
        <label for="bet">Ma mise</label>
        <input 
            :disabled="disabled" 
            id="bet"
            :step=".5" 
            type="number" 
            v-model="model" 
            @input="verifyNumberInputEntry"
        />
        <span class="devise" :class="{'disabled': disabled}">ZPC</span>
    </div>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';

defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

const model = defineModel({default: 0});
const {me} = storeToRefs(useAuthenticationStore());

const verifyNumberInputEntry = (event: Event) => {
    const target = event.target! as HTMLInputElement;
    if(target) {
        const value = parseFloat(target.value);
        if(value > me.value?.zipetteCoins!) {
            model.value = me.value?.zipetteCoins!;    
        } else if(value < 1) {
            model.value = 0;
        }
    }
}
</script>

<style scoped>
div {
    display: flex;
    align-items: center;
    position: relative;
}
div>label {
    font-size: 1.2em;
    background-color: var(--gray-1);
    padding: .68em .8em;
    width: 50%;

    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
div>input {
    padding: .53em .8em;
    font-size: 1.3em;
    
    border: 1px solid var(--gray-2);
    background-color: var(--gray-2);
    color: white;

    font-family: "poppins-medium", sans-serif;

    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    
    transition: all .5s ease;
    width: 100%;
    
    &::-webkit-inner-spin-button, 
    &::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    &:disabled {
        opacity: .5;
    }
}
div>span.devise {
    position: absolute;
    top: 50%;
    right: 1em;

    transform: translateY(-50%);

    color: var(--gray-3);
    padding-left: 1em;
    user-select: none;

    &.disabled {
        opacity: .5;
    }
}
</style>