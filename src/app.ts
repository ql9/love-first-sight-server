import express from 'express';
import * as bodyParser from 'body-parser';
import * as userController from './controllers/user.controller';
import * as matchController from './controllers/match.controller';
import * as secondLookController from './controllers/second-look.controller';
import * as conversationController from './controllers/conversation.controller';
import * as listController from './controllers/list.controller';
import * as notificationController from './controllers/notification.controller';
import * as agoraController from './controllers/agora.controller';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Controller user
app.post('/profile/create', userController.createUser);
app.get('/profile/get/:userId', userController.getUser);
app.put('/profile/update/:userId', userController.updateUser);
app.delete('/profile/delete/:userId', userController.deleteUser);
app.post('/profile/send-code', userController.sendCode);

// Get list of users
app.post('/match', matchController.get);

// Like / ignore / super like / report
app.put('/match/like/:userId/:userIdBeLiked', matchController.like);
app.put('/match/unmatch/:userId/:userIdBeUnMatch', matchController.unMatch);
app.put('/match/ignore/:userId/:userIdBeIgnored', matchController.ignore);
app.put('/match/super/:userId/:userIdBeSuperLiked', matchController.superLike);
app.put('/match/report/:userId/:userIdBeReported', matchController.report);
app.put('/match/block/:userId/:userIdBeBlock', matchController.block);
app.put('/match/unblock/:userId/:userIdBeUnBlock', matchController.unBlock);

// List liked you, top pick and ignored
app.get('/list/liked-you/:userId', listController.getUsersLiked);
app.get('/list/top-pick/:userId', listController.getUsersOnTop);
app.get('/list/ignored/:userId', listController.getUsersIgnored);
app.get('/list/block/:userId', listController.getUsersBlock);

//Second look
app.put('/second-look/like/:userId/:userIdBeLiked', secondLookController.like);
app.put('/second-look/ignore/:userId/:userIdBeIgnored', secondLookController.ignore);
app.put('/second-look/super/:userId/:userIdBeSuperLiked', secondLookController.superLike);

// Conversation
app.get('/conversation/:userId/:state', conversationController.get);
app.put('/conversation/update-state', conversationController.updateStateConversation);

// Message request
app.post('/conversation/send-message', conversationController.sendMessageRequest);

// Notification
app.get('/notification/message/:ownerId/:userId/:message/:conversationId', notificationController.onUserSendMessage);
app.get('/notification/like/:ownerId/:userId', notificationController.onUserPressLike);
app.post('/notification/call', notificationController.onCallVideo);

// Agora
app.post('/agora/create-key', agoraController.createKey);

export default app;
