<template>
    <section>
        <RouterLink :to="{name: 'games.european-roulette'}">
            <article>
                <img alt="roulette" src="/images/roulette.png" />
                <div>
                    <h2>Roulette zipette</h2>
                    <h3>Cliquez pour accéder <mdicon name="arrow-right" /></h3>
                </div>
            </article>
        </RouterLink>
    </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
section {
    width: 65%;
    margin: 2em auto;
    margin-top: 8em;
}
section a {
    text-decoration: none;
    color: white;
}

section article {
    background: linear-gradient(189deg, rgb(20 40 229) 31%, rgb(2 3 11) 97%);    
    padding: 1em 2em;
    border-radius: 20px;

    height: 10em;
    position: relative;

    &>div {
        position: absolute;
        bottom: 1em;
    }

    & h2 {
        font-family: "poppins-bold", sans-serif;
    }

    & h3 {
        color: var(--gray-3);
    }
    & img {
        position: absolute;
        top: -9em;
        right: -1em;

        width: 25em;
    }
}
</style>