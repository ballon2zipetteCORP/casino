<template>
  <form
    @submit.prevent="handleSubmit"
    v-if="!isLoading && isAuthenticated && me?.groups.includes('/staff')"
  >
    <h2>Distributeur de Zipette Coins</h2>
    <div>
      <label for="userID">ID Utilisateur</label>
      <input
        type="text"
        id="userID"
        name="userID"
        required
        v-model="username"
      />
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
    <button type="submit" :disabled="isLoading || isLoadingUser">
      Ajouter
    </button>
  </form>
</template>

<script lang="ts" setup>
import useAPIRequest from "@/composables/useAPIRequest";
import router from "@/router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";

const {
  me,
  isLoading: isLoadingMe,
  isAuthenticated,
} = storeToRefs(useAuthenticationStore());

const { handleRequest, isLoading } = useAPIRequest<{
  url: string;
}>({
  method: "POST",
});

const {
  data: user,
  error,
  handleRequest: handleGetUser,
  isLoading: isLoadingUser,
} = useAPIRequest<{ id: string }>({
  method: "GET",
});

const username = ref<string>("");
const amount = ref<number>(0);

const handleSubmit = async () => {
  await handleGetUser({
    endpoint: "/user?username=" + username.value,
  });

  if (error.value) {
    return alert(error.value.message);
  }

  if (!user.value?.id) {
    return alert("Utilisateur introuvable");
  }

  await handleRequest({
    body: { amount: amount.value },
    endpoint: "/give/" + user.value.id,
  });

  if (me.value && me.value.id === user.value.id) {
    me.value.zipetteCoins += amount.value;
  }
};

watchEffect(() => {
  if (isLoadingMe.value) return;
  if (!isAuthenticated.value || !me.value?.groups.includes("/staff")) {
    return router.push({ name: "home" });
  }
  username.value = me.value!.upn;
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
