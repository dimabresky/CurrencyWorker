/**
* @version: 1.0
* @author: dimabresky https://github.com/dimabresky
* @copyright: Copyright (c) 2017 dimabresky. Все права защищены.
* @license: MIT лицензия http://www.opensource.org/licenses/mit-license.php
*/

(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {

        define([], function () {
            return (root.IDBWrapper = factory());
        });

    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CurrencyWorker = factory();
    }
})(this, function () {

    'use strict'

    /**
     * Конструктор для работы с валютой
     * @param       {Object} parameters
     * @constructor
     */
    function CurrencyWorker (parameters) {

        var courseDecimal = 5;

        var courses = {};

        var iso = '', iiso = '';

        var commissions = typeof parameters.commissions === 'object' ? parameters.commissions : {};

        var currencyList = {};

        var _this = this;

        if (
            typeof parameters.baseIso !== 'string' ||
            !/^[A-Z]{3}$/.test(parameters.baseIso)
        ) {
            throw new Error('Неверно указан ISO базовой валюты');
        }

        if (typeof parameters.course !== 'object') {
            throw new Error('Необходимо указать объект курсов валют по \
            отношению к указанной базовой валюте');
        }

        // курс базовой валюты по отношению к себе самой
        parameters.course[parameters.baseIso] = 1;

        for (iso in parameters.course) {

            if (
              /^[A-Z]{3}$/.test(iso) &&
              parameters.course.hasOwnProperty(iso)
            ) {

                courses[parameters.baseIso + '/' + iso] = Number(parameters.course[iso]).toFixed(courseDecimal);

                if (typeof commissions[iso] === 'number' && commissions[iso] > 0) {
                    courses[parameters.baseIso + '/' + iso] = Number(parameters.course[iso] + (parameters.course[iso]*commissions/100)).toFixed(courseDecimal);
                }

                currencyList[iso] = true;

            }

        }

        // расчет кросскурсов
        for (var key in courses) {

          iso = key.split('/')[1];

          if (iso === parameters.baseIso) {
            continue;
          }

          for (var key2 in courses) {

            iiso = key2.split('/')[1];

            courses[iso + '/' + iiso] = Number(parameters.course[iiso]/parameters.course[iso]).toFixed(courseDecimal);

          }

        }

        this.convert = function (value, inIso, outIso) {

            value = Number(value) || 0;

            if (value < 0) {
                throw new Error('Значение для конвертации должно быть >= 0');
            }

            if (
              typeof currencyList[inIso] !== 'boolean' ||
              currencyList[inIso] !== true
             ) {
              throw new Error('Неизвестный iso входной валюты');
            }

            if (outIso) {
              if (
                typeof currencyList[outIso] !== 'boolean' ||
                currencyList[outIso] !== true
               ) {
                throw new Error('Неизвестный iso выходной валюты');
              }
            } else {
              outIso = parameters.baseIso;
            }

            return {
              value: Number(value/courses[inIso + '/' + outIso]).toFixed(courseDecimal),
              iso: outIso,
              toString: function () {
                return _this.format(
                    this.value,
                    this.iso,
                    parameters.decimal,
                    parameters.decpoint,
                    parameters.ssep
                )
              }
            }

        };

        /**
         * Форматирование цены
         * @param  {Number} value
         * @param  {String} iso
         * @param  {Number} decimal количество десятичных знаков
         * @param  {String} decpoint разделитель целой и дробной части
         * @param  {String} ssep разделитель разрядов числа
         * @return {String}
         */
        this.format = function (value, iso, decimal, decpoint, ssep) {

            var result = Number(value).toFixed(decimal || 2).toString().split('.');

            decpoint = decpoint || '.';

            ssep = ssep || ' ';

            iso = iso || '';

            result[0] = result[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1"+ssep);

            return result[0] + decpoint + result[1] + ' ' + iso;
        };

    }

    return CurrencyWorker;
});
