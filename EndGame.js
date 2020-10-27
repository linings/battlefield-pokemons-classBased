class EndGame {
  constructor(battlefield,endgame) {
    this.Application = PIXI.Application;
    this.TextStyle = PIXI.TextStyle;
    this.Text = PIXI.Text;
    this.gameOverStyle = new this.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    });
    this.btntyle = new this.TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    });
    this.message;
    this.battlefield = battlefield;
    this.endgame = endgame;
  }

  decreaseHP = (stats, damage, isFighterFirst) => {
    stats.hp -= damage;

    if (stats.hp <= 0) {
      document.body.removeChild(this.battlefield.view);
      document.body.appendChild(this.endgame.view);
      this.endgame.renderer.backgroundColor = 0x5553339;

      if (isFighterFirst) {
        this.message = new this.Text('You Win!', this.gameOverStyle);
      } else {
        this.message = new this.Text('You Lose!', this.gameOverStyle);
      }
      this.createButton(this.btntyle);

      this.message.position.set(220, 100);

      this.endgame.stage.addChild(this.message);
    }
  };

  createButton = (gameOverStyle) => {
    let playAgainBtn = new this.Text('Play Again', gameOverStyle);
    playAgainBtn.position.set(250, 200);

    playAgainBtn.interactive = true;
    playAgainBtn.buttonMode = true;
    playAgainBtn.on('pointerdown', this.onButtonClick);

    this.endgame.stage.addChild(playAgainBtn);
  };

  onButtonClick = () => {
    document.body.removeChild(this.endgame.view);
    this.refreshPage();
  };

  refreshPage = () => {
    window.location.reload();
  };
}

export default EndGame;
