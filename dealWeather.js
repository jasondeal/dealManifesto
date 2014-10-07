
/**
    * Weather application. Intended to give qualitative, not quantitative, weather.
    * @author Jason Deal <dealja@gmail.com>
    * @version 0.0.1
    * @namespace
    * @name weather
    * @description
    * @todo Make _updateContent take an array, not just a single name value pair DONE
    * @todo Make sure everything in ret has a getter and a setter, so externals can access those DONE KINDA
    * @todo  Make getJsonP take in a callback parameter so the callback can be set at runtime instead of static files (which is used for testing, to save bandwidth) DONE
    * @todo  Make setZip able to reset the location and call a new zip code location, resetting all the location vars. DONE
    * @todo  Remove config, remove dependency on it. DONE
    * @todo Remove the updateContent calls from updateWeatherFromWU, and make those updateContent calls happen in a separate method
    * @todo Make updateWeatherFromWU inspecific to WU, allowing me to use other data sources 
    * @todo Make a separate function that somehow specifies the data structure of WU data separately, so when this is invoked, you can specify other sources and other structures
    * @todo Make a master content updating thing that does the DOM writes and then calls update content on the data elements (especially so we can write logic around what is said)
    * @todo Add in error checks anywhere the data cannot be trusted (getting weather json, getting config), make sure defaults are specified
    * @see {@link fe.nfshost.com}
*/
var dealWeather = function() {
	var 
		ret = {
			sCity : ""
			, sState : ""
			, sTemperature : ""
			, sZip : ""
			, nDaysForecast : 4
			, aForecastTitles : []
			, aForecastTexts : []
			, sDataURL : "http://api.wunderground.com/api/cb6ecd95cb631c51/geolookup/conditions/forecast/q/"
		}
		, getCity = function() {
			return ret.sCity;
		}
		, getState = function() {
			return ret.sState;
		}
		, getZip = function() {
			return ret.sZip;
		}
		, getDaysForecast = function() {
			return ret.nDaysForecast;
		}
		, getTemperature = function() {
			return ret.sTemperature;
		}
		, setWeatherByZip = function(zipCode) {
			//see todo
			var urlWithZip = ret.sDataURL + zipCode + ".json";
			_getJsonP(urlWithZip, "dealWeather.updateWeatherFromWU");
		}
		, updateWeatherFromWU = function(weatherData) {
			var aForecastData = weatherData.forecast.txt_forecast.forecastday
				, i=0
				, l=ret.nDaysForecast
				, contentToUpdate = []
				, j=0
			;
			ret.sCity = weatherData.location.city;
			ret.sState = weatherData.location.state;
			ret.sZip = weatherData.location.zip;
			ret.sTemperature = weatherData.current_observation.temp_f;
			//call _updateContent for all elements, since they're now correctly populated
			for (; i<l; i++) {
				//Add 1 every time the json is referenced, since that data starts at 1 instead of 0
				ret.aForecastTitles[i] = aForecastData[i+1]['title'];
				contentToUpdate[j] = {id : i+"day", content : ret.aForecastTitles[i]};
				j++;
				ret.aForecastTexts[i] = aForecastData[i+1]['fcttext'];
				contentToUpdate[j] = {id : i+"temp", content : ret.aForecastTexts[i]};
				j++;
			}
			contentToUpdate[j] = {id : "temp", content : ret.sTemperature};
			j++;
			contentToUpdate[j] = {id : "city", content : ret.sCity};
			j++;
			contentToUpdate[j] = {id : "state", content : ret.sState};
			j++;
			_updateContent(contentToUpdate);
			console.log(ret.sZip);
		}
		//Gets jsonp, which executes a callback function. Callback param is optional because my test data includes a hardcoded callback. Live data should specify a callback.
		, _getJsonP = function(url, callback) {
			var headID = document.getElementsByTagName("head")[0]
				, scriptID = document.createElement("script")
				, fullURL = "";
			scriptID.type = "text/javascript";
			if (callback != null) {
				fullURL = url+"?callback="+callback;
			}
			else{
				fullURL = url;
			}
			scriptID.src = fullURL;
			headID.appendChild(scriptID);
		}
		, init = function(days) {
			ret.nDaysForecast = days;
			//test data on local
			_getJsonP("weatherData", null);
			//live data
			//ret.setWeatherByZip("autoip")
			return ret;
		}
		, _updateContent = function(id, content) {
			console.log(id);
			console.log(content);
			if (typeof id === "object" && id instanceof Array) {
				for (var i = 0; i<id.length;i++){
					_updateContent(id[i].id, id[i].content);
				}
				return;
			}
			var el = document.getElementById(id);
			return (el && typeof el.innerHTML !== 'undefined') ? el.innerHTML = content : undefined;
		}
	;
	return {
		updateWeatherFromWU : updateWeatherFromWU
		, setWeatherByZip : setWeatherByZip
		, init : init
	};

}();
