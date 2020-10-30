const fs = require('fs');
const Buffer = require('buffer/').Buffer;
const path = require('path'); 
const menu = require('../libs/myMenu');
class AdminController {
  // [GET] /
  index(req, res) {
     res.render('admin/admin',{ layout : 'layoutAdmin'});
  } 
  menu(req, res) {
      //console.log('menu:',menu.menu);    
      let t = global.basedir + '/public/azshopweb/menu/menuTop.json';
      fs.writeFile(t,JSON.stringify({"menu":menu.menu}), (err) => {
        if (err) throw err;
        res.render('admin/menu',{ layout : 'layoutAdmin'});        
      }); 
      
  } 
  upload(req, res,next) {
     let files  = req.body;
     let name = files.name;
     let t = global.basedir + '/public/img/'+name;
     let img = files.tmp_name;
     let data = img.replace(/^data:image\/\w+;base64,/, "");
     let buf = new Buffer(data, 'base64');  
     fs.writeFile(t, buf, (err) => {
            if (err) throw err;
            res.json({"message":"Upload Ok !!!"});        
     }); 
   
  } 
  
}

module.exports = new AdminController();
