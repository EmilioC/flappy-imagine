import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { ComponentFixture } from '@angular/core/testing';
import { ComponentsModule } from './components/components.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ComponentsModule]
})
export class HomePage implements OnInit {

  container_height!: number;
  container_width!: number;

  gameStarted: boolean = false;
  gameOver: boolean = false;

  score: number = 0;
  musicActive: boolean = false;
  audio = new Audio('/assets/music/ionic-bird-track.MP3');

  bird_height: number = 38;
  bird_width: number = 43;
  bird_position: number = 300;

  obstacle_height: number = 0;
  obstacle_width: number = 52;
  obstacle_position: number = this.container_width;
  obstacle_gap: number = 200;

  bird_interval!: ReturnType<typeof setTimeout>;//Variable mantiene la caida
  obstacle_interval!: ReturnType<typeof setTimeout>;//Ejecutar contínuamente la función de generar obstáculos

  constructor(
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.setContainerSize();
    this.bird_interval = setInterval(this.addGravity.bind(this), 24);
    this.obstacle_interval = setInterval(this.moveObstacle.bind(this), 24);
  }

  // ====== Tamaño del contenedor del juego ======
  setContainerSize() {
    this.container_height = this.platform.height();
    this.container_width = this.platform.width() < 576 ? this.platform.width() : 576;
  }

  // ===== Iniciar juego ====
  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;

  }

  // ===== Añadir gravedad ====
  addGravity() {
    let gravity = 4.5;
    if (this.gameStarted) this.bird_position += gravity;

  }

  // ===== Saltar ====
  jump() {

    if (this.gameStarted) {
      if (this.bird_position < this.bird_height) this.bird_position = 0;
      else this.bird_position -= 90;
    };
  }

  // ===== Mover obstáculos hacia adelante ====
  // DO: Pendiente revisar velocidad en escritorio es igual a móvil
  moveObstacle() {
    let speed: number = 6;
    if (this.container_width < 400) speed = 4 //verificamos si es móvil para reducir la velocidad
    //Verificamos si el juego ha comenzado

    if (this.gameStarted && this.obstacle_position >= -this.obstacle_width) this.obstacle_position -= speed;
    else {
      this.resetObstaclePosition();
      if (this.gameStarted) this.score++;
    }
    this.checkCollision();
  }

  // ===== Mover obstáculos hacia adelante ====
  setGameOver() {
    this.gameStarted = false;
    this.gameOver = true;
    this.bird_position = 300;
  }

  // ===== Chequear si ocurre una colisión ====
  checkCollision() {
    let top_obstacle_collision = this.bird_position >= 0 && this.bird_position < this.obstacle_height;
    let bottom_obstacle_collision = this.bird_position >=
      this.container_height - (this.container_height - this.obstacle_gap - this.obstacle_height) - this.bird_height;
    //40 indica la altura del suelo
    let floor_collision = (this.bird_position + 40) >= this.container_height;
    if (floor_collision) this.setGameOver();

    if (this.obstacle_position >= this.obstacle_width
      && this.obstacle_position <= this.obstacle_width + 80
      && (top_obstacle_collision || bottom_obstacle_collision)) { this.setGameOver() }
  }


  // ===== Resetear la posición del obstáculo ====
  resetObstaclePosition() {
    this.obstacle_position = this.container_width;
    //Dar altura aleatoria a cada obstáculo
    this.obstacle_height = Math.floor(Math.random() * (this.container_height - this.obstacle_gap));
  }

  playMusic() {
    this.musicActive = !this.musicActive;

    if (this.musicActive) {
      this.audio.play();
      this.audio.loop;
    }
    else this.audio.pause()
  }
}
