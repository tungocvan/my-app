class AdminController {
  // [GET] /
  index(req, res) {
    res.render('admin',{ layout : 'layoutAdmin'});
  } 

}

module.exports = new AdminController();
