//Call the packages we need
var express = require('express');  // call express
var app = express();    // define app using express

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears');

var Bear = require('./models/bear');

//configure the app to use body parser
//this will let us get data from a POST

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8181;

//Routes

var router = express.Router();

//middleware to use for all our requests
router.use(function(req, res, next){
		// Do logging
		console.log("Some action is going on");
		next();  // make sure we go to the next routes and don't stop here
});

router.get('/',function(req,res){
	res.json({message : "Welcome to my app"});
});



router.route('/bears')
	.post(function(req, res){
		var bear = new Bear();
		bear.name = req.body.name;
		bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!', data: bear });
        });
	})
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
	.get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
//all of the routes pre-fixed with /api

app.use('/api',router);


app.listen(port);
console.log("Application running on port " + port );

