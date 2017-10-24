!function (currencyWorker, QUnit) {

    'use strict';

    var currentTestName = '';

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

    var result;

    QUnit.module('CurrencyWorker тест');

    currentTestName = "Конвертация 1 USD BYN. Должно получиться 1.90 BYN";

    result = currencyWorker.convert(1, 'USD').toString();

    if (result === '1.90 BYN') {
        QUnit.test( currentTestName, function( assert ) {
            assert.ok( true, "выполнен (результат: "+result+")" );
        });
    } else {
        QUnit.test( currentTestName, function( assert ) {
            assert.notOk( true, "не выполнен (результат: "+result+")");
        });
    }

}(CurrencyWorker, QUnit);
