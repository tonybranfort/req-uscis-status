# req-uscis-status
[![NPM version](http://img.shields.io/npm/v/req-uscis-status.svg)](https://www.npmjs.org/package/req-uscis-status)
[![Build Status via Travis CI](https://travis-ci.org/tonybranfort/req-uscis-status.svg?branch=master)](https://travis-ci.org/tonybranfort/req-uscis-status)
[![Coverage Status](https://coveralls.io/repos/tonybranfort/req-uscis-status/badge.svg?branch=master&service=github)](https://coveralls.io/github/tonybranfort/req-uscis-status?branch=master)

Module to get US Citizenship and Immigration Services (USCIS) case status from the [USCIS Case Status Online](https://egov.uscis.gov/casestatus/landing.do) web page given a USCIS Receipt Number.

This is simply a screen scrape from the USCIS case status website after posting a USCIS Receipt Number.  This module and the support of it is not in any way affiliated with USCIS.  Any changes that they make to the case status web site could and likely would impact this module.  

There is just one exposed function with this module : ```getStatus(receiptNumber, callback)```.  The callback is called with an error, if any, and the result.  The result is one object : 
```javascript
  var statusObj = {
    errHtml: undefined,  // error, if any, on the uscis page after posting receipt number
    statusShortHtml: undefined,  
    statusShortText: undefined, 
    statusLongHtml: undefined, 
    statusLongText: undefined
  }; 

```

Each of the 5 properties in the status object returned are 'cleaned' of return lines, new line breaks, tabs and duplicate spaces. 

Install with ```npm install req-uscis-status```.  

## Examples

```javascript
var rus = require('req-uscis-status');

rus.getStatus('MSC1591345031', 
  function(err, statusObject) { 
    console.log(statusObject);

    // { 
    //  errHtml: undefined,
    //  statusShortHtml: '<strong>Your Current Status:</strong> Card Was Delivered To Me By The Post Office <span class="appointment-sec-show" tabindex="-1" title="View Case Status Full Description">+</span>',
    //  statusShortText: 'Your Current Status: Card Was Delivered To Me By The Post Office',
    //  statusLongHtml: '<h1>Card Was Delivered To Me By The Post Office</h1> <p>On November 12, 2015, the Post Office delivered your new card for Receipt Number MSC1591345031, to the address that you gave us. The tracking number assigned is 9205592338400179142710. You can use your tracking number at <a href="https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=9205592338400179142710" target="_blank">www.USPS.com</a> in the Quick Tools Tracking section. If you move, go to <a href="https://egov.uscis.gov/coa/displayCOAForm.do" target="_blank">www.uscis.gov/addresschange</a> to give us your new mailing address.</p>',
    //  statusLongText: 'Card Was Delivered To Me By The Post Office On November 12, 2015, the Post Office delivered your new card for Receipt Number MSC1591345031, to the address that you gave us. The tracking number assigned is 9205592338400179142710. You can use your tracking number at www.USPS.com in the Quick Tools Tracking section. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.' 
    // }
  }
);


```
