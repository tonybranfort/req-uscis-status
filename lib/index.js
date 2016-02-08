var request = require('request');
var cheerio = require('cheerio');

var uscis_post_url = 'https://egov.uscis.gov/casestatus/mycasestatus.do'; 

var selectors = { 
  err: '#formErrorMessages',
  statusShort: '.main-content-sec .main-row .current-status-sec',
  statusLong: '.main-content-sec .main-row .appointment-sec .rows'
};

var q = -1; 

function scrapeStatus(receiptNumber, callback) {
  var statusObj = {
    errHtml: undefined, 
    statusShortHtml: undefined, 
    statusShortText: undefined, 
    statusLongHtml: undefined, 
    statusLongText: undefined
  }; 

  request.post(
    {
    url:uscis_post_url, 
    "rejectUnauthorized": false,  // this should be replaced with uscis site cert
    form: {appReceiptNum:receiptNumber}}, 
    function(err,httpResponse,body){
      if(err) {
        callback(err); 
      }

      $ = cheerio.load(body);

      if ($(selectors.err).children().length > 0) {
        var errHtml = cleanText($(selectors.err).html());
        statusObj.errHtml = errHtml; 
      } else { 
        var statusShortHtml = cleanText($(selectors.statusShort).html()); 
        var statusShortText = cleanText($(selectors.statusShort).text()); 

        var statusLongHtml = cleanText($(selectors.statusLong).html()); 
        var statusLongText = cleanText($(selectors.statusLong).text()); 

        statusObj.statusShortHtml = statusShortHtml; 
        statusObj.statusShortText = statusShortText; 
        statusObj.statusLongHtml = statusLongHtml; 
        statusObj.statusLongText = statusLongText; 

      }

      q = q > -1 ? q-- : -1; 

      return callback(err, statusObj); 

    });
}

function cleanText(text) {
  // http://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
  try {
    // remove the returns, new line breaks & tabs
    var b = text.replace(/\r|\n|\t/g,"");
    b = b.replace(/\s+/g,' ').trim();   // remove duplicate spaces
    b = b.replace(/\+$/,'').trim();  // remove '+' from end of string
    b = b ? b : text;
    return b; 
  }catch (e) {
    return text; // don't fail if can't clean it
  }
}

function getStatus(receiptNumber, callback) {
  if(isValidRcptNbr(receiptNumber)) {
    q++; 
    setTimeout(
      function() {
        scrapeStatus(receiptNumber, callback);
      }, q*250);  
  } else { 
    var err = "ERROR: Receipt number must be 13 digits";
    return callback(err); 
  }

}

function isValidRcptNbr(receiptNumber) {
  var isValid = receiptNumber.length === 13; 
  return isValid; 
}

module.exports = {
  getStatus : getStatus, 
};

