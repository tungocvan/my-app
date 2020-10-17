const fs = require('fs');
const Buffer = require('buffer/').Buffer;
class AdminController {
  // [GET] /
  index(req, res) {
    res.render('admin',{ layout : 'layoutAdmin'});
  } 
  upload(req, res) {
     let files  = req.body;
     let name = files.name;
     let t = global.basedir + '/'+name;
     let img = files.tmp_name;
     let data = img.replace(/^data:image\/\w+;base64,/, "");
     //let buf = new Buffer(data, 'base64');     
    //   fs.writeFile(t, buf, function(err) {
    //       if (err) throw err;
    //       res.json({"message":"Upload Ok !!!"});
    //   }); 
      let writeStream = fs.createWriteStream(t); 
      writeStream.write(data, 'base64');
      writeStream.on('finish', () => {
         console.log('wrote all data to file');
      });
      writeStream.end();
      res.json({"message":"Upload Ok !!!"});
  } 
}

module.exports = new AdminController();
