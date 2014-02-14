var EventEmitter = require("events").EventEmitter;

describe("mosca.Stats", function() {
  var instance;
  var server;

  beforeEach(function() {
    server = new EventEmitter();
    instance = new mosca.Stats();
    instance.wire(server);
  });

  describe("counting connected clients", function() {

    it("should start from zero", function() {
      expect(instance.connectedClients).to.eql(0);
    });

    it("should increase when clientConnected is emitted", function() {
      server.emit("clientConnected");
      expect(instance.connectedClients).to.eql(1);
    });

    it("should decrease when clientDisconnected is emitted", function() {
      server.emit("clientConnected");
      server.emit("clientDisconnected");
      expect(instance.connectedClients).to.eql(0);
    });

    it("should grow past 1", function() {
      server.emit("clientConnected");
      server.emit("clientConnected");
      server.emit("clientConnected");
      expect(instance.connectedClients).to.eql(3);
    });
  });

  describe("counting published messages", function() {

    it("should start from zero", function() {
      expect(instance.publishedMessages).to.eql(0);
    });

    it("should increase when published is emitted", function() {
      server.emit("published");
      expect(instance.publishedMessages).to.eql(1);
    });

    it("should increase when published is emitted (two)", function() {
      server.emit("published");
      server.emit("published");
      expect(instance.publishedMessages).to.eql(2);
    });
  });

  describe("on closed", function() {
    ["clientConnected", "clientDisconnected", "published"].forEach(function(event) {
      it("should remove the " + event + " event from the server", function() {
        server.emit("closed");
        expect(server.listeners(event).length).to.eql(0);
      });
    });
  });
});
