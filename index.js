var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	messaging_events = req.body.entry[0].messaging
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i]
		sender = event.sender.id
		if (event.message && event.message.text) {
			text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			if(text === 'Score'){
				sendScoreMessage(sender)
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})

var token = "EAAGdJ4BGxgoBAClaoMzbOg6AmfdFCCAiJ8YleYdEm0K2tZBpZAuZCiiTRZAxhaqlZAZAnBuGZCMRflbYEBWY6um8KK8lxLZCWpJCWGSDTrSWyFkhpfmvuhmXmm9SFw8Dg00ionTwZCjbLeGZBcf5P6ZCTGHKX0sZC6GVZAzOyI0MQDUFIPAZDZD"

function sendTextMessage(sender, text) {
	messageData = {
		text:text
	}
	sendRequest()
}

function sendRequest(){
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	sendRequest()
}


function sendScoreMessage(sender){

	messageData = {
		"attachment": {
			"type": "score",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Cricket",
					"subtitle": "cricket score",
					"image_url": "https://www.google.co.in/imgres?imgurl=http%3A%2F%2Fcricfrog.com%2Fwp-content%2Fuploads%2F2015%2F12%2FToday-Cricket-Match-Prediction.jpg&imgrefurl=http%3A%2F%2Fcricfrog.com%2Ftag%2Fcricket-prediction-2016%2F&docid=oDNL94TCSzElNM&tbnid=Yz4H4LIAbzq45M%3A&w=1260&h=840&bih=702&biw=1280&ved=0ahUKEwjUkYzW8bLMAhXXA44KHSoTDWAQMwg2KAUwBQ&iact=mrc&uact=8",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.google.co.in/webhp?hl=en#hl=en&q=cricket+score",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "IPL",
					"subtitle": "IPL SCORE",
					"image_url": "https://www.google.co.in/imgres?imgurl=http%3A%2F%2Fbsmedia.business-standard.com%2F_media%2Fbs%2Fimg%2Farticle%2F2015-12%2F15%2Ffull%2F1450165039-9395.jpg&imgrefurl=http%3A%2F%2Fwww.business-standard.com%2Farticle%2Fcurrent-affairs%2Fipl-team-owners-on-a-rough-pitch-116031500014_1.html&docid=6t6Avr7GjUlY7M&tbnid=LnulN3i6Jw7V-M%3A&w=620&h=464&bih=702&biw=1280&ved=0ahUKEwiMp8bj8bLMAhWTBo4KHQLkDUQQMwg1KAUwBQ&iact=mrc&uact=8",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.google.co.in/webhp?hl=en#hl=en&q=cricket+score",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}


	}
	sendRequest()

}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
