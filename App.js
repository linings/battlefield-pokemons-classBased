import DisplaySpritesField from './DisplaySpritesField.js';

class App {
  constructor() {
    this.Application = PIXI.Application;

    this.app = new this.Application({
      width: 800,
      height: 1600,
    });
    this.battlefield = new this.Application({
      width: 800,
      height: 500,
    });
    this.endGame = new this.Application({
      width: 600,
      height: 400,
    });
  }

  start = () => {
    document.body.appendChild(this.app.view);
    this.app.renderer.backgroundColor = 0x5555979;

    const game = new DisplaySpritesField(this.app, this.battlefield,this.endGame);
    game.render();
  };
}

export default App;
