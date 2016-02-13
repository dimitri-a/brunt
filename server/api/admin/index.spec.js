'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var leadCtrlStub = {
  index: 'leadCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var leadIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './lead.controller': leadCtrlStub
});

describe('Lead API Router:', function() {

  it('should return an express router instance', function() {
    leadIndex.should.equal(routerStub);
  });

  describe('GET /api/leads', function() {

    it('should route to lead.controller.index', function() {
      routerStub.get
        .withArgs('/', 'leadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
