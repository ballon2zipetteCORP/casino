<template>
  <form
    @submit.prevent="handleSubmit"
    v-if="!isLoading && isAuthenticated && me?.groups.includes('/staff')"
  >
    <h2>Distributeur de Zipette Coins</h2>
    <div class="parent">
      <label for="userID">Nom de l'utilisateur</label>
      <input
        type="text"
        id="userID"
        name="userID"
        required
        v-model="username"
        @focus="() => (usernameIsFocused = true)"
        @focusout="handleUnfocus"
      />
      <div class="autocomplete" v-if="usernameIsFocused" ref="autocomplete">
        <span
          v-for="user in filteredUsers"
          @click="() => (username = user.username)"
          >{{ user.username }}</span
        >
      </div>
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

    <div>
      <label for="amount">Tricheur</label>
      <input type="checkbox" name="cheat" id="cheat" v-model="cheat" />
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
import { computed, ref, watch } from "vue";

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

const {
  data: users,
  error: usersError,
  handleRequest: handleGetUsers,
  isLoading: isLoadingUsers,
} = useAPIRequest<{ id: string; username: string }[]>({
  endpoint: "/users",
  method: "GET",
});

const username = ref<string>("");
const amount = ref<number>(0);
const cheat = ref<boolean>(false);
const usernameIsFocused = ref<boolean>(false);
const autocomplete = ref<HTMLDivElement | null>(null);

const handleUnfocus = (e: FocusEvent) => {
  setTimeout(() => {
    usernameIsFocused.value = false;
  }, 100);
};

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
    body: { amount: amount.value, cheat: cheat.value },
    endpoint: "/give/" + user.value.id,
  });

  if (me.value && me.value.id === user.value.id) {
    me.value.zipetteCoins += amount.value;
  }
};

watch(
  [me, isLoadingMe],
  ([value, loading]) => {
    if (loading) return;

    if (!isAuthenticated.value || !value?.groups.includes("/staff")) {
      return router.push({ name: "home" });
    }
    handleGetUsers();
    username.value = value!.name;
  },
  { immediate: true }
);

const filteredUsers = computed(() => {
  return users.value
    ? users.value
        .filter(
          (u) =>
            u.username.toLowerCase().includes(username.value.toLowerCase()) &&
            u.username !== username.value
        )
        .slice(0, 10)
    : [];
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

  .parent {
    position: relative;
  }

  .autocomplete {
    width: 80%;
    max-width: 300px;
    position: absolute;

    top: 100%;
    span {
      width: 100%;
      padding: 0.5em;
      border: 1px solid var(--gray-3);
      background: var(--gray-1);
      cursor: pointer;
    }
  }
}
</style>
