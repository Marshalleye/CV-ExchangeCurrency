import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrencyExchangeService } from './currency-exchange.service';

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.scss'],
})
export class CurrencyExchangeComponent implements OnInit {
  startApiDate: any;
  toggle: boolean | any;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(public currencyService: CurrencyExchangeService) {}

  ngOnInit(): void {
    this.startApiDate = this.currencyService.fetchStartVal();
    this.currencyService.getChart();
  }
}
