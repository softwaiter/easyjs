/*
 *	Date Class
 *
 *	Required: date.js
 */
if (!ejs.date) {
    ejs.date = {
        getDate: function (date) {
            if (this.isValidDate(date)) {
                return date;
            }

            var value = date;
            if (typeof (value) == "string") {
                value = value.replace("-", "/");
            }
            var dateValue = Date.parse(value);
            return new Date(dateValue);
        },

        isValidDate: function (date) {
            return (date instanceof Date) && !isNaN(date);
        },

        toString: function (date, format) {
            date = ejs.date.getDate(date);
            if (this.isValidDate(date)) {
                if (format == null || format == "" ||
                    typeof (format) == "undefined") {
                    return date.toLocaleString();
                }

                var result = format;
                var Week = ['日', '一', '二', '三', '四', '五', '六'];

                var fullYear = date.getFullYear();
                var year = date.getYear();
                result = result.replace(/yyyy|YYYY/, fullYear);
                result = result.replace(/yy|YY/, (year % 100) > 9 ? (year % 100).toString() : '0' + (year % 100));

                var month = date.getMonth();
                result = result.replace(/MM/, month > 9 ? month.toString() : '0' + month);
                result = result.replace(/M/g, month);

                var weekNum = date.getDay();
                result = result.replace(/w|W/g, Week[weekNum]);

                var day = date.getDate();
                result = result.replace(/dd|DD/, day > 9 ? day.toString() : '0' + day);
                result = result.replace(/d|D/g, day);

                var hours = date.getHours();
                result = result.replace(/hh|HH/, hours > 9 ? hours.toString() : '0' + hours);
                result = result.replace(/h|H/g, hours);

                var minutes = date.getMinutes();
                result = result.replace(/mm/, minutes > 9 ? minutes.toString() : '0' + minutes);
                result = result.replace(/m/g, minutes);

                var seconds = date.getSeconds();
                result = result.replace(/ss|SS/, seconds > 9 ? seconds.toString() : '0' + seconds);
                result = result.replace(/s|S/g, seconds);

                return result;
            }

            return null;
        },

        getMonthLastday: function (year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        },

        isLeapYear: function (date) {
            date = ejs.date.getDate(date);
            var year = date.getYear();
            return ejs.getMonthLastday(year, 2) == 28 ? false : true;
        },

        between: function (date1, date2, mode) {
            date1 = ejs.date.getDate(date1);
            date2 = ejs.date.getDate(date2);
            var diff = 0;
            var interval = 86400000;
            if (mode == "s") {  //秒
                diff = (date2 - date1) / 1000;
            } else if (mode == "n") {   //分钟
                diff = (date2 - date1) / 60000;
            } else if (mode == "h") {   //小时
                diff = (date2 - date1) / 3600000;
            } else if (mode == "d") {   //天
                diff = (date2 - date1) / 86400000;
            } else if (mode == "w") {   //周
                diff = (date2 - date1) / (86400000 * 7);
            } else if (mode == "m") {   //月
                diff = (date2.getMonth() + 1) + ((date2.getFullYear() - date1.getFullYear()) * 12) - (date1.getMonth() + 1);
            } else if (mode == "y") {   //年
                diff = date2.getFullYear() - date1.getFullYear();
            }
            return Math.abs(diff);
        },

        addYear: function (date, year) {
            if (this.isValidDate(date)) {
                if (typeof (year) == "number" && Math.abs(year) == year) {
                    return new Date((date.getFullYear() + year), date.getMonth(),
                        date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                }
            }
            return date;
        },

        addMonth: function (date, month) {
            if (this.isValidDate(date)) {
                if (typeof (month) == "number" && Math.abs(month) == month) {
                    return new Date(date.getFullYear(), (date.getMonth()) + month,
                        date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                }
            }
            return date;
        },

        addDay: function (date, day) {
            if (this.isValidDate(date)) {
                if (typeof (day) == "number" && Math.abs(day) == day) {
                    return new Date(Date.parse(date) + (86400000 * day));
                }
            }
            return date;
        },

        addHour: function (date, hour) {
            if (this.isValidDate(date)) {
                if (typeof (hour) == "number" && Math.abs(hour) == hour) {
                    return new Date(Date.parse(date) + (3600000 * hour));
                }
            }
            return date;
        },

        addMinute: function (date, minute) {
            if (this.isValidDate(date)) {
                if (typeof (minute) == "number" && Math.abs(minute) == minute) {
                    return new Date(Date.parse(date) + (60000 * minute));
                }
            }
            return date;
        },

        addSecond: function (date, second) {
            if (this.isValidDate(date)) {
                if (typeof (second) == "number" && Math.abs(second) == second) {
                    return new Date(Date.parse(date) + (1000 * second));
                }
            }
            return date;
        }
    }
}