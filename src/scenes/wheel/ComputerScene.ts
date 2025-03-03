import SpinWheel from "./SpinWheel";

export default class ComputerScene extends Phaser.Scene {

    private spinWheel: SpinWheel;

    public constructor() {
        super();
        this.spinWheel = new SpinWheel(this);
    }

    public preload() {
        this.load.spritesheet('token', '/sprites/token.svg', { frameWidth: 300, frameHeight: 300 });

        this.load.image('roulette', '/sprites/wheel/roulette.png');
        this.load.image("cases", "/sprites/wheel/cases.svg");
    }

    public create() {
        this.add
            .image(340, 100, "cases")
            .setScale(.56, .56)
            .setOrigin(0, 0);
        
        this.spinWheel.setGameObject(
            this.add
                .image(150, 200, "roulette")
                .setScale(.8, .8)
                .setOrigin(.5, .5)
        );

        this.spinWheel.spin(0);
    }

}

// function renderToken(scene: Phaser.Scene) {
//     const TOKEN_SCALE = .3;
//     const token = scene.make.image({
//         x: 100,
//         y: 500,
//         key: 'token',
//         scale : { x: TOKEN_SCALE, y: TOKEN_SCALE },
//         add: true
//     });

//     const highlight = scene.add.graphics();
//     token.setInteractive()
//     token.on("pointerover", () => {
//         highlight.clear();
//         highlight.fillStyle(0xffffff, .1);
//         highlight.fillCircle(
//             (token.x - token.width * token.scaleX / 2) + 40,
//             (token.y - token.height * token.scaleY / 2) + 43,
//             40
//         );
//     });
//     token.on("pointerout", () => highlight.clear());
//     token.on("pointerup", () => {
//         // TODO
//     })
// }