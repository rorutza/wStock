
/*
 * zStock pages
 */

exports.createRoutes = function(app){
    var stock = [];
    var nostock = [];
    var lowstock = [];

    function first_time() {};
    function yes_stock() {};

    function no_stock() {
        var new_stock = [];
        Zstock.find({availab: 'No'},function (err, zstock) {
            if(err) console.log('Err found! - no_stock()');
            zstock.forEach(function(zs){
                new_stock.push(zs);
            });
        });
        nostock = new_stock;
    };
    function low_stock() {
        var new_stock = [];
        Zstock.find({availab: 'Low'},function (err, zstock) {
            if(err) console.log('Err found! - low_stock()');
            zstock.forEach(function(zs){
                new_stock.push(zs);
            });
        });
        lowstock = new_stock;
    };

    function all_stock() {
        var new_stock = [];
        Zstock.find(function (err, zstock) {
            if(err) console.log('Err find!');
            zstock.forEach(function(zs){
                var stock = {
                    id: zs._id,
                    name: zs.name,
                    storage: zs.storage,
                    availab: zs.availab};
                new_stock.push(zs);
            });
        });
        stock = new_stock;
    };

    all_stock();
    no_stock();
    low_stock();

    console.log('Stock length: ' + stock.length);

    app.get('/', function(req, res) {
        var first = stock.length;
        res.render('stock', { title: 'zStock',
                              first: first,
                              nostock: nostock,
                              lowstock: lowstock});
    });

    app.get('/test', function(req, res) {
        res.render('test');
    });

    app.get('/add', function(req, res) {
      res.render('add', { title: 'zStock' } );
    });

    app.get('/stock', function(req, res) {
        res.render('stock', { title: 'zStock',
                              first: '1',
                              nostock: nostock,
                              lowstock: lowstock});
    });

    app.post('/stock', function(req, res) {
        var query = req.body;
        var zs = new Zstock({
            name: query.name,
            storage: query.storage,
            availab: query.availab
        });
        console.log('Read new product from request: ' + zs.name + ' with availab: ' + zs.availab);
        zs.save(function(err) {
            //err.errors.name ia a ValidatorError object
            if(err) {
                console.log(err.errors.name.message);
                res.render('error', {
                    title: 'zStock',
                    errmsg: err.errors.name.message});
            }
            else {
                stock.push(zs);
                res.redirect('/stock');
            }
        });
    });
};