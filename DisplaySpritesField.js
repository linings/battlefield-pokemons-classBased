import FetchToApi from './fetchToApi.js';
import Sprite from './Sprite.js';

class DisplaySpritesField {
  constructor(app, battlefield, endgame) {
    this.fetchToApi = new FetchToApi();
    this.spriteImages = [];
    this.animatedSprite = '';
    this.Text = PIXI.Text;
    this.TextStyle = PIXI.TextStyle;
    this.Graphics = PIXI.Graphics;
    this.healthDecreaser = 0;
    this.application = app;
    this.battlefield = battlefield;
    this.endgame = endgame;
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
  }

  render = async () => {
    const sprites = await this.getSprites();
    const result = await this.itareateSprites(sprites);
    console.log(result);
    this.displaySprites(result);
  };

  getSprites = async () => {
    const result = await this.fetchToApi.fetch(
      `https://pokeapi.co/api/v2/pokemon/`
    );
    return result.results;
  };

  itareateSprites = async (sprites) => {
    let allSpritesInfo = [];
    for (const sprite of sprites) {
      let info = await this.getCurrentSprite(sprite);
      allSpritesInfo.push(info);
    }
    return allSpritesInfo;
  };

  getCurrentSprite = async (sprite) => {
    const info = await this.fetchToApi.fetch(sprite.url);

    return {
      sprite_front: info.sprites.front_default,
      sprite_back: info.sprites.back_default,
      name: sprite.name,
      id: info.id,
      ability: this.findAbility(info),
      moves: info.moves.slice(0, 4),
      stats: this.findStats(info.stats),
    };
  };

  findAbility = (info) => {
    const ability = info.abilities.find((el) => el.is_hidden === true);
    if (ability) {
      return ability.ability.name;
    }
    return null;
  };

  findStats = (infoStats) => {
    const stats = [];
    for (const stat of infoStats) {
      stats[stat.stat.name] = stat.base_stat;
    }
    return stats;
  };

  displaySprites = (result) => {
    for (let i = 0; i < result.length; i++) {
      this.spriteImages.push(result[i]['sprite_front']);
    }
    this.drawSprites(result);
  };

  drawSprites = (result) => {
    let position = 0;
    let hp = 0;
    const hpIncreaser = 400;

    for (let i = 0; i < this.spriteImages.length; i++) {
      let texture = PIXI.Texture.from(this.spriteImages[i]);
      this.animatedSprite = new PIXI.AnimatedSprite([texture]);

      let animation = this.animatedSprite;
      let name = new this.Text(`name: ${[result[i]['name']]}`, this.style);
      let ability = new this.Text(
        `ability: ${[result[0]['ability']]}`,
        this.style
      );

      const [move1, move2, move3, move4] = this.createMoves(result, i);

      const [
        speed,
        specialDefense,
        specialAttack,
        defense,
        attack,
        health,
      ] = this.createStats(result, i);

      if (i !== 0 && i % 5 === 0) {
        position += 5;
        hp += hpIncreaser;
      }
      let vp = 155 * (i - position) + 25;
      animation.position.set(vp, hp);

      this.createText(vp, hp, [
        name,
        ability,
        move1,
        move2,
        move3,
        move4,
        speed,
        specialDefense,
        specialAttack,
        defense,
        attack,
        health,
      ]);

      let sprite = new Sprite(this.application, this.battlefield, this.endgame);

      sprite.pickAFighter(animation, result);

      this.application.stage.addChild(
        animation,
        name,
        ability,
        move1,
        move2,
        move3,
        move4,
        speed,
        specialDefense,
        specialAttack,
        defense,
        attack,
        health
      );
    }
  };

  createMoves = (result, i) => {
    let moves = [];
    let movesFromInput = result[i].moves;

    for (let i = 0; i < movesFromInput.length; i++) {
      let currentMove = new this.Text(
        `move ${i + 1}: ${movesFromInput[i].move.name}`,
        this.style
      );
      moves.push(currentMove);
    }

    return moves;
  };

  createStats = (result, i) => {
    let stats = {};

    for (let j = 0; j < Object.keys(result[i].stats).length; j++) {
      stats[Object.entries(result[i].stats)[j][0]] = Object.entries(
        result[i].stats
      )[j][1];
    }

    let speed = new this.Text(`speed: ${stats.speed}`, this.style);
    let specialDefense = new this.Text(
      `special-defense: ${stats['special-defense']}`,
      this.style
    );
    let specialAttack = new this.Text(
      `special-attack: ${stats['special-attack']}`,
      this.style
    );
    let defense = new this.Text(`defense: ${stats.defense}`, this.style);
    let attack = new this.Text(`attack: ${stats.attack}`, this.style);
    let health = new this.Text(`HP: ${stats.hp}`, this.style);

    return [speed, specialDefense, specialAttack, defense, attack, health];
  };

  createText = (vp, hp, spriteSpecialties) => {
    const moveVertically = 120;
    const spaceBetweenText = 20;

    for (let i = 0; i < spriteSpecialties.length; i++) {
      spriteSpecialties[i].position.set(
        vp,
        hp + moveVertically + i * spaceBetweenText
      );
    }
  };
}

export default DisplaySpritesField;
