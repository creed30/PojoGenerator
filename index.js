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
// var jsonObject = JSON.parse(str);
function initFunc(str, filename) {
    var test = capitalizeFirstLetter(filename);
    fs.closeSync(fs.openSync(test, 'w'));
    fs.writeFile(test, "public class " + test.slice(0, -5) + " { ", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    testFunc(str, filename);
}


function testFunc(str, currfile) {
    var jsonObject = JSON.parse(str);
    Object.keys(jsonObject).forEach(function (key) {
        console.log("key", key);
        console.log("value", jsonObject[key]);
        // console.log(whatIsIt(k));
        console.log("type", whatIsIt(jsonObject[key]));
        if (whatIsIt(jsonObject[key]) === "Object") {
            var fileName = capitalizeFirstLetter(key) + ".java";
            fs.closeSync(fs.openSync(fileName, 'w'));
            fs.writeFile(fileName, "Hey there!", function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }
        if (whatIsIt(jsonObject[key]) === "String") {
            fs.appendFile(currfile, "private String " + key + "; ", (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        }
        if (whatIsIt(jsonObject[key]) === "Array") {
            var listType = whatIsIt(jsonObject[key][0]);
            if (listType !== "String") {
                listType = capitalizeFirstLetter(listType);
            }
            fs.appendFile(currfile, "private List<" + listType + "> " + lowerCaseFirstLetter(key) + "; ", (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
            prependFile(currfile, 'import java.util.List; ', function (err) {
                if (err) {
                    console.log('The "data to prepend" was NOT prepended to file!');
                }
                console.log('The "data to prepend" was prepended to file!');
            });
        }
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
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

String.prototype.endsWith = function (str) {
    var lastIndex = this.lastIndexOf(str);
    return (lastIndex !== -1) && (lastIndex + str.length === this.length);
}