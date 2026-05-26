import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Developer {
  name: string;
  username: string;
  role: string;
  avatar: string;
  github: string;
}

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developers.html',
  styleUrl: './developers.css',
})
export class Developers {
  developers: Developer[] = [
    {
      name: 'André Rodrigues',
      username: 'oandredev',
      role: 'Desenvolvedor Full Stack',
      avatar: 'https://github.com/oandredev.png',
      github: 'https://github.com/oandredev',
    },
    {
      name: 'Fernanda Souza',
      username: 'souzafe13',
      role: 'Desenvolvedora Full Stack',
      avatar: 'https://github.com/souzafe13.png',
      github: 'https://github.com/souzafe13',
    },
    {
      name: 'André Coutinho',
      username: 'AndreCoutinhom',
      role: 'Desenvolvedor Full Stack',
      avatar: 'https://github.com/AndreCoutinhom.png',
      github: 'https://github.com/AndreCoutinhom',
    },
  ];
}
