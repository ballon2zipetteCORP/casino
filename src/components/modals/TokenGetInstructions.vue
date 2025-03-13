<template>
    <BaseModal @close="emit('close')" title="Comment avoir des zipette coins 🤓☝️">
        <ul>
            <li>
                <span class="step-title">1</span>
                <span class="instruction">Aller voir les CEO de ballon2zipette.</span>
            </li>
            <li>
                <span class="step-title">2</span>
                <span class="instruction">Une fois la demande faite, attendez quelques heures pour recevoir vos zipette coins.</span>
            </li>
            <li>
                <span class="step-title">3</span>
                <span class="instruction">Rejouez et dépensez encore plus.</span>
            </li>
        </ul>
    </BaseModal>
</template>

<script lang="ts" setup>
import BaseModal from '../ui/modals/BaseModal.vue';

const emit = defineEmits(["close"]);
</script>

<style scoped>
ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: .5em;

    margin-top: 1em;
    padding-bottom: 1em;

    &>li {
        display: flex;
        gap: 1em;
        align-items: center;
        font-size: 1.1em;

        &>span.step-title {
            background-color: var(--primary);
            font-family: "poppins-bold", sans-serif;
            padding: .5em .9em;
            border-radius: 100px;
        }
    }
}
</style>