# SMSGatewayApp

Abstract:
SMS Gateway app. This app focuses on developing a mobile SMS gateway using an Android app which is deployed to enable the sending and receiving of SMS. The mobile app is to be deployed on an Android phone and it should notify a server when a SMS is received and indicate the sender, receiver, and message content. The server app should enable the addition of new devices (phones), show a log of the received messages, and allow the registration of callback urls that are called when messages are received from a specific android gateway app. This app is similar to Twilio but using android app and a server instead of Twilio. In addition, the server should be able to communicate with the android app and request it sends a messages to a specific receiver. 

Video Link: https://www.youtube.com/watch?v=Xsu4XHD3kM8&feature=youtu.be

# Description of the app and functionalities:

To create a sms gateway using two components a gateway server and a gateway app. For the developer who wants utilize this gateway.
Gateway will generate an API key for all the users to authorize the users and provide them a way to communicate with their registered phone numbers through a gateway server. Where the mapping of the developer, its devices and the webhooks to talk with are stored.
Once the developer initiates a communication with gateway server using the message sending api the message is relayed to particular device of the developer. This device has our gateway app which gets a push notification from gateway server and then in turn sends the sms to the respective phone number requested by the developer in the sending api.
Whereas when one of these phone numbers receive the sms they talk through the gateway app to our gateway server which figures out which developer is registered with this device/phone number and uses its respective webhook to call the call back api. And the message is relayed to the developer.

For current considerations the developer server app is not in scope.

# Details of the features and descriptions of both the mobile app and web app:

## Mobile App
Will have capability to login the user
Will read and send sms using the carrier.

## Web App
Gateway webapp:-
There will be two views one for admin and one for developer.
Admin view will show list of developers and on clicking a particular developer, the same view will be shown to the Admin that is supposed to be shown to a developer that is developer details.
Developer detail will contain all the devices associated to the developer account where  on clicking each device you can see the complete log of the message received and sent through that devices.
The developer can signup and login into the portal.
The developer devices are added to the developer details as soon as they signup on the app in their devices.
 
# Details on the technology to be used:

UI/Frontend: Mobile App (Android) 
Middle tier: Node and Express(Routing)
Backend Database: supported using MongoDB/MySQL 
Data transition format: JSON

# Details of the DB schemas to be adopted:

DB schema:
Device Registry schema: Data attributes include UID, Phone_ID
User Details Schema: Data attributes include email, UID, APIKey, callback_webhook, hash
Messages log schema: ID, from, to, date, message, status


# A table that lists the different tasks and the name of the team member who is going to work on this task.

| Task | Team member |Status|
| --- | --- |---|
| gateway server app - login and signup | snigdha |Completed|
| gateway server app - showdevelopers | snigdha |Completed|
| gateway server app - showdeveloperdetail | snigdha |Completed|
| gateway server app - showlogs | snigdha |Completed|
| gateway server api- gatewayapi\SendMessage (from server to mobile) | ankit |Completed|
| gateway server api- gatewayapi\addDevice| ankit |Completed|
| gateway server api- gatewayapi\recievedMessage (from mobile to server) | prerana |Completed|
| gateway server api- gatewayapi\addMessage| prerana |Completed|
| gateway server api- gatewaypi\createAPIKey | prerana |Completed|
| mobile app- login | prerana |Completed|
| mobile app- get push notification from server | ankit | Completed|
| mobile app- send and read sms | ankit |Completed|
| mobile app- get phone numbner | ankit |Android restrictes|
| Web App UI - login and signup | ankit|Completed|
| Web App UI - showDevelopers | ankit|Completed|
| Web App UI - showMessageLogs| ankit|Completed|
|Running sms in background|ankit|Android Restricts|

# Bug List
| Task | Team member |Status|
| --- | --- | --- |
| Client side:Back button and function after registration | snigdha |Completed|
| Client side:Registration and login - empty fields should throw error | snigdha |Completed|
| Mobile login required validation for name pass and number | Prerana |Completed|
| Validate getsms request with apikey | ankit |Completed|
| Developer server sendSms | Prerana |Completed|
| Developer server getSms| Ankit |Incomplete|







