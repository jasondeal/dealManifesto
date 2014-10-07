var dateTime = function() {
	var 
        now = function() {
			var _now = new Date()
				, _aDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
				, _aMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"]
				, ret = {
					full: _now
					, hours: _now.getHours()
					, minutes: _now.getMinutes()
					, year: _now.getFullYear()
					, month: _now.getMonth()
					, day: _now.getDay()
				}
			;
            ret.formattedHours = function() {
				var nHours = ret.hours;
				return nHours && nHours > 12 ? nHours-12 : nHours == 0 ? 12 : nHours
			}();
			ret.formattedMinutes = function() {
				var nMinutes = ret.minutes;
				return nMinutes && nMinutes < 10 ? '0' + nMinutes : nMinutes;
			}();
			ret.formattedTime = function() {
				var nHours = ret.hours
					, nRetHours = ret.formattedHours
					, nRetMinutes  = ret.formattedMinutes
				;
				return nRetHours + ":" + nRetMinutes + " " + (ret.hours < 12 ? 'AM' : 'PM')
			}();
			ret.formattedDay = function() {
				return _aDays[ret.day];
			}();
			ret.formattedMonth = function() {
				return _aMonths[ret.month];
			}();
			ret.formattedDate = function() {
				return ret.formattedDay + ', '+ ret.formattedMonth + ' ' + ret.full.getDate() + ' ' + ret.year
			}();
			return ret;
		}()
		, init = function() {
			_updateContent('date', now.formattedDate);
			_updateContent('time', now.formattedTime);
		}
		, _updateContent = function(id, content) {
			var el = document.getElementById(id);
			return (el && typeof el.innerHTML !== 'undefined') ? el.innerHTML = content : undefined;
		}
	;
	return {
		now: now
		, init: init
	};
}();
