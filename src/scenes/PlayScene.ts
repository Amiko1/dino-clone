import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";

class PlayScene extends GameScene {
  player: Player;
  startTrigger: SpriteWithDynamicBody;
  ground: Phaser.GameObjects.TileSprite;

  constructor() {
    super("PlayScene");
  }

  create() {
    this.createEnvironment();
    this.createPlayer();

    this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0,1).setAlpha(0)

    

    this.physics.add.overlap(this.startTrigger, this.player, () => {
      if(this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight);
        return; 
      }

      this.isGameRunning = true;
      this.startTrigger.body.reset(9999, 9999);

      const rollOutEvent = this.time.addEvent({
        delay: 1000/60,
        loop: true,
        callback: () => {
          this.player.setVelocityX(80)
          this.player.playRunAnimation()
          this.ground.width += 34;
          if(this.ground.width >= this.gameWidth) {
            rollOutEvent.remove();
            this.ground.width = this.gameWidth
            this.player.setVelocityX(0);  
          }
        }
      })
    })
  }

  createPlayer() {
    this.player = new Player(this, 0, this.gameHeight);  
  }

  createEnvironment() {
    this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, "ground").setOrigin(0, 1);
  }
}

export default PlayScene;
