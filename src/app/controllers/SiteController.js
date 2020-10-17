const modelUser = require('../models/User');
const {mutileMongooseToObject , mongooseToObject} = require('./mongoose');
class SiteController {
  // [GET] /
  index(req, res) {
    res.render('home',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new SiteController();
