var fs = require('fs');
var prependFile = require('prepend-file');

var filename = process.argv[2];
if (!filename.endsWith(".java")) {
    filename = filename + ".java"
}
var buffer = fs.readFileSync(process.argv[3]);

var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;


var str = buffer.toString();
initFunc(str, filename);

function initFunc(str, fileName) {
    createClass(fileName);
    createFunc(str, fileName);
}


function createFunc(str, currfile) {
    var jsonObject = JSON.parse(str);
    Object.keys(jsonObject).forEach(function(key) {
        console.log("key", key);
        console.log("value", jsonObject[key]);
        console.log("type", whatIsIt(jsonObject[key]));
        if (whatIsIt(jsonObject[key]) === "Object") {
            addCustom(currfile, key)
            var fileName = capitalizeFirstLetter(key) + ".java";
            createClass(fileName);
            createFunc(JSON.stringify(jsonObject[key]),fileName);
        }
        if (whatIsIt(jsonObject[key]) === "String") {
            addString(currfile, key);
        }
        if (whatIsIt(jsonObject[key]) === "Array") {
            addList(currfile,key,jsonObject[key][0]);
        }
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function createClass(fileName) {
    var fileName = capitalizeFirstLetter(fileName);
    fs.writeFile(fileName, "public class " + fileName.slice(0, -5) + " { ", function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function addString(fileName, key) {
    fs.appendFile(fileName, "private String " + lowerCaseFirstLetter(key) + "; ", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}

function addCustom(fileName, key) {
    fs.appendFile(fileName, "private " + capitalizeFirstLetter(key) + " " + lowerCaseFirstLetter(key) + "; ", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}

function addList(fileName,key,value) {
    var listType = whatIsIt(value);
    if (listType !== "String") {
        listType = capitalizeFirstLetter(listType);
    }
    fs.appendFile(fileName, "private List<" + listType + "> " + lowerCaseFirstLetter(key) + "; ", (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    prependFile(fileName, 'import java.util.List; ', function(err) {
        if (err) {
            console.log('The "data to prepend" was NOT prepended to file!');
        }
        console.log('The "data to prepend" was prepended to file!');
    });
}

function whatIsIt(object) {
    if (object === null) {
        return "null";
    } else if (object === undefined) {
        return "undefined";
    } else if (object.constructor === stringConstructor) {
        return "String";
    } else if (object.constructor === arrayConstructor) {
        return "Array";
    } else if (object.constructor === objectConstructor) {
        return "Object";
    } else {
        return "don't know";
    }
}

String.prototype.endsWith = function(str) {
    var lastIndex = this.lastIndexOf(str);
    return (lastIndex !== -1) && (lastIndex + str.length === this.length);
}