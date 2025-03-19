<template>
    <div>
        <label for="bet">Ma mise</label>
        <input 
            :disabled="!!pickedChoice" 
            id="bet"
            :step=".5" 
            type="number" 
            v-model="bet" 
            @input="verifyNumberInputEntry"
        />
        <span class="devise" :class="{'disabled': !!pickedChoice}">ZPC</span>
    </div>
</template>