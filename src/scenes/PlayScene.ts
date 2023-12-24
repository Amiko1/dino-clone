import Phaser from "phaser";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";
import { PRELOAD_CONFIG } from "..";
class PlayScene extends GameScene {
  player: Player;
  startTrigger: SpriteWithDynamicBody;
  ground: Phaser.GameObjects.TileSprite;
  obsticles: Phaser.Physics.Arcade.Group;
  gameSpeed: number = 10;

  gameOverContainer: Phaser.GameObjects.Container;
  gameOverText: Phaser.GameObjects.Image;
  restartText: Phaser.GameObjects.Image;

  spawnInterval: number = 1500;
  spawnTime: number = 0;

  constructor() {
    super("PlayScene");
  }

  create() {
    this.createEnvironment();
    this.createPlayer();
    this.createObstacles();
    this.createGameoverContainer();

    this.handleGameStart();
    this.handleObstacleCollisions();
    this.handleGameRestart();
  }

  createPlayer() {
    this.player = new Player(this, 0, this.gameHeight);
  }

  createEnvironment() {
    this.ground = this.add
      .tileSprite(0, this.gameHeight, 88, 26, "ground")
      .setOrigin(0, 1);
  }

  update(time: number, deltaTime: number) {
    if (!this.isGameRunning) {
      return;
    }

    this.spawnTime += deltaTime;

    if (this.spawnTime > this.spawnInterval) {
      this.spawnObsticles();
      this.spawnTime = 0;
    }

    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);

    this.obsticles.getChildren().forEach((obsticle: SpriteWithDynamicBody) => {
      if (obsticle.getBounds().right < 0) {
        this.obsticles.remove(obsticle);
      }
    });

    this.ground.tilePositionX += this.gameSpeed;
  }

  createObstacles() {
    this.obsticles = this.physics.add.group();
  }

  createGameoverContainer() {
    this.gameOverText = this.add.image(0, 0, "game-over");
    this.restartText = this.add.image(0, 80, "restart").setInteractive();

    this.gameOverContainer = this.add
      .container(this.gameWidth / 2, this.gameHeight / 2 - 50)
      .add([this.gameOverText, this.restartText])
      .setAlpha(0);
  }

  spawnObsticles() {
    const obstacleNum =
      Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount) + 1;
    const distance = Phaser.Math.Between(600, 900);

    this.obsticles
      .create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
      .setOrigin(0, 1)
      .setImmovable();
  }

  handleGameStart() {
    this.startTrigger = this.physics.add
      .sprite(0, 10, null)
      .setOrigin(0, 1)
      .setAlpha(0);

    this.physics.add.overlap(this.startTrigger, this.player, () => {
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight);
        return;
      }

      this.isGameRunning = true;
      this.startTrigger.body.reset(9999, 9999);

      const rollOutEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callback: () => {
          this.player.setVelocityX(80);
          this.player.playRunAnimation();
          this.ground.width += 34;
          if (this.ground.width >= this.gameWidth) {
            rollOutEvent.remove();
            this.ground.width = this.gameWidth;
            this.player.setVelocityX(0);
          }
        },
      });
    });
  }

  handleGameRestart() {
    this.restartText.on("pointerdown", () => {
      console.log("RES");
    });
  }

  handleObstacleCollisions() {
    this.physics.add.collider(this.obsticles, this.player, () => {
      this.physics.pause();
      this.isGameRunning = false;
      this.player.die();
      this.gameOverContainer.setAlpha(1);
      this.spawnTime = 0;
      this.gameSpeed = 0;
    });
  }
}

export default PlayScene;
