import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";

class PlayScene extends Phaser.Scene {
  player: Player;
  startTrigger: SpriteWithDynamicBody;
  constructor() {
    super("PlayScene");
  }

  get gameHeight() {
    return this.game.config.height as number;
  }

  create() {
    this.createEnvironment();
    this.createPlayer();

    this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0,1).setAlpha(0)
    this.registerPlayerControl()

    this.physics.add.overlap(this.startTrigger, this.player, () => {
      console.log('overlap')
    })
  }

  createPlayer() {
    this.player = new Player(this, 0, this.gameHeight);  
  }

  registerPlayerControl() {
     const spaceBar =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
     spaceBar.on("down", () => {
      this.player.setVelocityY(-1600);
    });
  }

  createEnvironment() {
    this.add.tileSprite(0, this.gameHeight, 88, 26, "ground").setOrigin(0, 1);
  }
}

export default PlayScene;
