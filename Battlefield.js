import FetchToApi from './fetchToApi.js';
import Sprite from './Sprite.js';

class Battlefield {
  constructor(app) {
    this.fetchToApi = new FetchToApi();
    this.spriteImages = [];
    this.animatedSprite = '';
    this.Text = PIXI.Text;
    this.TextStyle = PIXI.TextStyle;
    this.application = app;
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
    this.getSpriteImage(result);
  };

  getSpriteImage = (result) => {
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
      let name = new Text(`name: ${[result[i]['name']]}`);
      let ability = new Text(`ability: ${[result[0]['ability']]}`);

      if (i !== 0 && i % 5 === 0) {
        position += 5;
        hp += hpIncreaser;
      }
      let vp = 155 * (i - position) + 25;

      animation.position.set(vp, hp);

      // if (i <= 4) {
      //   const vp = 155 * i + 25;
      //   const hp = 0;
      //   sprite.animation.position.set(vp, hp);
      //   // creatingText(vp, hp, [
      //   //   name,
      //   //   ability,
      //   //   move1,
      //   //   move2,
      //   //   move3,
      //   //   move4,
      //   //   speed,
      //   //   specialDefense,
      //   //   specialAttack,
      //   //   defense,
      //   //   attack,
      //   //   health,
      //   // ]);
      // }
      // if (i > 4 && i <= 9) {
      //   const vp = 155 * (i - 5) + 25;
      //   const hp = 400;
      //   sprite.animation.position.set(vp, hp);
      //   // creatingText(vp, hp, [
      //   //   name,
      //   //   ability,
      //   //   move1,
      //   //   move2,
      //   //   move3,
      //   //   move4,
      //   //   speed,
      //   //   specialDefense,
      //   //   specialAttack,
      //   //   defense,
      //   //   attack,
      //   //   health,
      //   // ]);
      // }
      // if (i > 9 && i <= 14) {
      //   const vp = 155 * (i - 10) + 25;
      //   const hp = 800;
      //   sprite.animation.position.set(vp, hp);
      //   // creatingText(vp, hp, [
      //   //   name,
      //   //   ability,
      //   //   move1,
      //   //   move2,
      //   //   move3,
      //   //   move4,
      //   //   speed,
      //   //   specialDefense,
      //   //   specialAttack,
      //   //   defense,
      //   //   attack,
      //   //   health,
      //   // ]);
      // }
      // if (i > 14) {
      //   const vp = 155 * (i - 15) + 25;
      //   const hp = 1200;
      //   sprite.animation.position.set(vp, hp);
      //   // creatingText(vp, hp, [
      //   //   name,
      //   //   ability,
      //   //   move1,
      //   //   move2,
      //   //   move3,
      //   //   move4,
      //   //   speed,
      //   //   specialDefense,
      //   //   specialAttack,
      //   //   defense,
      //   //   attack,
      //   //   health,
      //   // ]);
      // }

      this.application.stage.addChild(animation);
    }
  };
}

export default Battlefield;
