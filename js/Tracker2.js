function Tracker()
{
    Tracker.prototype.initialize = function(aConstructorParams)
    {
        Tracker.INSTANCE = this;
        this.mConstructorParams = aConstructorParams;
        this.mEnvironment = aConstructorParams.environment;
        this.mPortalId = aConstructorParams.portalId;
        this.mUserId = null;
        this.mApiUrl = "";

        switch(this.mEnvironment){
            case "Dev":
                this.mApiUrl = 'https://devplatform.gamecloudnetwork.com/';
                break;
            case "Stage":
                this.mApiUrl = 'https://stgplatform.gamecloudnetwork.com/';
                break;
            case "Pre-Prod":
                this.mApiUrl = 'https://preplatform.gamecloudnetwork.com/';
                break;
            case "Prod":
                this.mApiUrl = '//platform.gamecloudnetwork.com/';
                break;
            default :
                this.mApiUrl = '//devplatform.gamecloudnetwork.com/';
        }
        //Try to get a tracker id
        this.setUserId();
        if (this.mUserId) {
            ga('create', this.mConstructorParams.trackingId, { 'userId': this.mUserId });
        } else {
            ga('create', this.mConstructorParams.trackingId, this.mConstructorParams.trackingUrl);
        }
    };

    Tracker.prototype.setUserId = function(token)
    {
        var val = this.readCookie();
        if (token) {
            if (token != val) {
                this.createCookie(token);
                val = token;
            }
        }
        if (!val) {
            this.mUserId = this.generateTrackingId();
            this.createCookie(this.mUserId);
        } else {
            this.mUserId = val;
        }
    };
    
    Tracker.prototype.generateTrackingId = function()
    {
        return this.mPortalId + new Date().getTime().toString(16) + Math.floor(Math.random()* 1000000);
    };
    
    Tracker.prototype.createCookie = function(value, days) {
        var name = Tracker.COOKIENAME;
        var date = new Date();
        days = days ? days: 365;
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
        document.cookie = name+"="+value+expires+"; path=/; domain=.gamecloudnetwork.com;";
    };

    Tracker.prototype.readCookie = function() {
        var name = Tracker.COOKIENAME;
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    Tracker.prototype.eraseCookie = function() {
        createCookie("" , -1);
    };

    Tracker.prototype.trackEvent = function(aCategory, aAction, aLabel, aCustomVars)
    {
        if (this.mEnvironment == 'Prod') {
            var aVars = {'dimension1':this.mPortalId, 'title':aCategory};

            if(this.mUserId){
                aVars.dimension5 = this.mUserId;
            }

            if(aCustomVars){
                for(var key in aCustomVars){
                    aVars[key] = aCustomVars[key];
                }
            }
            aVars["portal"] = this.mPortalId;

            if (aCategory == 'Ad') {
                aVars["ad_showed"] = aAction == "Displayed" ? 1 : 0;
                aVars["ad_size"] = aLabel.replace(",", "x").replace(" ", "").replace("[","").replace("]","");
            }

            if(Tracker.ENABLED_EVENT_CATEGORIES.hasOwnProperty(aCategory.toUpperCase())){
                this.logEvent(aCategory, aAction, aLabel, aVars);
            }

            ga('send', 'event', aCategory, aAction, aLabel, aVars);
        }
    };

    Tracker.prototype.trackPage = function(aUrl, aTitle, aCustomVars)
    {
        if (this.mEnvironment == 'Prod') {
            var aVars = { 'page': aUrl, 'title': aTitle, 'dimension1':this.mPortalId };

            if(this.mUserId){
                aVars.dimension5 = this.mUserId;
            }

            if(aCustomVars){
                for(var key in aCustomVars){
                    aVars[key] = aCustomVars[key];
                }
            }

            ga('send', 'pageview', aVars);
        }
    };

    Tracker.prototype.logEvent = function(aCategory, aAction, aLabel, aVars){
        
        if (this.mEnvironment == 'Prod') {
            aVars.category = aCategory;
            aVars.action = aAction;
            aVars.label = aLabel;

            var aUrl = this.mApiUrl + "log/event";

            var aXHR = $.ajax({
                url:aUrl,
                type:"GET",
                dataType: 'json',
                data:aVars
            });
        }
    };
}
Tracker.INSTANCE;
Tracker.COOKIENAME = "gcnping";

Tracker.ENABLED_EVENT_CATEGORIES = {
    AD:1
};