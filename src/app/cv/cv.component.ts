import { Component, OnInit } from '@angular/core';

export interface Contact {
  name: string;
  date: string;
  img: string;
}

export interface Work {
  title: string;
  organization: string;
  date: string;
}

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss'],
})
export class CvComponent implements OnInit {
  contacts: Contact[] = [
    {
      name: 'Phone',
      date: '+3 8 (050) 50 603 95',
      img: 'phone',
    },
    {
      name: 'Email',
      date: 'Kapushchaknazar@gmail.com',
      img: 'email',
    },
    {
      name: 'City',
      date: 'Ivano-Frankivsk',
      img: 'home',
    },
    {
      name: 'LinkedIn',
      date: 'https://www.linkedin.com/in/nazarkapushchak/',
      img: 'link',
    },
    {
      name: 'GitHub',
      date: 'www.github.com/Marshalleye',
      img: 'link',
    },
  ];

  works: Work[] = [
    {
      title: 'Sales Manager',
      organization: 'IT Shared Space (IF IT Cluster)',
      date: 'November 2020 - August 2021',
    },
    {
      title: 'Sales Manager',
      organization: 'Zozoola',
      date: 'January 2019 - September 2020',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
