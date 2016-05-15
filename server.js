var express = require('express'),
	restful	= require('node-restful'),
	mongoose = restful.mongoose,
	Schema = mongoose.Schema;

var api = express.Router();
	
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//Header for cross domain.
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1020');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	// Pass to next layer of middleware
	next();
});
// load the body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());

mongoose.connect('mongodb://localhost/VMS');

// Vistor Type Schema
var VisitorTypeSchema = mongoose.Schema({
	typename : String
});

var VistorTypes = restful.model('visitortype',VisitorTypeSchema);
VistorTypes.methods(['get','put','post','delete']);
VistorTypes.register(app,'/api/visitortypes');

// Vistor Type Schema
var VerificationTypeSchema = mongoose.Schema({
	typename : String
});

var VerificationTypes = restful.model('verificationtype',VerificationTypeSchema);
VerificationTypes.methods(['get','put','post','delete']);
VerificationTypes.register(app,'/api/verificationtypes');

// Person Details Schema
var PersonDetailSchema = mongoose.Schema({
	name : String,
	towernumber : String,
	faltnumber	: String,
	gender : String,
	contactnumber : String,
	photo : String
});

var PersonDetails = restful.model('persondetail',PersonDetailSchema);
PersonDetails.methods(['get','put','post','delete']);
PersonDetails.register(app,'/api/persondetails');

// New Visitor  Schema
var NewVisitorSchema = mongoose.Schema({
	name : String,
	address: String,
	gender: String,
	contactnumber : String,
	verificationtypeid : String,
	verificationnumber :String,
	towernumber : String,
	flatnumber : String,
	visitortypeid : String,
	photo : String,
	photoproof : String
});

var NewVisitors = restful.model('newvisitor',NewVisitorSchema);
NewVisitors.methods(['get','put','post','delete']);
NewVisitors.register(app,'/api/newvisitors');

// Person Details Schema
var VisitorDetailSchema = mongoose.Schema({
	visitorid : String,
	personid : String,
	purpose	: String,
	checkin : Date,
	checkout : Date
});

var VisitorDetails = restful.model('visitordetail',VisitorDetailSchema);
VisitorDetails.methods(['get','put','post','delete']);
VisitorDetails.register(app,'/api/visitordetails');

var person = mongoose.model('persondetails', PersonDetailSchema)
//Get
app.get('/personbytowerandflat/:tower/:flat',function(req,res){
	person.find({ $and : [{towernumber : req.params.tower},{faltnumber: req.params.flat}]},function(err,persons){
		if(err){
			res.send(err);
			return;
		}
		res.json(persons);
	}).limit(1);
});
//Get Checkout list.
var visitorcheckout = mongoose.model('visitordetails', VisitorDetailSchema)
app.get('/checkoutlist',function(req,res){
	/*var visitortype = "57375b8ae8f44693cbb3e084";
	if(req.params.visitorid == 'staff')
	{
		visitortype ="57375b82e8f44693cbb3e083";
	}*/
	visitorcheckout.find({chekcout : null},function(err,visitorlist){
		if(err){
			res.send(err);
			return;
		}
		res.json(visitorlist);
	});
});

app.get('/newvisitors/:visitortype/:visitorid',function(req,res){
	var visitortypeid = '57375b8ae8f44693cbb3e084';
	if(req.params.visitortype == 'staff')
	{
		visitortypeid ='57375b82e8f44693cbb3e083';
	}
	//req.params.visitortypeid

	NewVisitorList.find({$and : [{visitortypeid : visitortypeid},{_id : req.params.visitorid}]},function(err,visitors){
		if(err){
			res.send(err);
			return;
		}
		res.json(visitors);
	});
});
//Get Newvistior list per vistorid.
var NewVisitorList = mongoose.model('newvisitors', NewVisitorSchema)

app.get('/newvisitorsstaff',function(req,res){
	var visitortypeid = '57375b82e8f44693cbb3e083';
	//req.params.visitortypeid

	NewVisitorList.find({visitortypeid : visitortypeid},function(err,visitors){
		if(err){
			res.send(err);
			return;
		}
		res.json(visitors);
	});
});

//Get visitors and staff by contact number
app.get('/GetVisitorsbycontact/:visitortype/:anydetails',function(req,res){
	var visitortypeid = '57375b8ae8f44693cbb3e084';
	if(req.params.visitortype == 'staff')
	{
		visitortypeid ='57375b82e8f44693cbb3e083';
	}
	//req.params.visitortypeid

	//NewVisitorList.find({$and : [{visitortypeid : visitortypeid},{contactnumber : /req.params.contact/}]},function(err,visitors){
	NewVisitorList.find({ $and : [{visitortypeid : visitortypeid},{$or :[{contactnumber : new RegExp(req.params.anydetails, 'i')},{name : new RegExp(req.params.anydetails, 'i')}]}]},function(err,visitors){
		if(err){
			res.send(err);
			return;
		}
		res.json(visitors);
	});
});
/*//Get Checkout details.
var CheckinVisitorSchema = mongoose.Schema({
	name : String,
	address: String,
	gender: String,
	contactnumber : String,
	verificationtypeid : String,
	verificationnumber :String,
	towernumber : String,
	flatnumber : String,
	visitortypeid : String,
	photo : String,
	photoproof : String,
	details :[]
});

// visistor  Details Schema
var CheckinVisitorDetailSchema = mongoose.Schema({
	visitorid : String,
	personid : String,
	purpose	: String,
	checkin : Date,
	checkout : Date,
	checkinmaster : [{{ type : mongoose.Schema.ObjectId, ref:'visitordetails'}}]

});

var CheckinVisitor  = mongoose.model('visitordetailscheckin', CheckinVisitorSchema);*/

//Get
/*app.get('/checkinvisitors',function(req,res){
	CheckinVisitor.find().populate('details').exec(function(err,persons){
		if(err){
			res.send(err);
			return;
		}
		res.json(persons);
	});
});*/
// filer date by date.
var visitorsbydate = mongoose.model('visitordetails', VisitorDetailSchema)
app.get('/visitorsbydate',function(req,res){
	/*var visitortype = "57375b8ae8f44693cbb3e084";
	 if(req.params.visitorid == 'staff')
	 {
	 visitortype ="57375b82e8f44693cbb3e083";
	 }*/
	visitorcheckout.find({checkin: {
		//$gte: '2016-05-14T21:26:50.000Z'
		$lt: '2016-05-14T21:26:50.000Z'
	}},function(err,visitors){
		if(err){
			res.send(err);
			return;
		}
		res.json(visitors);
	});
});

//Initialize app port
app.listen(4030);
console.log('server is running at port 4030');

