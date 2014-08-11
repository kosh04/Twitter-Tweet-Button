var via = '';
var related = '';


var noVia = 0;
if (localStorage["tweet_novia"]) noVia = localStorage["tweet_novia"];
if (noVia == 0) { 

    var iframeSrc = $("iframe.twitter-share-button").url();

    if (iframeSrc) {
        var url =  iframeSrc.fparam('url');
        // alert('url is ' + url + ' decoded: ' + decodeURIComponent(url));
        var counturl =  iframeSrc.fparam('counturl');
        if (typeof counturl === 'undefined') counturl = url;
        // alert('NEW counturl is ' + counturl + ' decoded: ' + decodeURIComponent(counturl));
        // alert('doc.URL:' + document.URL);
        if ( decodeURIComponent(counturl) == document.URL) {
            // alert('url matches!');
            var buttonVia = iframeSrc.fparam('via');
            // alert('bVia: ' + buttonVia);
            var buttonRelated = iframeSrc.fparam('related');
            // alert('bRelated: ' + buttonRelated);
            if (buttonVia) via = buttonVia;
            if (buttonRelated) related = buttonRelated;
        }
    }
    
}

// alert('via: ' + via + ' related: ' + related);

var tweetbutton = {
  "via": via,
  "related": related
};

chrome.extension.connect().postMessage(tweetbutton);
