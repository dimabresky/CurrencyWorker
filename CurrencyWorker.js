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
        root.CurrencyConverter = factory();
    }
})(this, function () {

    'use strict'

    /**
     * Конструктор для работы с валютой
     * @param       {Object} parameters
     * @constructor
     */
    function CurrencyWorker (parameters) {

        var courses = {};

        var commissions = typeof parameters.commissions === 'object' ? parameters.commissions : {};

        if (
            typeof parameters.baseIso !== 'string' ||
            !'/^[A-Z]{3}$/'.test(parameters.baseIso)
        ) {
            throw new Error('Неверно указан ISO базовой валюты');
        }

        if (typeof parameters.course !== 'object') {
            throw new Error('Необходимо указать объект курсов валют по \
            отношению к указанной базовой валюте');
        }

        for (var iso in parameters.course) {

            if (parameters.course.hasOwnProperty(iso)) {

                courses[parameters.baseIso + '/' + iso] = parameters.course[iso];

                if (typeof commissions[iso] === 'number' && commissions[iso] > 0) {
                    courses[parameters.baseIso + '/' + iso] = parameters.course[iso] + (parameters.course[iso]*commissions/100);
                }

            }

        }

        this.convert = function (value, inIso, outIso) {

            value = value || 0;

            if (value <= 0) {
                throw new Error('Значение для конвертации должно быть больше 0');
            }

        };

        /**
         * Форматирование цены
         * @param  {Number} value
         * @param  {String} iso
         * @param  {Number} decimal
         * @param  {String} decpoint
         * @param  {String} ssep
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
});
