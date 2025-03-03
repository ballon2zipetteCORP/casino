export default class SpinWheel {

    private isSpinning: boolean;
    private currentRotation: number;

    private scene: Phaser.Scene;
    private gameObject: Phaser.GameObjects.Image|null;

    private readonly NUMBER_MAPPER: {[key: number]: number} = {
        0: 0, 1: 32, 2: 15, 3: 19, 4: 4, 5: 21, 6: 2, 7: 25, 8: 17, 9: 34, 
        10: 6, 11: 27, 12: 13, 13: 36, 14: 11, 15: 30, 16: 8, 17: 23, 18: 10, 
        19: 5, 20: 24, 21: 16, 22: 33, 23: 1, 24: 20, 25: 14, 26: 31, 27: 9, 
        28: 22, 29: 18, 30: 29, 31: 7, 32: 28, 33: 12, 34: 35, 35: 3, 36: 26    
    }

    public constructor(scene: Phaser.Scene) {
        this.isSpinning = false;
        this.currentRotation = 0;

        this.scene = scene;
        this.gameObject = null;
    }

    public setGameObject(element: Phaser.GameObjects.Image) {
        this.gameObject = element;
    }

    public spin(targetNumber: number) {
        if(this.isSpinning) return;
        targetNumber = this.NUMBER_MAPPER[targetNumber] ?? targetNumber;

        this.isSpinning = true;
    
        const numbersOnWheel = 37;
        const degreesPerNumber = 360 / numbersOnWheel;
        
        const targetAngle = (37 - targetNumber) * degreesPerNumber;
        const extraRotations = 5;
        
        const totalRotation = extraRotations * 360 + targetAngle;
        const duration = 4000;
    
        this.scene.tweens.add({
            targets: this.gameObject,
            angle: this.currentRotation + totalRotation,
            duration: duration,
            ease: "Cubic.easeOut",
            onComplete: () => {
                this.isSpinning = false;
                this.currentRotation += totalRotation;
            }
        });
    }

}