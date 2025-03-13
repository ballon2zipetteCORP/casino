<template>
    <div class="container">        
        <ul>
            <li @click="currentCategory = category.id" :class="{'active': category.id === currentCategory}" v-for="category in categories" :key="category.name">
                <mdicon :name="category.icon" />
                {{ category.name }}
            </li>
        </ul>

        <section>
            <article v-for="article in currentArticles" :key="article.name">
                <img alt="simple sticker" :src="`/images/shop/${article.thumbnailPath}`" />
                <h3>{{ article.name }}</h3>
                <h4>{{ article.price }} ZPC</h4>
                <button :disabled="me?.zipetteCoins! < article.price" class="primary">
                    Commander
                    <mdicon name="cart" />
                </button>
            </article>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

interface IArticle {
    thumbnailPath: string;
    name: string;
    price: number;
    category: string;
}

const {me} = storeToRefs(useAuthenticationStore());
const categories = ref<{ name: string; icon: string; id: string; }[]>([
    { id: "stickers", name: "Stickers", icon: "sticker" }
]);

const articles = ref<IArticle[]>([
    { thumbnailPath: "stickers/basic_sticker.png", name: "Sticker B2Z Simple holographique", category: "stickers", price: 5000 }
]);

const currentCategory = ref<string>(categories.value[0].id);
const currentArticles = computed(() => {
    return articles.value
        .filter(article => article.category === currentCategory.value);
})
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
    gap: 1em;

    margin-top: 2em;
}
div.container>section>article {
    background-color: var(--gray-1);
    border-radius: 30px;
    padding: 1em;

    text-align: center;

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
        width: 100%;
        border-radius: 100px;
    }
}
</style>