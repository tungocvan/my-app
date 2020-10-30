const fs = require('fs');
class LoginRegisterController {
  // [GET] /
  index(req, res) {
    if(global.isLogin){
      res.render('myAccount',{ layout : 'layoutWebsite'});
    }else{
       
       res.render('loginRegister',{ layout : 'layoutWebsite' , isLog:'show active'});
    }     
  } 
  logout(req, res) {
    if(global.isLogin){
      global.isLogin = false;
      res.redirect('/');
    }
  } 
  register(req, res,next) {    
    if(req.body.fullName === undefined){
      console.log('login');
      global.isLogin = true;
      res.locals.isLogin = true;
      res.redirect('/'); 
    }else{
      console.log('register');
      let t = global.basedir + '/public/json/dataKhach.json';
      
         
      fs.readFile(t, (err, data) => {
        if (err) throw err;
         let dataKh = JSON.parse(data);
         let items = dataKh.khachhang;       
         let email = req.body.email;
         let indexIdEdit = items.findIndex(i => i.email === email);
         if(indexIdEdit === -1) {
            items.push(req.body);
            fs.writeFile(t,JSON.stringify({"khachhang":items}), (err) => {
            if (err) throw err;
            res.redirect('/');        
            }); 
         }else{
           res.render('loginRegister',{ layout : 'layoutWebsite' , isReg:'show active'});
         }         
        
      });
      
    }
    
  } 

}

module.exports = new LoginRegisterController();
