const fs = require('fs');
//const Buffer = require('buffer/').Buffer;
class AdminController {
  // [GET] /
  index(req, res) {
    res.render('admin',{ layout : 'layoutAdmin'});
  } 
  upload(req, res) {
     let files  = req.body;
     let img = files.tmp_name;
     //let data = img.replace(/^data:image\/\w+;base64,/, "");
     //let buf = new Buffer(data, 'base64');
     let data = {'name':'tu ngoc van'};
      fs.writeFile(files.name, data, function(err) {
          if (err) throw err;
          res.json({"message":"Upload Ok !!!"});
      });   
      //res.json({"message":"Upload Ok !!!"});
  } 

}

module.exports = new AdminController();
