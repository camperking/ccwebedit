var http = require('http');
var fs = require('fs');

var pathhome = 'D:\\coding\\'

function redirect(res) {
    res.writeHead(200, {'Location': '/list'});
	res.end();
}

function ace(data, file, res) {
console.log('ace');
res.write('<!DOCTYPE html>\n'+
'<html lang="en">\n'+
'<head>\n'+
'<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">'+
'<title>ACE in Action</title>\n'+
'<style type="text/css" media="screen">\n'+
'    #editor { \n'+
'        position: absolute;\n'+
'        top: 80px;\n'+
'        right: 0;\n'+
'        bottom: 0;\n'+
'        left: 0;\n'+
'    }\n'+
'</style>\n'+
'</head>\n'+
'<body>\n'+
'<div id ="save">\n'+
'<input type="text" id="file" value="'+ file +'"><br>'+
'<button onclick="\n'+
'        alert(\'save\');\n'+
'        xmlhttp=new XMLHttpRequest();'+
'        xmlhttp.open(\'POST\',\'/save/\'+ document.getElementById(\'file\').value, false);'+
'        xmlhttp.send(editor.getValue());'+
'">Save</button>\n'+
'</div>\n'+
'<div id="editor">\n'+
escape(data) +
'</div>\n'+
    
'<script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>\n'+
'<script>\n'+
'    var editor = ace.edit("editor");\n'+
'    editor.setTheme("ace/theme/monokai");\n'+
'    editor.getSession().setMode("ace/mode/javascript");\n'+
'</script>\n'+
'</body>\n'+
'</html>\n');
res.end();
}

function listfiles(path, res) {
    var filelist = fs.readdirSync(pathhome + path);
    for (var i=0; i < filelist.length; i++) {
	    //console.log('path:'+ path);
	    //console.log('file:'+ filelist[i]);
        if (fs.statSync(pathhome + path + filelist[i]).isDirectory()) {
		    res.write(path + filelist[i] +'<br>');
		    listfiles(path + filelist[i]+'\\', res);
		} else {
		    res.write('---<a href="/edit/'+ path + filelist[i] +'">'+ filelist[i] +'</a><br>');
		}
    }
}

var requestListener = function (req, res) {

    if (req.url == '/list') {
	    res.writeHead(200, {'content-type': 'text/html'});
        listfiles('disk\\', res);		
		res.end();
	}
	
	if (req.url.substr(0, 5) == '/edit') {
	    file = req.url.substr(6);
		console.log(file);
		res.writeHead(200, {'content-type': 'text/html'});
		fs.readFile(file, 'utf8', function(err, data) {
		    console.log(data);
		    if (err) {
			    redirect(res);
			}
		    ace(data, file, res);
		});
		return;
	}
	
	if (req.url.substr(0, 5) == '/save') {
	    console.log('save');
	    file = req.url.substr(6);
	    var data = '';
	    req.on('data', function (chunk) {
            data = data + chunk;
        });
		req.on('end', function() {
		    fs.writeFileSync(file, data);
			res.writeHead(200);
			res.end();
		});
	}
	
	redirect(res);
}

var server = http.createServer(requestListener);
server.listen(8080);