<template>
  <form @submit.prevent="handleSubmit">
    <h2>Distributeur de Zipette Coins</h2>
    <div>
      <label for="userID">ID Utilisateur</label>
      <input type="text" id="userID" name="userID" required v-model="id" />
    </div>
    <div>
      <label for="amount">Quantité</label>
      <input
        type="number"
        id="amount"
        name="amount"
        required
        v-model="amount"
      />
    </div>
    <button type="submit" :disabled="isLoading">Ajouter</button>
  </form>
</template>

<script lang="ts" setup>
import useAPIRequest from "@/composables/useAPIRequest";
import router from "@/router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";

const { me } = storeToRefs(useAuthenticationStore());

const { handleRequest, isLoading } = useAPIRequest<{
  url: string;
}>({
  method: "POST",
});

const id = ref<string>("");
const amount = ref<number>(0);

const handleSubmit = async () => {
  await handleRequest({
    body: { id: id.value, amount: amount.value },
    endpoint: "/give/" + id.value,
  });

  if (me.value && me.value.id === id.value) {
    me.value.zipetteCoins += amount.value;
  }
};

watchEffect(() => {
  if (me.value && !me.value.groups.includes("/staff")) {
    return router.push({ name: "home" });
  }
  id.value = me.value?.id!;
});
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  input {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-primary);
    width: 80%;
    max-width: 300px;
  }
}
</style>
