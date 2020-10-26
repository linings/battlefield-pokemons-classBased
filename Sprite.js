import App from './App.js';

class Sprite {
  constructor(application, battlefield) {
    this.infoAboutSprite = {};
    this.doAllyAttackFirst = false;
    this.moveBackward = false;
    this.application = application;
    this.battlefield = battlefield;
    this.Container = PIXI.Container;
    this.Graphics = PIXI.Graphics;
    this.TextStyle = PIXI.TextStyle;
    this.Text = PIXI.Text;
    this.healthDecreaser = 0;
    this.style = new this.TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fill: '#8FBC8F',
      strokeThickness: 4,
      dropShadow: true,
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 4,
    });
    this.play;
    this.id;
    this.healthBar1;
    this.healthBar2;
  }

  pickAFighter = (animation, result) => {
    animation.interactive = true;
    animation.buttonMode = true;

    animation.on('click', this.onClick.bind(null, result, animation));
  };

  onClick = (result, animation) => {
    this.application.stage.visible = false;

    document.body.removeChild(this.application.view);
    document.body.appendChild(this.battlefield.view);

    this.battlefield.renderer.backgroundColor = 0x52258844;

    const [
      fighter,
      competitor,
      firstSprite,
      secondSprite,
    ] = this.loadRandomFighter(result, animation);

    this.makeHPbar1(0, 100, 250, 120, 20, 0);
    this.makeHPbar2(0, 530, 250, 120, 20, 0);

    this.displayNameOfFighter(fighter, competitor, 120, 550, 220);

    fighter.fight(
      competitor,
      [firstSprite, secondSprite],
      this.healthDecreaser
    );
    // competitor.fight(fighter, competitor, [firstSprite, secondSprite]);
  };

  loadRandomFighter = (result, animation) => {
    let spriteOne, spriteTwo;

    let fighter = new Sprite();
    let competitor = new Sprite();

    fighter.infoAboutSprite = result.find(
      (f) => f.sprite_front === animation.texture.textureCacheIds[0]
    );

    spriteOne = this.addFightersToStage(fighter.infoAboutSprite.sprite_back);
    spriteOne.position.set(120, 120);

    competitor.infoAboutSprite =
      result[Math.floor(Math.random() * result.length)];

    if (
      competitor.infoAboutSprite.sprite_front !==
      fighter.infoAboutSprite.sprite_front
    ) {
      spriteTwo = this.addFightersToStage(
        competitor.infoAboutSprite.sprite_front
      );
      spriteTwo.position.set(550, 120);
    } else {
      this.loadRandomFighter();
    }

    return [fighter, competitor, spriteOne, spriteTwo];
  };

  addFightersToStage = (sprite) => {
    let texture = PIXI.Texture.from(sprite);
    const animatedSprite = new PIXI.AnimatedSprite([texture]);
    this.battlefield.stage.addChild(animatedSprite);

    return animatedSprite;
  };

  makeHPbar1 = (healthBarPosition, x, y, w, h) => {
    this.healthBar1 = new this.Container();
    this.healthBar1.position.set(healthBarPosition, 4);
    this.battlefield.stage.addChild(this.healthBar1);

    let innerBar = new this.Graphics();
    innerBar.beginFill(0x00bb43);
    innerBar.drawRect(x, y, w, h);
    innerBar.endFill();
    this.healthBar1.addChild(innerBar);

    let outerBar = new this.Graphics();
    outerBar.beginFill(0xff3300);
    outerBar.drawRect(x, y, w / this.healthDecreaser, h);
    outerBar.endFill();
    this.healthBar1.addChild(outerBar);

    this.healthBar1.outerBarFirst = outerBar;
  };

  makeHPbar2 = (healthBarPosition, x, y, w, h) => {
    this.healthBar2 = new this.Container();
    this.healthBar2.position.set(healthBarPosition, 4);
    this.battlefield.stage.addChild(this.healthBar2);

    let innerBar = new this.Graphics();
    innerBar.beginFill(0x00bb43);
    innerBar.drawRect(x, y, w, h);
    innerBar.endFill();
    this.healthBar2.addChild(innerBar);

    let outerBar = new this.Graphics();
    outerBar.beginFill(0xff3300);
    outerBar.drawRect(x, y, w / this.healthDecreaser, h);
    outerBar.endFill();
    this.healthBar2.addChild(outerBar);

    this.healthBar2.outerBarSecond = outerBar;
  };

  displayNameOfFighter = (
    fighter,
    competitor,
    fighterVPosition,
    competitorVPosition,
    hPosition
  ) => {
    let fighterName = new this.Text(
      `name: ${[fighter.infoAboutSprite['name']]}`,
      this.style
    );
    fighterName.position.set(fighterVPosition, hPosition);
    this.battlefield.stage.addChild(fighterName);

    let competitorName = new this.Text(
      `name: ${[competitor.infoAboutSprite['name']]}`,
      this.style
    );
    competitorName.position.set(competitorVPosition, hPosition);
    this.battlefield.stage.addChild(competitorName);
  };

  fight = (competitor, sprites) => {
    const myStats = this.infoAboutSprite.stats;
    const competitorStats = competitor.infoAboutSprite.stats;
    let damage = 0;

    if (myStats.speed > competitorStats.speed) {
      damage =
        (myStats.attack / competitorStats.defense) * this.getRandomInt(201);
      damage = Math.round(damage);

      this.doAllyAttackFirst = true;
      if (damage > 0) {
        this.attack(myStats, competitorStats, sprites, damage);
      }
    } else {
      damage =
        (competitorStats.attack / myStats.defense) * this.getRandomInt(201);
      damage = Math.round(damage);

      this.doAllyAttackFirst = false;
      if (damage > 0) {
        this.attack(myStats, competitorStats, sprites, damage);
      }
    }
  };

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  attack = (myStats, competitorStats, sprites, damage) => {
    const [fighter, competitor] = sprites;

    const app = new App();
    app.battlefield.ticker.add(() =>
      this.play(fighter, competitor, myStats, competitorStats, damage)
    );
  };

  play = (fighter, competitor, myStats, competitorStats, damage) => {
    if (this.doAllyAttackFirst) {
      this.initiateAttack(fighter, 470, 120, 530, competitor, myStats, damage);
    } else {
      this.initiateAttack(
        competitor,
        180,
        550,
        100,
        fighter,
        competitorStats,
        damage
      );
    }
  };

  initiateAttack = (
    attacker,
    startingPosition,
    endingPosition,
    healthbarPosition,
    blinker,
    stats,
    damage
  ) => {
    attacker.vx = 1;

    if (attacker.x === endingPosition && this.moveBackward) {
      this.stopCurrentAndPlayOther();
    }

    if (this.doAllyAttackFirst) {
      if (attacker.x < startingPosition && !this.moveBackward) {
        attacker.x += attacker.vx;
      } else if (attacker.x === startingPosition) {
        this.moveBackward = true;
        attacker.vx = 0;
        this.setBlinking(blinker);

        // this.healthDecreaser = stats.hp / damage;
        // this.makeHPbar1(0, healthbarPosition, 250, 120, 20);
        // this.hpDecreaser(stats, damage, isFighterFirst);

        attacker.x -= 1;
      } else if (attacker.x <= startingPosition && this.moveBackward) {
        attacker.x -= attacker.vx;
      }
    } else {
      if (attacker.x > startingPosition && !this.moveBackward) {
        attacker.x -= attacker.vx;
      } else if (attacker.x === startingPosition) {
        this.moveBackward = true;
        attacker.vx = 0;

        this.setBlinking(blinker);

        // this.healthDecreaser = stats.hp / damage;
        // this.makeHPbar2(0, healthbarPosition, 250, 120, 20);
        // this.hpDecreaser(stats, damage, isFighterFirst);

        attacker.x += 1;
      } else if (attacker.x > startingPosition && this.moveBackward) {
        attacker.x += attacker.vx;
      }
    }
  };

  stopCurrentAndPlayOther = () => {
    this.moveBackward = !this.moveBackward;
    this.doAllyAttackFirst = !this.doAllyAttackFirst;
  };

  delay = (ms) =>
    new Promise((res) => {
      this.id = setTimeout(res, ms);
    });

  setBlinking = async (fighterToBlink) => {
    let timer = 1000;
    fighterToBlink.alpha = 0;

    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) {
        await this.delay(timer);
        fighterToBlink.alpha = 1;
      } else {
        await this.delay(timer);
        fighterToBlink.alpha = 0;
      }
    }

    clearTimeout(this.id);
  };

  hpDecreaser = () => {
    stats.hp -= damage;
  };
}

export default Sprite;
