class LoginRegisterController {
  // [GET] /
  index(req, res) {
    res.render('LoginRegister',{ layout : 'layoutWebsite'});
  } 

}

module.exports = new LoginRegisterController();
