var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(3000);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
});


io.sockets.on('connection', function(socket){
	function updateNicknames () {
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('new user', function (data,callback) {
		if (nicknames.indexOf(data) != -1 ){
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;	
			nicknames.push(socket.nickname);
			updateNicknames();	
		}
	});

	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
		io.sockets.emit('new message', {msg: 'mensagem recebida no servidor', nick: 'bot' })//socket.broadcast.emit('new message', data);
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();

	});

});



