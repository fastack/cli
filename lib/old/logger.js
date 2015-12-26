var chalk = require('chalk')
  , prettyjson = require('prettyjson')
  , Table = require('cli-table')
  , events = require('events')
  , util = require('util')
  , moment = require('moment')
  ;

function Logger(config) {
  events.EventEmitter.call(this);
  this.chalk = chalk;
  this.config = config;
  this.messages = [];
  return this;
}

util.inherits(Logger, events.EventEmitter);

function messagePrefix() {
  var d = new Date();
  return chalk.cyan(d.getHours() + ':' + d.getMinutes() + ' ')
}

Logger.prototype.setStartTime = function(t) {
  this.startTime = t;
}

Logger.prototype.setPort = function(p) {
  this.serverPort = p;
}

Logger.prototype.start = function() {
  this.repaint();
  this.on('repaint', function() {
    this.repaint();
  });

  setInterval(this.repaint.bind(this), 3000);
}

Logger.prototype.repaint = function() {
  process.stdout.write('\033c') // clear terminal

  if (this.serverPort) {
    process.stdout.write(
      chalk.bold('Local server: ')
      + chalk.cyan('http://localhost:' + this.serverPort)
    )
  }

  if (this.startTime) {
    process.stdout.write(
      chalk.bold(', Uptime: ')
      + chalk.cyan(moment(this.startTime).fromNow(true))
    )
  }

  console.log('')

  var table = new Table({
    head: [chalk.dim('•'), chalk.bold.magenta('time'), chalk.bold.magenta('message')],
    chars: { 'top': '-', 'top-mid': '' , 'top-left': '' , 'top-right': ''
    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 0 }
  });

  var messages = this.messages;
  for (var i = messages.length; i > messages.length - 10; i--) {
    if (messages[i])
      table.push([chalk.dim('•'), chalk.cyan(moment(messages[i].time).format('hh:mma')), messages[i].message])
    }

  table.reverse();

  console.log(table.toString());
}

Logger.prototype.addMessage = function(messageObject) {
  this.messages.push(messageObject);
  this.emit('repaint');
}

Logger.prototype.log = function(message) {
  var entry = {
    type: 'info',
    message: message,
    time: new Date()
  };
  this.addMessage(entry);
}

Logger.prototype.json = function(object) {
  console.log(prettyjson.render(object));
}

module.exports = Logger;
