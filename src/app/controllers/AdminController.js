const fs = require('fs');
const Buffer = require('buffer/').Buffer;
const path = require('path'); 
class AdminController {
  // [GET] /
  index(req, res) {
    res.render('admin',{ layout : 'layoutAdmin'});
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
