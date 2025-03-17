<template>
    <BaseModal v-slot="{closeModal}" @close="emit('close')" title="">
        <template v-if="product">
            <template v-if="!orderSuccess">
                <h2 class="title">Confirmation de votre commande</h2>
                <div class="warning" role="alert">
                    En cliquant sur "confirmer" vous acceptez de vous faire débiter <span>{{ product.price }} ZPC</span>.
                </div>

                <div class="info" role="alert">
                    <mdicon size="30" name="information" />
                    Vous receverez un mail de confirmer à l'adresse suivante: <span>{{ me?.email }}</span>
                </div>

                <div class="actions">
                    <button @click="closeModal" class="secondary">
                        Retour aux produits
                    </button>
                    <button @click="confirmOrder" class="primary">
                        Confirmer
                    </button>
                </div>
            </template>
            <template v-else-if="orderSuccess && !error">
                <mdicon size="120" class="icon success" name="check-circle" />
                <h2 class="title">Commande confirmée</h2>

                <div class="info" role="alert">
                    <mdicon size="30" name="information" />
                    Vous avez reçu un mail de confirmation à l'adresse suivante: <span>{{ me?.email }}</span>. Pensez à vérifier vos spams.
                </div>

                <div class="actions">
                    <button @click="closeModal" class="primary close-modal">
                        Fermer la fenêtre
                    </button>
                </div>
            </template>
            <template v-else-if="error">
                <mdicon class="icon error" name="close-circle" />

                <h2 class="title">Impossible de confirmer la commande</h2>
                <h3>{{ error.message }}</h3>

                <div class="actions">
                    <button @click="closeModal" class="primary close-modal">
                        Fermer la fenêtre
                    </button>
                </div>
            </template>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BaseModal from '../ui/modals/BaseModal.vue';
import type { IProduct } from './BaseShop.vue';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import useAPIRequest from '@/composables/useAPIRequest';
import { ref } from 'vue';

const emit = defineEmits(["close"]);

interface IOrder {
    id: string;
    customerId: string;
    orderedAt: Date;
    productIds: string[];
}

const props = defineProps<{
    product: IProduct|null;
}>();

const orderSuccess = ref<boolean>(false);

const {me} = storeToRefs(useAuthenticationStore());
const {error, handleRequest} = useAPIRequest<{order: IOrder}>({
    endpoint: "/order",
    method: "POST"
});

const confirmOrder = async () => {
    try {
        await handleRequest({
            body: {
                productIds: [props.product?.id]
            }
        });

        me.value!.zipetteCoins -= props.product?.price ?? 0; 
        orderSuccess.value = true;
    } catch(e) {
        const error = e as Error;
        console.error(error);
    }
}

const reset = () => {
    orderSuccess.value = false;
}

defineExpose({ reset });
</script>

<style scoped>
span.icon.success {
    color: var(--green);
}
span.icon.error {
    color: var(--red);
}
span.icon.error, span.icon.success {
    display: block;
    margin: auto;
    text-align: center;
}
h2.title {
    text-align: center;
    margin-top: 1em;
    margin-bottom: .5em;
    font-family: "poppins-bold", sans-serif;
}
div[role="alert"] {
    padding: .8em .8em;
    color: var(--gray-1);
    border-radius: 10px;
}
div.warning[role="alert"] {
    background-color: var(--orange-2);
    &>span {
        text-decoration: underline;
    }
}
div.info[role="alert"] {
    margin-top: 1em;
    background-color: var(--blue-2);
    display: flex;
    flex-direction: column;

    &>span {
        text-decoration: underline;
        font-family: "poppins-bold", sans-serif;
    }
}

div.actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 1em;
}
button.secondary {
    text-decoration: underline;
}
</style>