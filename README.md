# CurrencyWorker
Конструктор для работы с валютой

```javascript
var currencyWorker = new CurrencyWorker({
    baseIso: 'BYN',
    course: {
        "USD": 1.9,
        "EUR": 2.1,
        "RUB": 0.03
    },
    decimal: 2,
    decpoint: '.',
    ssep: ''
});

// конвертация 1 USD в EUR
console.log(currencyWorker.convert(1, 'USD', 'EUR').toString());

// возвращает значение курса USD к RUB
console.log(currencyWorker.course('USD/RUB'));
```

Протестировано с Chrome 61.0.x.x
