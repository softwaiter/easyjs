/*
 *  Encrypt Class
 */
if (!ejs.encrypt) {
    ejs.encrypt = {
        encryptEmail: function (email) {
            if (!ejs.utils.isNullOrUndefined(email)) {
                var eStr = email.toString();
                var result = "";
                var pos = eStr.indexOf("@");
                if (pos >= 0) {
                    var emailName = eStr.substring(0, pos);
                    var emailSuffix = eStr.substring(pos);
                    for (var i = 0; i < emailName.length; i++) {
                        if (i > 0 && i < emailName.length - 1) {
                            result += "*";
                        } else {
                            result += emailName[i];
                        }
                    }
                    result += emailSuffix;
                } else {
                    result = eStr;
                }
                return result;
            }
            return "";
        },

        encryptMobile: function (mobile) {
            if (!ejs.utils.isNullOrUndefined(mobile)) {
                var mStr = mobile.toString();
                var result = "";
                for (var i = 0; i < mStr.length; i++) {
                    if (i > 2 && i < mStr.length - 3) {
                        result += "*";
                    } else {
                        result += mStr[i];
                    }
                }
                return result;
            }
            return "";
        }
    }
}