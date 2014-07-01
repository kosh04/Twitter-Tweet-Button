var via = '';
var related = '';

// alert('via: ' + via + ' related: ' + related);

var tweetbutton = {
  "via": via,
  "related": related
};

chrome.extension.connect().postMessage(tweetbutton);