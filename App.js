import Battlefield from './Battlefield.js';

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

    const game = new Battlefield(this.app, this.battlefield);
    game.render();
  };
}

export default App;
