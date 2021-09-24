# Chat app - Angular / Serverless - Testing on Postman

## Postman setup

 - Import **Chat-App.postman_collection.json** at `docs/tests` on Postman
 - On browser development tools, **COPY** the token that is printed in the console after you log in.
 - Token image example:   
 ![JWT Token](screenshots/postman-01.png)
- Paste your jwt token in the value field of **token** variable on your recently imported collection.
-  Collection variables image example:   

![Postman collection variables](screenshots/postman-02.png)

## Postman Requests
- Get UserInfo request:
	 ![Get UserInfo request](screenshots/postman-03.png)
- Set UserInfo:
	 ![Set UserInfo request](screenshots/postman-04.png)
- Get SignedUrl for avatar upload:
	 ![Get SignedUrl for avatar upload](screenshots/postman-05.png)
	- Click on uploadUrl generated response:
		- Change Http method to **Put**
		-  Select **binary** on Body params
		-  Click on select file and choose an image
		-  Click on Send to upload to S3
		 ![Get SignedUrl for avatar upload](screenshots/postman-06.png)


## Postman Websocket
I could not save websocket testing configuration on this collection, please follow the steps bellow:
- Click on **New** and choose **Websocket request** on postman
- Set the **websocket url** and click on connect
- ![Connect websocket on postman](screenshots/postman-07.png)
- You can send a message pasting this json on compose message: 
`{
"action": "sendMessage",
"message": "Testing send message",
"name": "Bruno Rodrigues"
}`   
![Sending a websocket message on postman](screenshots/postman-08.png)
- If your client is open on browser, you will see this message on the chat app.
- You could also test with `wscat -c ws://localhost:3001` if you prefer.