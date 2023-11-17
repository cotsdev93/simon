const round = document.getElementById("round");
const simonButtons = document.querySelectorAll("button");
const startButton = document.querySelector(".startButton");
const consola = document.querySelector(".consola");

class Simon {
  constructor(simonButtons, startButton, round) {
    this.round = 0;
    this.userPosition = 0;
    this.totalRounds = 10;
    this.sequence = [];
    this.speed = 1000;
    this.blockedButtons = true;
    this.buttons = Array.from(simonButtons);
    this.display = {
      startButton,
      round,
    };
    this.errorSound = new Audio("./assets/sounds/error.wav");
    this.buttonsSounds = [
      new Audio("./assets/sounds/1.mp3"),
      new Audio("./assets/sounds/2.mp3"),
      new Audio("./assets/sounds/3.mp3"),
      new Audio("./assets/sounds/4.mp3"),
    ];
  }

  init() {
    this.display.startButton.onclick = () => this.startGame();
  }

  startGame() {
    this.display.startButton.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = this.createSequence();
    this.buttons.forEach((element, i) => {
      element.classList.remove("winner");
      element.onclick = () => this.buttonClick(i);
    });
    this.showSequence();
  }

  updateRound(value) {
    this.round = value;
    this.display.round.textContent = `${this.round}`;
  }

  createSequence() {
    return Array.from({ length: this.totalRounds }, () =>
      this.getRandomColor()
    );
  }

  getRandomColor() {
    return Math.floor(Math.random() * 4);
  }

  buttonClick(value) {
    !this.blockedButtons && this.validateChosenColor(value);
  }

  validateChosenColor(value) {
    if (this.sequence[this.userPosition] === value) {
      this.buttonsSounds[value].play();
      if (this.round === this.userPosition) {
        this.updateRound(this.round + 1);
        this.speed /= 1.02;
        this.isGameOver();
      } else {
        this.userPosition++;
      }
    } else {
      this.gameLost();
    }
  }

  isGameOver() {
    if (this.round === this.totalRound) {
      this.gameWon();
    } else {
      this.userPosition = 0;
      this.showSequence();
    }
  }

  showSequence() {
    this.blockedButtons = true;
    let sequenceIndex = 0;
    let timer = setInterval(() => {
      const button = this.buttons[this.sequence[sequenceIndex]];
      const sound = this.buttonsSounds[this.sequence[sequenceIndex]];
      if (sound) {
        sound.play();
      }
      this.toggleButtonStyle(button);
      setTimeout(() => this.toggleButtonStyle(button), this.speed / 3);
      sequenceIndex++;
      if (sequenceIndex > this.round) {
        this.blockedButtons = false;
        clearInterval(timer);
      }
    }, this.speed);
  }

  toggleButtonStyle(button) {
    // simonButtons.forEach((boton) => {
    //   boton.addEventListener("click", () => {
    //     console.log("funciona");
    //   });
    // });
    if (button) {
      button.classList.toggle("active");
    } else {
      this.gameWon();
    }
  }

  gameLost() {
    this.errorSound.play();
    this.display.startButton.disabled = false;
    this.blockedButtons = true;
    simon.init();
  }

  gameWon() {
    if (!this.blockedButtons) {
      this.display.startButton.disabled = true;
      this.blockedButtons = true;
      consola.classList.add("winner");
      this.updateRound("🏆");
      setTimeout(() => {
        this.restartGame();
      }, 3000);
    }
  }

  restartGame() {
    console.log("Juego reiniciado");
    this.updateRound("0");
    consola.classList.remove("winner");
    this.userPosition = 0;
    this.sequence = this.createSequence();
    this.speed = 1000;
    simon.init()
    this.display.startButton.disabled = false
  }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();

simonButtons.forEach((boton) => {
  boton.addEventListener("click", () => {
    setTimeout(() => {
      boton.classList.remove("active");
    }, 500);
  });
});
