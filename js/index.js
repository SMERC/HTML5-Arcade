var E_Target = {};
E_Target.COMPUTER = "WEB";
E_Target.ANDROID = "ANDROID";
E_Target.IOS = "IOS";

var E_Platform = {};
E_Platform.CHROME = "CHROME";
E_Platform.SAFARI = "SAFARI";
E_Platform.FIREFOX = "FIREFOX";
E_Platform.INTERNETEXPORER = "INTERNETEXPLORER";
E_Platform.INTERNETEXPORERLEGACY = "INTERNETEXPORERLEGACY";
E_Platform.SAFARI_IOS = "SAFARI_IOS";
E_Platform.CHROME_IOS = "CHROME_IOS";
E_Platform.DEFAULTBROWSER_ANDROID = "DEFAULTBROWSER_ANDROID";
E_Platform.CHROME_ANDROID = "CHROME_ANDROID";
E_Platform.OTHER = "OTHER";

var E_Device = {};
E_Device.IPAD = "IPAD";
E_Device.IPHONE = "IPHONE";
E_Device.ANDROID = "ANDROID";
E_Device.COMPUTER = "COMPUTER";

var E_Audio = {};
E_Audio.STANDARD = "standard";
E_Audio.WEBKIT = "webkit";
E_Audio.NONE = "none";

var Environment = {};
Environment.LOGGING = true;
Environment.TARGET = "";
Environment.DEVICE = "";
Environment.PLATFORM = "";
Environment.AUDIO = "";
Environment.VERSION = -1;
Environment.IS_MOBILEDEVICE = true;
Environment.IS_WEBKIT = true;

Environment.getAndroidVersion = function(){ var ua = navigator.userAgent; if( ua.indexOf("Android") >= 0 ){ var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));  return androidversion; } }
Environment.getIOSVersion = function()
{
    var ua = navigator.userAgent;
    var uaindex = ua.indexOf( 'OS ' );
    return ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
}

Environment.isStockAndroidBrowser = function(){var nua = navigator.userAgent; return (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1) };
Environment.getQueryString = function(key,default_){if(default_==null){default_=""}key=key.replace(/[[]/,"[").replace(/[]]/,"]");var regex=new RegExp("[?&]"+key+"=([^&#]*)");var qs=regex.exec(window.location.href);if(qs==null){return default_}else{return qs[1]}}
Environment.getAudioExtension = function(){var a=document.createElement('audio');mSoundFormats={};mSoundFormats.mp3=!!(a.canPlayType&&a.canPlayType('audio/mpeg;').replace(/no/,''));mSoundFormats.vorbis=!!(a.canPlayType&&a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/,''));mSoundFormats.wav=!!(a.canPlayType&&a.canPlayType('audio/wav; codecs="1"').replace(/no/,''));mSoundFormats.aac=!!(a.canPlayType&&a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/,''));if(mSoundFormats.mp3){return".mp3"}if(mSoundFormats.vorbis){return".ogg"}return".mp3"}

Environment.init = function()
{
    if(MobileBrowserDetect.any() == true)
    {
        Environment.IS_MOBILEDEVICE = true;

        if(MobileBrowserDetect.Android() == true){
            Environment.VERSION = Environment.getAndroidVersion();
            Environment.TARGET = E_Target.ANDROID;
        }
        if(MobileBrowserDetect.iOS() == true){
            Environment.VERSION = Environment.getIOSVersion();
            Environment.TARGET = E_Target.IOS;
        }
    }else{
        Environment.IS_MOBILEDEVICE = false;
        Environment.TARGET = E_Target.COMPUTER;
        Environment.VERSION = parseFloat(BrowserDetect.version);
    }

    var aBrowser = BrowserDetect.browser;
    switch(Environment.TARGET)
    {
        case E_Target.IOS:

            if(BrowserDetect.browser == "Safari")
            {
                Environment.AUDIO = E_Audio.WEBKIT;
                Environment.PLATFORM = E_Platform.SAFARI_IOS;
            }else{
                Environment.AUDIO = E_Audio.STANDARD;
                Environment.PLATFORM = E_Platform.CHROME_IOS;
            }

            if(MobileBrowserDetect.iPad() == true)
            {
                Environment.DEVICE = E_Device.IPAD;
            }else{
                Environment.DEVICE = E_Device.IPHONE;
            }
            break;

        case E_Target.ANDROID:
            if(BrowserDetect.browser == "Chrome" && Environment.VERSION >= 32 && Environment.isStockAndroidBrowser() == false){
                Environment.AUDIO = E_Audio.WEBKIT;
            }else{
                Environment.AUDIO = E_Audio.STANDARD;
            }
            Environment.VERSION = Environment.getAndroidVersion();
            Environment.DEVICE = E_Device.ANDROID;

            if(Environment.isStockAndroidBrowser())
            {
                Environment.PLATFORM = E_Platform.DEFAULTBROWSER_ANDROID;
                Environment.IS_WEBKIT = true;
            }else{
                Environment.PLATFORM = E_Platform.CHROME_ANDROID;
                Environment.IS_WEBKIT = true;
            }

            break;

        case E_Target.COMPUTER:
            Environment.DEVICE = E_Device.COMPUTER;
            if(aBrowser == "Chrome"){ Environment.PLATFORM = E_Platform.CHROME; Environment.IS_WEBKIT = true; }
            if(aBrowser == "Safari" ){ Environment.PLATFORM = E_Platform.SAFARI; Environment.IS_WEBKIT = true;}
            if(aBrowser == "Firefox" ){ Environment.PLATFORM = E_Platform.FIREFOX; Environment.IS_WEBKIT = false; }
            if(aBrowser == "Explorer" || aBrowser == "MSIE")
            {
                Environment.IS_WEBKIT = false;
                if(Environment.VERSION < 9) {
                    Environment.PLATFORM = E_Platform.INTERNETEXPORERLEGACY;
                }else{
                    Environment.PLATFORM = E_Platform.INTERNETEXPORER;
                }
            }
            if( Environment.PLATFORM == E_Platform.INTERNETEXPORERLEGACY ){ Environment.AUDIO = E_Audio.NONE; }else{ Environment.AUDIO = E_Audio.STANDARD; }
            break;
    }
}

Environment.LOG = function( aValue ){ if( Environment.LOGGING == true ){ console.log(aValue); }else{  } }

var BrowserDetect = { init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(data){for(var i=0;i<data.length;i++){var dataString=data[i].string;var dataProp=data[i].prop;this.versionSearchString=data[i].versionSearch||data[i].identity;if(dataString){if(dataString.indexOf(data[i].subString)!=-1)return data[i].identity}else if(dataProp)return data[i].identity}},searchVersion:function(dataString){var index=dataString.indexOf(this.versionSearchString);if(index==-1)return;return parseFloat(dataString.substring(index+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone"},{string:navigator.platform,subString:"Linux",identity:"Linux"}] };
BrowserDetect.init();
var MobileBrowserDetect = { Android:function(){return navigator.userAgent.match(/Android/i)?true:false},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)?true:false},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)?true:false},iPad:function(){return navigator.userAgent.match(/iPad/i)?true:false},Windows:function(){return navigator.userAgent.match(/IEMobile/i)?true:false},any:function(){return(MobileBrowserDetect.Android()||MobileBrowserDetect.BlackBerry()||MobileBrowserDetect.iOS()||MobileBrowserDetect.Windows())} };
Environment.init();


Tools = {}

// get the distance between two points
Tools.getDistance = function(aPoint1, aPoint2)
{
    var xs = 0;
    var ys = 0;
    xs = aPoint2.x - aPoint1.x;
    xs = xs * xs;
    ys = aPoint2.y - aPoint1.y;
    ys = ys * ys;
    return Math.sqrt( xs + ys );
};

// This function will remove a mouse press if the person moves their finger or mouse too much.
// This plays nicely with iscroll so that if they drag the list it won't click when they release on a div
Tools.addTouchEvents = function(aDomObject, aOnStationaryClick, aData)
{
	if(Environment.TARGET == E_Target.COMPUTER){ aDomObject.mousedown( onMeasureInteraction ); }else{ aDomObject.bind('touchstart', onMeasureInteraction); }

	function onMeasureInteraction(e)
	{
		if(Environment.TARGET == E_Target.COMPUTER)
		{
			var aStartPosition = {x:e.pageX, y:e.pageY}
			$(this).mouseup(function(a){
				aOnStationaryClick($(this), aData, a);
				$(this).off('mouseup');
			});
	
			 $(this).mousemove(function(b){
			 	var aEndPosition = {x:b.pageX, y:b.pageY}
			 	if(Tools.getDistance(aStartPosition, aEndPosition) > 20){
			 		$(this).off('mousemove');
			 		$(this).off('mouseup');
			 	}
			 	
			 });
		}else{ 
			var aStartPosition = {x:e.originalEvent.touches[0].pageX, y:e.originalEvent.touches[0].pageY}
			$(this).on('touchend', function(a)
			{
				aOnStationaryClick($(this), aData);
				$(this).off('touchend');
			});
	
			 $(this).on('touchmove', function(b)
			 {
			 	
			 	var aEndPosition = {x:b.originalEvent.touches[0].pageX, y:b.originalEvent.touches[0].pageY}
			 	if(Tools.getDistance(aStartPosition, aEndPosition) > 20)
			 	{
			 		$(this).off('touchmove');
			 		$(this).off('touchend');
			 	}
			 	
			});
		}
	}
};

Tools.removeTouchEvents = function(aDomObject){
    if(Environment.TARGET == E_Target.COMPUTER){ aDomObject.off('mousedown'); }else{ aDomObject.unbind('touchstart'); }
};

Tools.getQueryString = function(key, default_) {
    if (default_ == null) {
      default_ = ""
    }
    key = key.replace(/[[]/, "[").replace(/[]]/, "]");
    var regex = new RegExp("[?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null) {
      var qs2 = regex.exec(Tools.getParentUrl());
      return qs2 == null ? default_ : qs2[1];
    } else {
      return qs[1]
    }
};

Tools.getParentUrl = function() {
	var url = (window.location != window.parent.location) ? document.referrer: document.location;
	return url;
};


/**
 * Created by Diego on 8/14/14.
 */

$(document).ready(function() {

    var mFirstGameLoad = false;

    function onGameSelected(aElement) {
        //Write the correct portal param on the url
        var game_url = aElement.attr('game-url').replace("portal=osom", "portal=" + Tools.getQueryString('portal', 'osom'));
        return loadIframe(game_url);
    }
    
    function loadIframe(game_url) {
    	var aGameIframe = $('#game_iframe');
    	aGameIframe.attr("src", game_url);

        $(document).scrollTop(0);

        if (mFirstGameLoad == false) {
            mFirstGameLoad = true;
            aGameIframe.animate({height: 640}, 500);
        }
    }
    
    function loadLogo() {
        var portal = Tools.getQueryString('portal', '@demo');
        var logo_path = 'https://s3.amazonaws.com/gcn-static-assets/uploaded/assets/portal/' + portal + '.png';
        document.getElementById('portal-logo').src = logo_path;
    }
    
    /**
     * Load a game if there are query params present.
     */
    function loadGame() {
    	var game_id = Tools.getQueryString('game_id', '');
    	if (game_id != "") {
    	    //Get any url game
    	    var url = $($('.selectable_game')[0]).attr('game-url')
    	    	.replace("portal=osom", "portal=" + Tools.getQueryString('portal', 'osom'))
    	    	.replace(/Game\/.*/, "Game/" + game_id);
    	    	
    	    var level_id = Tools.getQueryString('level_id', '');
    	    if (level_id) {
    	    	url += '/Level/' + level_id;
    	    }
    	    loadIframe(url);
    	}
    }

    var aSelectableGames = $('.selectable_game');

    aSelectableGames.each(function() {
        Tools.addTouchEvents($(this), onGameSelected, $(this));
    });
    
    loadLogo();
    loadGame();

});
