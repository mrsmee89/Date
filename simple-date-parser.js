var parseDate = (function(){
	var props = {
		monthMap: {
			1: "January",
			2: "February",
			3: "March",
			4: "April",
			5: "May",
			6: "June",
			7: "July",
			8: "August",
			9: "September",
			10: "October",
			11: "November",
			12: "December"
		},
		dayMap: {
			1: "Sunday",
			2: "Monday",
			3: "Tuesday",
			4: "Wednesday",
			5: "Thursday",
			6: "Friday",
			7: "Saturday"
		},
		ADD: 'a',
		SUBTRACT: 's'
	}
	var methods = {
		utils: {
			isString: function(s){
				return s && typeof s === 'string';
			},
			inArray: function(haystack, needle){
				if(!haystack || !haystack.length || typeof needle == "undefined") {
					return -1;
				}
				if(typeof Array.prototype.indexOf !== 'undefined') {
					return haystack.indexOf(needle);
				}
				for (var i = 0; i < haystack.length; i++) {
					if(haystack[i] == needle) {
						return i;
					}
				};
				return -1;
			},
			inObject: function(obj, needle){
				if(!obj || typeof needle == "undefined") {
					return -1;
				}
				var iter = 0;
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop) && typeof needle != 'undefined' && needle.toLowerCase() == obj[prop].toLowerCase()) {
						return iter;
					}
					iter ++;
				}
				return -1;
			}
		},
		getDayNameFromNum: function(num){
			return props.dayMap[num + 1];
		},
		getMonthNameFromNum: function(num){
			return props.monthMap[num + 1];
		},
		getMonthNumFromName: function(monthName){
			if(!monthName) {
				return -1;
			}
			return methods.utils.getKeyFromValue(monthName) - 1;
		},
		getDayOfMonthPlusSuffix: function(dayOfMonth){
			var sfx = "";
			if(dayOfMonth ==  1 || dayOfMonth ==  21 || dayOfMonth ==  31) {
				sfx = "st";
			}else if(dayOfMonth ==  2 || dayOfMonth ==  22) {
				sfx = "nd";
			}else if(dayOfMonth ==  3 || dayOfMonth ==  23) {
				sfx = "rd";
			}else {
				sfx = "th";
			}
			return dayOfMonth + sfx;
		},
		addOrSubtractDate: function(dateObj, amount, type, addOrSubtract){
			var amount = amount || 0; // prevent invalid date being returned if amount is undefined
			dateObj.setInitialTime();
			if(type == Date.SECOND) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setTime(dateObj.getTime() - (amount * 1000));
				}else {
					return dateObj.setTime(dateObj.getTime() + (amount * 1000));
				}
			}else if(type == Date.MINUTE) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setTime(dateObj.getTime() - (amount * 1000 * 60));
				}else {
					return dateObj.setTime(dateObj.getTime() + (amount * 1000 * 60));
				}
			}else if(type == Date.HOUR) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setTime(dateObj.getTime() - (amount * 1000 * 60 * 60));
				}else {
					return dateObj.setTime(dateObj.getTime() + (amount * 1000 * 60 * 60));
				}
			}else if(type == Date.DAY) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setTime(dateObj.getTime() - (amount * 1000 * 60 * 60 * 24));
				}else {
					return dateObj.setTime(dateObj.getTime() + (amount * 1000 * 60 * 60 * 24));
				}
			}else if(type == Date.WEEK) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setTime(dateObj.getTime() - (amount * 1000 * 60 * 60 * 24 * 7));
				}else {
					return dateObj.setTime(dateObj.getTime() + (amount * 1000 * 60 * 60 * 24 * 7));
				}
			}else if(type == Date.MONTH) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setMonth(dateObj.getMonth() - amount);
				}else {
					return dateObj.setMonth(dateObj.getMonth() + amount);
				}
			}else if(type == Date.YEAR) {
				if(addOrSubtract == props.SUBTRACT) {
					return dateObj.setFullYear(dateObj.getFullYear() - amount);
				}else {
					return dateObj.setFullYear(dateObj.getFullYear() + amount);
				}
			}
			return dateObj;
		}
	};
	Date.prototype.format = function(str){
		if(typeof str == 'undefined') {
			return this;
		}
		var formatter = str.split(/[\d\sa-zA-Z]/gi),
			dividerArr = str.match(/[^a-zA-Z\d\s:]/gi),
			divider = dividerArr && dividerArr.length ? dividerArr[0] : " ",
			dayPlace,
			monthPlace,
			yearPlace,
			datePlace,
			dateBuilder = [],
			parsedDate,
			named = false;
			console.log(formatter);
			if(formatter.length == 1) {
				formatter = str.split(" ");
				named = true;
			}
		for (var i = 0; i < formatter.length; i++) {
			formatter[i] = formatter[i].toLowerCase();
			if(formatter[i].charAt(0) == 'd' && formatter[i] != 'date') {
				dayPlace = i;
				dateBuilder.push("d");
				if(named) {
					formatter[i] = methods.getDayNameFromNum(this.getDay());
				}else {
					formatter[i] = this.getDay();
				}
			}else if(formatter[i].charAt(0) == 'm') {
				monthPlace = i;
				dateBuilder.push("m");
				if(named) {
					formatter[i] = methods.getMonthNameFromNum(this.getMonth());
				}else {
					formatter[i] = this.getMonth();
				}
			}else if(formatter[i].charAt(0) == 'y') {
				yearPlace = i;
				dateBuilder.push("y");
				formatter[i] = this.getFullYear();
			}else if(formatter[i] == 'date') {
				yearPlace = i;
				dateBuilder.push("date");
				if(named) {
					formatter[i] = methods.getDayOfMonthPlusSuffix(this.getDate());
				}else {
					formatter[i] = this.getDate();
				}
			}else {
				// datePlace = i;
				// dateBuilder.push("dt");
			}
		};
		// console.log(formatter);
		return formatter.join(divider);
		this.year = this.getFullYear();
		this.month = this.getMonth();
		this.dayOfMonth = this.getDate();
		this.monthName = methods.getMonthNameFromNum(this.month);
		this.dayName = methods.getDayNameFromNum(this.getDay());
		dateBuilder[methods.utils.inArray(dateBuilder, "d")] = this.dayName;
		dateBuilder[methods.utils.inArray(dateBuilder, "dt")] = methods.getDayOfMonthPlusSuffix(this.dayOfMonth);
		dateBuilder[methods.utils.inArray(dateBuilder, "m")] = this.monthName;
		dateBuilder[methods.utils.inArray(dateBuilder, "y")] = this.year;
		return dateBuilder.join(" ");
	}
	Date.YEAR = "y";
	Date.MONTH = "m";
	Date.WEEK = "w";
	Date.DAY = "d";
	Date.HOUR = "h";
	Date.MINUTE = "min";
	Date.SECOND = "s";
	Date.utils = {};
	Date.now = Date.now || function(){// normalize date.now
		return new Date().getTime();
	};
	Date.prototype.setInitialTime =  function(){
		if(typeof this.initialTime == 'undefined') { //ensure this only gets set once
			this.initialTime = this.getTime();
		}
	}
	Date.prototype.utils = {};
	Date.prototype.plus = Date.prototype.add = function(amount, type){
		return methods.addOrSubtractDate(this, amount, type, props.ADD);
	};
	Date.prototype.subtract = Date.prototype.minus = function(amount, type){
		return methods.addOrSubtractDate(this, amount, type, props.SUBTRACT);
	};
	Date.prototype.now = function(){
		this.setTime(Date.now());
		return this;
	};
	Date.prototype.goToBeginningOf = function(type, autoBeginDay){
		this.setInitialTime();
		if(type == Date.DAY) {
			this.setHours(0,0,0,0);
		}else if(type == Date.WEEK) {
			while(this.getDay() != 0 ) {
				this.setDate(this.getDate()-1);
			}
		}else if(type == Date.MONTH) {
			this.setDate(1);
		}else if(type == Date.YEAR) {
			this.setFullYear(this.getFullYear(),0,1);
			this.setHours(0,0,0,0);
		}
		if(autoBeginDay) {
			this.setHours(0,0,0,0);
		}
		return this;
	}
	Date.prototype.goToEndOf = function(type, autoBeginDay){
		this.setInitialTime();
		if(type == Date.DAY) {
			this.setHours(11,59,59,59);
			
		}else if(type == Date.WEEK) {
			while(this.getDay() != 6) {
				this.setDate(this.getDate()+1);
			}
		}else if(type == Date.MONTH) {
			this.setMonth(this.getMonth() + 1);
			this.setDate(0);
		}else if(type == Date.YEAR) {
			this.setFullYear(this.getFullYear(), 11);
			this.goToEndOf(Date.MONTH);
			this.setHours(0,0,0,0);
		}
		if(autoBeginDay) {
			this.setHours(11,59,59,59);
		}
		return this;
	}
	Date.prototype.plusSeconds = Date.prototype.addSeconds = function(amount){
		this.plus(amount, Date.SECOND);
		return this;
	};
	Date.prototype.plusMinutes = Date.prototype.addMinutes = function(amount){
		this.plus(amount, Date.MINUTE);
		return this;
	};
	Date.prototype.plusHours = Date.prototype.addHours = function(amount){
		this.plus(amount, Date.HOUR);
		return this;
	};
	Date.prototype.plusDays = Date.prototype.addDays = function(amount){
		this.plus(amount, Date.DAY);
		return this;
	};
	Date.prototype.plusWeeks = Date.prototype.addWeeks = function(amount){
		this.plus(amount, Date.WEEK);
		return this;
	};
	Date.prototype.plusMonths = Date.prototype.addMonths = function(amount){
		this.plus(amount, Date.MONTH);
		return this;
	};
	Date.prototype.plusYears = Date.prototype.addYears = function(amount){
		this.plus(amount, Date.YEAR);
		return this;
	};
	Date.prototype.minusSeconds = Date.prototype.subtractSeconds = function(amount){
		this.subtract(amount, Date.SECOND);
		return this;
	};
	Date.prototype.minusMinutes = Date.prototype.subtractMinutes = function(amount){
		this.subtract(amount, Date.MINUTE);
		return this;
	};
	Date.prototype.minusHours = Date.prototype.subtractHours = function(amount){
		this.subtract(amount, Date.HOUR);
		return this;
	};
	Date.prototype.minusDays = Date.prototype.subtractDays = function(amount){
		this.subtract(amount, Date.DAY);
		return this;
	};
	Date.prototype.minusWeeks = Date.prototype.subtractWeeks = function(amount){
		this.subtract(amount, Date.WEEK);
		return this;
	};
	Date.prototype.minusMonths = Date.prototype.subtractMonths = function(amount){
		this.subtract(amount, Date.MONTH);
		return this;
	};
	Date.prototype.minusYears = Date.prototype.subtractYears = function(amount){
		this.subtract(amount, Date.YEAR);
		return this;
	};
	Date.prototype.reset = Date.prototype.end = function(){
		this.setTime(this.initialTime || this.getTime());
		return this;
	};
	Date.prototype.next = function(type){
		var token;
		if(type == Date.DAY) {
			this.addDays(1).goToBeginningOf(Date.DAY);
		}else if(type == Date.WEEK) {
			this.goToBeginningOf(Date.WEEK, true).addWeeks(1);
		}else if(type == Date.MONTH) {
			this.goToBeginningOf(Date.MONTH, true).addMonths(1);
		}else if(type == Date.YEAR) {
			this.goToBeginningOf(Date.YEAR, true).plusYears(1);
		}else if(methods.utils.isString(type) && (token = methods.utils.inObject(props.dayMap, type)) > -1) { 
			if(this.getDay() == token) {
				this.nextWeek();
			}
			this.goToBeginningOf(Date.DAY);
			while(this.getDay() != token) {
				this.setDate(this.getDate() + 1);
			}
		}else if(methods.utils.isString(type) && (token = methods.utils.inObject(props.monthMap, type)) > -1) { 
			if(token <= this.getMonth()) {
				this.nextYear();
			}
			this.goToBeginningOf(Date.MONTH, true).setMonth(token);
		}
		return this;
	}
	Date.prototype.last = function(type){
		if(type == Date.DAY) {
			this.minusDays(1).goToBeginningOf(Date.DAY);
		}else if(type == Date.WEEK) {
			this.goToBeginningOf(Date.WEEK, true).subtractWeeks(1);
		}else if(type == Date.MONTH) {
			this.goToBeginningOf(Date.MONTH, true).subtractMonths(1);
		}else if(type == Date.YEAR) {
			this.goToBeginningOf(Date.YEAR, true).minusYears(1);
		}else if(methods.utils.isString(type) && (token = methods.utils.inObject(props.dayMap, type)) > -1) { 
			if(this.getDay() == token) {
				this.lastWeek().goToEndOf(Date.WEEK);
			}
			this.goToBeginningOf(Date.DAY);
			while(this.getDay() != token) {
				this.setDate(this.getDate() - 1);
			}
		}else if(methods.utils.isString(type) && (token = methods.utils.inObject(props.monthMap, type)) > -1) { 
			if(token >= this.getMonth()) {
				this.lastYear();
			}
			this.goToBeginningOf(Date.MONTH, true).setMonth(token);
		}

		return this;
	}
	Date.prototype.today = function(){
		this.now().goToBeginningOf(Date.DAY);
		return this;
	};
	Date.prototype.yesterday = function(){
		return this.last(Date.DAY);
	};
	Date.prototype.lastWeek = function(){
		return this.last(Date.WEEK);
	};
	Date.prototype.lastMonth = function(){
		return this.last(Date.MONTH);
	};
	Date.prototype.lastYear = function(){
		return this.last(Date.YEAR);
	};
	Date.prototype.tommorow = function(){
		return this.next(Date.DAY);
	};
	Date.prototype.nextWeek = function(){
		return this.next(Date.WEEK);
	};
	Date.prototype.nextMonth = function(){
		return this.next(Date.MONTH);
	};
	Date.prototype.nextYear = function(){
		return this.next(Date.YEAR);
	};
	Date.prototype.day = function(){
		return methods.getDayNameFromNum(this.getDay());
	};
	Date.prototype.month = function(){
		return methods.getMonthNameFromNum(this.getMonth());
	};
	Date.prototype.year = function(){
		return this.getFullYear();
	};
	Date.prototype.dayOfMonth = function(){
		return methods.getDayOfMonthPlusSuffix(this.getDate());
	};
	for(var key in methods) {
		if(methods.hasOwnProperty(key)) {
			Date.prototype.utils[key] = methods[key];
			Date.utils[key] = methods[key];
		}
	}
})();
var d = new Date();