var rus = require('../lib/index.js');
var expect = require('expect.js'); 

var rcptNbrValid = 'MSC1591345031';  // VALID
var rcptNbrNotFound = 'EAC1602350717';  // valid rcpt # digits, but not found
var rcptNbrInvalid = 'MKY1602350717';  // valid rcpt # digits, but invalid

describe('req-uscis-status',function(){
  this.timeout(10000);

  it('should return a successful status object if given a valid MSC receipt number',function(done){
    rus.getStatus(rcptNbrValid, function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).to.be(undefined); 
      expect(statusObject.statusShortHtml).to.be('<strong>Your Current Status:</strong> Card Was Delivered To Me By The Post Office <span class="appointment-sec-show" tabindex="-1" title="View Case Status Full Description">+</span>');
      expect(statusObject.statusShortText).to.be('Your Current Status: Card Was Delivered To Me By The Post Office');
      expect(statusObject.statusLongHtml).to.be('<h1>Card Was Delivered To Me By The Post Office</h1> <p>On November 12, 2015, the Post Office delivered your new card for Receipt Number MSC1591345031, to the address that you gave us. The tracking number assigned is 9205592338400179142710. You can use your tracking number at <a href="https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=9205592338400179142710" target="_blank">www.USPS.com</a> in the Quick Tools Tracking section. If you move, go to <a href="https://egov.uscis.gov/coa/displayCOAForm.do" target="_blank">www.uscis.gov/addresschange</a> to give us your new mailing address.</p>');
      expect(statusObject.statusLongText).to.be('Card Was Delivered To Me By The Post Office On November 12, 2015, the Post Office delivered your new card for Receipt Number MSC1591345031, to the address that you gave us. The tracking number assigned is 9205592338400179142710. You can use your tracking number at www.USPS.com in the Quick Tools Tracking section. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.');
      done();  
    }); 
  }); 

  it('should return a successful status object if given a valid WAC receipt number',function(done){
    rus.getStatus('WAC1590171254', function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).to.be(undefined); 
      expect(statusObject.statusShortHtml).to.contain('Case Was Approved');
      expect(statusObject.statusShortText).to.contain('Case Was Approved');
      expect(statusObject.statusLongHtml).to.contain('we approved your Form I-130');
      expect(statusObject.statusLongText).to.contain('we approved your Form I-130');
      done();  
    }); 
  }); 

  it('should return a successful status object if given a valid EAC receipt number',function(done){
    rus.getStatus('EAC1525050507', function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).to.be(undefined); 
      expect(statusObject.statusShortHtml).to.contain('Fees Were Waived');
      expect(statusObject.statusShortText).to.contain('Fees Were Waived');
      expect(statusObject.statusLongHtml).to.contain('we received your case and waived the filing fee for your Form I-131');
      expect(statusObject.statusLongText).to.contain('we received your case and waived the filing fee for your Form I-131');
      done();  
    }); 
  }); 


  it('should return a successful status object if given a valid LIN receipt number',function(done){
    rus.getStatus('LIN1591146470', function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).to.be(undefined); 
      expect(statusObject.statusShortHtml).to.contain('Card Was Delivered To Me By The Post Office');
      expect(statusObject.statusShortText).to.contain('Card Was Delivered To Me By The Post Office');
      expect(statusObject.statusLongHtml).to.contain('the Post Office delivered your new card');
      expect(statusObject.statusLongText).to.contain('the Post Office delivered your new card');
      done();  
    }); 
  }); 


  it('should return a successful status object if given a valid IOE receipt number',function(done){
    rus.getStatus('IOE7117723058', function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).to.be(undefined); 
      expect(statusObject.statusShortHtml).to.contain('Card Was Delivered To Me By The Post Office');
      expect(statusObject.statusShortText).to.contain('Card Was Delivered To Me By The Post Office');
      expect(statusObject.statusLongHtml).to.contain('the Post Office delivered your new card for Receipt Number');
      expect(statusObject.statusLongText).to.contain('the Post Office delivered your new card for Receipt Number');
      done();  
    }); 
  }); 


  it('should return an error if the receipt number is not 13 digits',function(done){
    rus.getStatus('EAC123456789', function(err, statusObject) {
      expect(err).not.to.be(null);
      expect(statusObject).to.be(undefined);
      done();  
    }); 
  }); 


  it('should return an err in the status object given an unfound receipt number ',
    function(done){
    rus.getStatus(rcptNbrNotFound, function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).not.to.be(null); 
      expect(statusObject.errHtml).to.contain('does not recognize the receipt number entered'); 
      expect(statusObject.statusShortHtml).to.be(undefined);
      expect(statusObject.statusShortText).to.be(undefined);
      expect(statusObject.statusLongHtml).to.be(undefined);
      expect(statusObject.statusLongText).to.be(undefined);
      done();  
    }); 
  }); 

  it('should return an err in the status object given an invalid receipt number ',
    function(done){
    rus.getStatus(rcptNbrNotFound, function(err, statusObject) {
      expect(err).to.be(null);
      expect(statusObject.errHtml).not.to.be(null); 
      expect(statusObject.errHtml).to.contain('Validation Error'); 
      expect(statusObject.statusShortHtml).to.be(undefined);
      expect(statusObject.statusShortText).to.be(undefined);
      expect(statusObject.statusLongHtml).to.be(undefined);
      expect(statusObject.statusLongText).to.be(undefined);
      done();  
    }); 
  }); 

  it('should not allow more than 4 requests per second ',
    function(done){

    var startTime = new Date(); 
    rus.getStatus(rcptNbrValid, function(){}); 
    rus.getStatus(rcptNbrValid, function(){}); 
    rus.getStatus(rcptNbrValid, function(){}); 
    rus.getStatus(rcptNbrValid, function(){}); 
    rus.getStatus(rcptNbrValid, function(err, statusObject) {
      var endTime = new Date(); 
      var timeMs = endTime - startTime; 
      expect(timeMs).to.be.greaterThan(1000);
      done();  
    }); 
  }); 


});


