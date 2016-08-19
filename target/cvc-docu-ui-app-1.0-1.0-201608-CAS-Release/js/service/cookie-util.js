/**
 * Created by l058374 on 31/05/2016.
 */
docUpload.service('CookieUtility',[function(){

    var CookieUtility = this;
    CookieUtility.currentCookie = '';

    CookieUtility.getUniqueID = function getUniqueID() {
        var d = new Date();
        var i = d.getTime();
        var unitId = i.toString();
        var randomNumber = Math.floor(Math.random() * 1000000);
        unitId = unitId.toString() + randomNumber.toString();
        CookieUtility.currentCookie = unitId;
        return unitId;
    };

    CookieUtility.getCookie = function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    CookieUtility.setCookies = function setCookies(expires){
        if(!CookieUtility.getCookie('XSRF_TOKEN')) {
            var cookie = 'XSRF_TOKEN' + "=" + CookieUtility.getUniqueID() + ";";
            if (expires) {
                // If it's a date
                if (expires instanceof Date) {
                    // If it isn't a valid date
                    if (isNaN(expires.getTime()))
                        expires = new Date();
                } else
                    expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
                cookie += "expires=" + expires.toGMTString() + ";";
            }
            cookie += "path=/" + ";";
            cookie += "secure,";
            document.cookie = cookie;
        }
    };


    CookieUtility.deleteCookies = function deleteCookies( name ) {
        document.cookie = name + '='+CookieUtility.currentCookie+'; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    CookieUtility.deleteCookies("XSRF_TOKEN");
    CookieUtility.setCookies();

}]);