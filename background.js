/**
 * Performs an XMLHttpRequest to Twitter's API to get search results.
 * @param callback Function If the response from fetching url has a
 *     HTTP status of 200, this function is called with a JSON decoded
 *     response.  Otherwise, this function is called with null.
 */
function fetchTwitterFeed(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = xhr.responseText;
                console.log('initial resp: ' + response);
                var re = /^twttr\.receiveCount\(([^\)]+)\)$/;
                //var re = /(receive)/;
                if (response.match(re)) {
                    response = response.replace(re, "$1");
                    console.log('new resp: ' + response);
                } else {
                    console.log('no match');
                }
                var data = JSON.parse(response);
                callback(data);
            } else {
                callback(null);
            }
        }
    };
    // Note that any URL fetched here must be matched by a permission in
    // the manifest.json file!
    xhr.open('GET', url, true);
    xhr.send();
}

// Called when the url of a tab changes.
function updateTweetCount(tab) {
    if (tab.url.match(/^http/)) {
        var noCount = 0;
        if (localStorage["tweet_nocount"]) {
            noCount = localStorage["tweet_nocount"];
        }
        if (noCount == 0) {
            fetchTwitterFeed('http://urls.api.twitter.com/1/urls/count.json?url=' + tab.url, getCount);
        }
        var noVia = 0;
        var tweetNoVia = localStorage["tweet_novia"];
        if ((tweetNoVia === undefined) || (tweetNoVia == null) || (
            tweetNoVia == "undefined")) noVia = 1;
        if (localStorage["tweet_novia"]) noVia = localStorage["tweet_novia"];
        if (noVia == 0) {
            chrome.browserAction.onClicked.addListener(function(tab) {
                fetchButtonParams(tab);
            });
        } else {
            chrome.browserAction.onClicked.addListener(function(tab) {
                tweetPop(tab, '', '');
            });
        }
    } else {
        chrome.browserAction.setBadgeText({
            text: ''
        });
    }
}

function getCount(data) {
    console.log('getCount: started');
//	var twttr = {};
//	twttr.receiveCount = function(data) {
//		chrome.browserAction.setBadgeText({text: data.count.toString()});
//	};
    chrome.browserAction.setBadgeText({
        text: data.count.toString()
    });
}
//var twttr = {};
//twttr.receiveCount = function(data) {
//	console.log('receiveCount: started');
//	chrome.browserAction.setBadgeText({text: data.count.toString()});
//};

function fetchButtonParams(tab) {
    chrome.tabs.executeScript(null, {
        file: "jquery-1.6.4.min.js"
    }, function() {
        chrome.tabs.executeScript(null, {
            file: "jquery.url.js"
        }, function() {
            chrome.tabs.executeScript(null, {
                file: "content_script.js"
            });
        });
    });
}

function fetchButtonParamsNoVia(tab) {
    chrome.tabs.executeScript(null, {
        file: "content_script2.js"
    });
}
chrome.extension.onConnect.addListener(function(port) {
    var tab = port.sender.tab;
    // This will get called by the content script we execute in
    // the tab as a result of the user pressing the browser action.
    port.onMessage.addListener(function(button) {
        tweetPop(tab, button.via, button.related);
    });
});

function tweetPop(tab, via, related) {
    var W = 550,
        d = 450;
    var Z = screen.height;
    var Y = screen.width;
    var X = Math.round((Y / 2) - (W / 2));
    var c = 0;
    if (related != "") related = related + ',';
    var V = 'http://twitter.com/share' + "?" + "count=horizontal&text=" +
        encodeURIComponent(tab.title) + "&url=" + encodeURIComponent(tab.url) +
        "&related=" + encodeURIComponent(related) +
        "mthacks:Creator%20of%20Tweet%20Button%20Chrome%20Extension";
    if (via) V = V + "&via=" + encodeURIComponent(via);
    if (Z > d) {
        c = Math.round((Z / 2) - (d / 2))
    }
    var a = window.open(V, "twitter_tweet", "left=" + X + ",top=" + c + ",width=" + W + ",height=" + d + ",personalbar=no,toolbar=no,scrollbars=yes,location=yes,resizable=yes");
    if (a) {
        a.focus()
    } else {
        window.location.href = V
    }
}

// Wire up the listener.
//  chrome.extension.onRequest.addListener(onRequest);
chrome.tabs.onSelectionChanged.addListener(function() {
    chrome.windows.getCurrent(function(window) {
        if (window.type == 'normal') {
            chrome.tabs.getSelected(null, function(tab) {
                updateTweetCount(tab);
            });
        }
    });
});
chrome.tabs.onUpdated.addListener(function() {
    chrome.windows.getCurrent(function(window) {
        if (window.type == 'normal') {
            chrome.tabs.getSelected(null, function(tab) {
                updateTweetCount(tab);
            });
        }
    });
});
chrome.windows.onFocusChanged.addListener(function(windowId) {
    chrome.windows.getCurrent(function(window) {
        if (window.type == 'normal') {
            chrome.tabs.getSelected(null, function(tab) {
                updateTweetCount(tab);
            });
        }
    });
});
