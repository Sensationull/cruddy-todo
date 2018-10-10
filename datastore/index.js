const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions /// ////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => { 
    var filePathName = path.join(exports.dataDir, `${id}.txt`);
  // console.log('this is data', data);
    fs.writeFile(filePathName, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id, text});
      }
    });
  });

};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
  var data = [];
    if (err) {
      callback(err)
    } else {
      files.forEach( (file) => {
        data.push({id:file.slice(0,5), text: file.slice(0,5)});
      })
        callback(null, data)
    }  
  })
};


exports.readOne = (id, callback) => {
  var filePathName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePathName,"utf8", (err, fileData) =>{
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: fileData});
    }
  })
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
