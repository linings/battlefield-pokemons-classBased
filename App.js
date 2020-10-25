import Battlefield from './Battlefield.js';

class App {
  constructor() {
    this.Application = PIXI.Application;
  }

  start = (dimensions) => {
    const app = new this.Application(dimensions);

    document.body.appendChild(app.view);
    app.renderer.backgroundColor = 0x5555979;

    const game = new Battlefield(app);
    game.render();
  };
}
export default App;
