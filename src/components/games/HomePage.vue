<template>
    <section>
        <RouterLink v-for="game in GAMES" :key="game.name" :to="{name: game.pathName}">
            <article>
                <div>
                    <h2>{{ game.name }}</h2>
                    <h3>Cliquez pour accéder <mdicon name="arrow-right" /></h3>
                </div>
                <img :alt="game.name" :src="`/images/games/${game.imageName}`" />
            </article>
        </RouterLink>
    </section>
</template>

<script lang="ts" setup>
interface IGame {
    name: string;
    imageName: string;
    pathName: string;
}

const GAMES: Array<IGame> = [
    { name: "Roulette zipette", imageName: "roulette.png", pathName: "games.european-roulette" },
    { name: "Machine à zipette", imageName: "slot-machine.png", pathName: "games.slot-machine" },
    { name: "Cash", imageName: "cash.png", pathName: "games.cash" }
]
</script>

<style scoped>
section {
    width: 65%;
    margin: 2em auto;
    margin-bottom: 5em;
    margin-top: 8em;

    display: grid;
    gap: 3em;
    grid-template-areas: 
        "a a a"
        "b b c";
}
section a {
    text-decoration: none;
    color: white;

    display: block;

    &:nth-of-type(1) {
        grid-area: a;

        &>article {
            background: linear-gradient(189deg, rgb(20 40 229) 31%, rgb(2 3 11) 97%);
       
            &>div {
                position: absolute;
                bottom: 1.5em;
            }

            & img {
                position: absolute;
                top: -9em;
                right: -1em;
                width: 25em;
            }
        }
    }

    &:nth-of-type(2) {
        grid-area: b;
        &>article {
            background: linear-gradient(189deg, rgb(169 58 177) 31%, rgb(207 147 209) 97%);        
        }
    }

    &:nth-of-type(3) {
        grid-area: c;
        &>article {
            background: linear-gradient(189deg, rgb(41 174 77) 31%, rgb(42 88 55) 97%);
        }
    }

}

section article {
    padding: 1em 2em;
    border-radius: 20px;

    height: 10em;
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    & h2 {
        font-family: "poppins-bold", sans-serif;
    }

    & h3 {
        color: var(--gray-3);
    }

    &>div {
        position: unset;

        &>h3 {
            font-size: 1.2em;
        }
    }

    &>img {
        width: 15em;
    }
}
</style>