<template>
  <div
    ref="toastRef"
    v-show="toast"
    :class="toast?.level?.toLowerCase()"
    class="toast"
    role="alertdialog"
  >
    <mdicon class="icon" size="50" :name="ICON_MAPPER[toast?.level!]" />
    <div>
      <h2>{{ toast?.title }}</h2>
      <h3>{{ toast?.subtitle }}</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

type TLevel = "ERROR" | "SUCCESS" | "INFO" | "WARNING";
interface IToastParams {
  level: TLevel;
  title: string;
  subtitle?: string;
}
const ICON_MAPPER: Record<TLevel, string> = {
  ERROR: "close-circle",
  INFO: "information",
  SUCCESS: "check-circle",
  WARNING: "alert",
};

// timeout until dispappear
const TIMEOUT = 2.5e3;

const toast = ref<IToastParams | null>(null);
const timeoutId = ref<number>(0);
const toastRef = ref<HTMLDivElement | undefined>(undefined);

const close = () => {
  toastRef?.value?.classList?.add("close");
  setTimeout(() => {
    toastRef?.value?.classList?.remove("close");
    toast.value = null;
  }, 1e3 / 2);
};

window.toast = (params: IToastParams) => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
  toast.value = params;
  timeoutId.value = setTimeout(() => {
    close();
  }, TIMEOUT);
};
</script>

<style scoped>
div.toast {
  z-index: 9999999;
  position: fixed;
  top: 2em;
  right: 0;

  background-color: var(--gray-1);
  padding: 1em 2em;
  padding-left: 0.8em;

  width: 30em;

  border-left: 5px solid var(--gray-3);

  display: flex;
  align-items: center;
  gap: 1em;

  animation: toast-appear 1s forwards;

  &.close {
    animation: toast-disappear 1s forwards;
  }

  & h2 {
    font-family: "poppins-bold", sans-serif;
  }
  & h3 {
    color: var(--gray-3);
  }

  &.error {
    border-color: var(--red);
    & > .icon {
      color: var(--red);
    }
  }
  &.warning {
    border-color: var(--orange);
    & > .icon {
      color: var(--orange);
    }
  }
  &.info {
    border-color: var(--primary);
    & > .icon {
      color: var(--primary);
    }
  }
  &.success {
    border-color: var(--green);
    & > .icon {
      color: var(--green);
    }
  }
}

@media screen and (max-width: 538px) {
  div.toast {
    width: 20em;
  }
}

@keyframes toast-appear {
  from {
    right: -300em;
  }
  to {
    right: 0;
  }
}
@keyframes toast-disappear {
  from {
    right: 0;
  }
  to {
    right: -300em;
  }
}
</style>
