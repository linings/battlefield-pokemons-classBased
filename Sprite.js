class Sprite {
  constructor(
    animation,
    name,
    ability,
    move1,
    move2,
    move3,
    move4,
    speed,
    specialDefence,
    specialAttack,
    defence,
    attack,
    HP
  ) {
    this.animation = animation;
    this.name = name;
    this.ability = ability;
    this.move1 = move1;
    this.move2 = move2;
    this.move3 = move3;
    this.move4 = move4;
    this.speed = speed;
    this.specialDefence = specialDefence;
    this.specialAttack = specialAttack;
    this.defence = defence;
    this.attack = attack;
    this.HP = HP;
  }
}

export default Sprite;
