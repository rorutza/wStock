
/**
 * zStock
 *
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    http = require('http'),
    path = require('path'),
    url = require('url'),
    stocks = require('./routes/stocks');

var app = express();
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/stock');

var zstockSchema = new Schema({
    name: String,
    storage: String,
    availab: String
});
global.Zstock = mongoose.model('Zstock', zstockSchema);
Zstock.schema.path('name').validate(function(value){
    return (/\w{3}/).test(value);
}, 'Invalid name!');

db.on('error', console.error.bind(console,'connection error:'));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

stocks.createRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
