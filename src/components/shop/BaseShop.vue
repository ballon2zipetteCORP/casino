<template>
    <div class="container">        
        <ul>
            <li>
                <mdicon name="sticker" />
                Stickers
            </li>
        </ul>

        <section>
            <article>
                <img alt="simple sticker" src="/images/shop/stickers/basic_sticker.png" />
                <h3>Sticker B2Z Simple holographique</h3>
                <h4>500 ZPC</h4>
                <button class="primary">
                    Commander
                    <mdicon name="cart" />
                </button>
            </article>
        </section>
    </div>
</template>

<script lang="ts" setup>

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
    border-radius: 20px;
    padding: 1em;

    text-align: center;

    &>img {
        display: block;
        margin: auto;
        width: 15em;
        margin-bottom: 1em;
    }

    &>h3 {
        font-family: "poppins-bold", sans-serif;
    }
    &>h4 {
        margin-bottom: 1em;
        color: var(--gray-3);
    }

    &>button {
        width: 100%;
    }
}
</style>