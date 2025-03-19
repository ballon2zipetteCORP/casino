<template>
    <LoginRequired />
    <div class="container">        
        <ul>
            <li @click="currentCategory = category.id" :class="{'active': category.id === currentCategory}" v-for="category in categories" :key="category.name">
                <mdicon :name="category.icon" />
                {{ category.name }}
            </li>
        </ul>

        <template v-if="!isLoading">
            <section>
                <article v-for="article in data?.products" :key="article.id">
                    <img :alt="article.name" :src="article.imageURL" />
                    <h3>{{ article.name }}</h3>
                    <h4>{{ article.price }} ZPC</h4>
                    <button @click="() => openModal(article)" :disabled="me?.zipetteCoins! < article.price" class="primary">
                        Commander
                        <mdicon name="cart" />
                    </button>
                </article>
            </section>
        </template>
        <template v-else-if="!isLoading && error">
            {{ error.message }}
        </template>
    </div>

    <ShopOrderConfirmationModal 
        :product="selectedProduct" 
        v-show="confirmOrderModalOpened" 
        @close=" confirmOrderModalOpened = false" 
        ref="shopConfirmationRef"
    />
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import LoginRequired from '../ui/LoginRequired.vue';
import useAPIRequest from '@/composables/useAPIRequest';
import ShopOrderConfirmationModal from './ShopOrderConfirmationModal.vue';

export interface IProduct {
    id: string;
    imageURL: string;
    name: string;
    price: number;
    categoryId: string;
}

const {me} = storeToRefs(useAuthenticationStore());
const categories = ref<{ name: string; icon: string; id: string; }[]>([
    { id: "stickers", name: "Stickers", icon: "sticker" }
]);

const shopConfirmationRef = ref<typeof ShopOrderConfirmationModal|undefined>(undefined);
const currentCategory = ref<string>(categories.value[0].id);

const confirmOrderModalOpened = ref<boolean>(false);
const selectedProduct = ref<IProduct|null>(null);

const {data, error, isLoading} = useAPIRequest<{products: IProduct[]}>({
    immediate: true,
    endpoint: "/products/"+currentCategory.value
});

const openModal = (product: IProduct) => {
    shopConfirmationRef.value?.reset();
    selectedProduct.value = product;
    confirmOrderModalOpened.value = true;
}
</script>

<style scoped>
div.container {
    width: 70%;
    margin: 2em auto;
}
div.container>h2 {
    font-family: "poppins-bold", sans-serif;
    margin-bottom: .5em;
}
div.container>ul {
    list-style: none;
    width: fit-content;
    
    &>li {
        cursor: pointer;
        color: var(--gray-3);

        background-color: var(--gray-1);
        padding: .5em 1.1em;
        font-size: 1.1em;

        user-select: none;

        &.active {
            background-color: var(--gray-2);
        }

        &:first-of-type {
            border-top-left-radius: 100px;
            border-bottom-left-radius: 100px;
        }
        &:last-of-type {
            border-top-right-radius: 100px;
            border-bottom-right-radius: 100px;
        }
    }
}
div.container>section {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;    
    gap: 1em;

    margin-top: 2em;
}
div.container>section>article {
    background-color: var(--gray-1);
    border-radius: 30px;
    padding: 1em;
    flex-basis: 18em;

    text-align: center;
    position: relative;

    padding-bottom: 4em;

    &>img {
        display: block;
        margin: auto;
        width: 15em;

        margin-top: 1em;
        margin-bottom: 1em;
    }

    &>h3 {
        font-family: "poppins-bold", sans-serif;
    }
    &>h4 {
        margin-bottom: 1em;
        color: var(--gray-3);

        font-size: 1.2em;
        font-family: "poppins-medium", sans-serif;
        text-decoration: underline;
    }

    &>button {
        width: 90%;
        border-radius: 100px;

        position: absolute;
        bottom: 1em;
    }
}
</style>