class LoginRegisterController {
  // [GET] /
  index(req, res) {
    res.render('loginRegister',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new LoginRegisterController();
