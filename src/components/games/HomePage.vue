<template>
    <section>
        <RouterLink class="roulette" :to="{name: 'games.european-roulette'}">
            <article>
                <h2>Roulette zipette</h2>
                <img alt="roulette zipette" src="/images/games/homePage/roulette.png" />
            </article>
        </RouterLink>
        <RouterLink class="cash" :to="{name: 'games.cash'}">
            <article>
                <h2>Cash</h2>
                <img alt="cash" src="/images/games/homePage/cash.png" />
            </article>
        </RouterLink>
        <RouterLink class="machine" :to="{name: 'games.slot-machine'}">
            <article>
                <h2>Machine à zipette coins</h2>
                <img alt="slot machine" src="/images/games/homePage/slot-machine.png" />
            </article>
        </RouterLink>
        <RouterLink class="tresor" :to="{name: 'games.mine-sweeper'}">
            <article>
                <h2>Chasse au zipette coins</h2>
                <img alt="tresor" src="/images/games/homePage/tresor.png" />
            </article>
        </RouterLink>
        <RouterLink class="avioncrash" :to="{name: 'home'}">
            <div class="locked">
                <div class="center">
                    <mdicon size="60" name="lock" />
                    <h3>Prochainement</h3>
                </div>
            </div>
            <article>
                <h2>Avion crash</h2>
                <img alt="tresor" src="/images/games/homePage/avion-crash.png" />
            </article>
        </RouterLink>
        <RouterLink class="blackjack" :to="{name: 'home'}">
            <div class="locked">
                <div class="center">
                    <mdicon size="60" name="lock" />
                    <h3>Prochainement</h3>
                </div>
            </div>
            <article>
                <h2>Blackjack</h2>
                <img alt="tresor" src="/images/games/homePage/blackjack.png" />
            </article>
        </RouterLink>
    </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
section {
    display: grid;
    gap: 1em;
    margin: 2em 2em;
    grid-template-areas: 
        'roulette cash cash tresor'
        'roulette machine machine tresor'
        'avioncrash avioncrash blackjack blackjack';
}
a {
    border: 2px solid;
    border-radius: 20px;
    position: relative;
    text-decoration: none;
    color: white;

    opacity: .8;
    transition: all .5s ease;

    div.locked {
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, .5);
        opacity: 1;  

        position: absolute;
        top: 0;
        left: 0;
        border-radius: 20px;

        width: 100%;
        height: 100%;

        z-index: 99;

        &>div.center {
            position: absolute;
            top: 50%;
            left: 50%;

            transform: translate(-50%, -50%);
            text-align: center;
        }
    }

    & h2 {
        font-size: 2em;
        font-family: "poppins-semibold", sans-serif;
        margin: 1em 2em;

        position: relative;
        z-index: 9;
    }

    & img {
        position: absolute;
    }

    &:hover {
        transform: scale(1.02);
        z-index: 99;
        opacity: 1;
    }
}

a.roulette {
    grid-area: roulette;
    border-color: #A576B0;
    background: linear-gradient(131deg, rgba(52,43,63,1) 0%, rgba(96,39,110,1) 100%);
    padding-bottom: 18em;

    img {
        width: 15em;
        right: 0;
        bottom: 0;
    }
}
a.cash {
    grid-area: cash;
    border-color: #5F85AF;
    background: linear-gradient(131deg, rgba(35,49,63,1) 0%, rgba(48,84,124,1) 100%);

    padding-bottom: 3em;
    
    img {
        bottom: 0;
        right: 1em;
        width: 17.8em;
    }
}
a.machine {
    grid-area: machine;
    border-color: #D69561;
    background: linear-gradient(131deg, rgba(176,108,54,1) 0%, rgba(96,63,38,1) 100%);
    
    h2 {
        width: 10em;
        margin-left: 1em !important;
    }

    img {
        right: 2em;
        bottom: 0;

        width: 10em;
    }
}
a.tresor {
    border-color: #A576B0;
    grid-area: tresor;

    background: linear-gradient(131deg, rgba(71,32,86,1) 0%, rgba(130,56,142,1) 100%);

    h2 {
        width: 6em;
    }

    img {
        width: 15em;
        right: 0;
        bottom: 0;
    }
}
a.avioncrash {
    border-color: #EB8484;
    grid-area: avioncrash;
    background: linear-gradient(131deg, rgba(176,54,54,1) 0%, rgba(131,30,30,1) 100%);

    & img {
      bottom: 0;
      right: 1em;         
      width: 19em;
    }
}
a.blackjack {
    border-color: #70CB5D;
    grid-area: blackjack;
    background: linear-gradient(131deg, rgba(46,115,27,1) 0%, rgba(6,56,6,1) 100%);

    & h2 {
        padding-bottom: 2.35em;
    }

    img {
        width: 15em;
        top: 0;
        right: 2em;
    }
}

@media screen and (max-width: 1086px) {
    section {
        grid-template-areas: 
            'cash cash cash cash'
            'machine machine machine machine'
            'roulette roulette tresor tresor'
            'avioncrash avioncrash avioncrash avioncrash'
            'blackjack blackjack blackjack blackjack';
    }
    a.avioncrash {
        padding-bottom: 5em;
    }
}
@media screen and (max-width: 646px) {
    section {
        display: flex;
        flex-direction: column;
    }
}
</style>