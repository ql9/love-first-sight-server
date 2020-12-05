import express from 'express';
import * as bodyParser from 'body-parser';
import * as userController from './controllers/user.controller';
import * as matchController from './controllers/match.controller';
import * as conversationController from './controllers/conversation.controller';
import * as likeAndTopController from './controllers/like-top-ignore.controller';
import * as notification from './controllers/notification.controller';

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
app.put('/match/ignore/:userId/:userIdBeIgnored', matchController.ignore);
app.put('/match/super/:userId/:userIdBeSuperLiked', matchController.superLike);
app.put('/match/report/:userId/:userIdBeReported', matchController.report);

// List liked you, top pick and ignored
app.get('/list/liked-you/:userId', likeAndTopController.getUsersLiked);
app.get('/list/top-pick/:userId', likeAndTopController.getUsersOnTop);
app.get('/list/ignored/:userId', likeAndTopController.getUsersIgnored);

// Conversation
app.get('/conversation/:userId/:state', conversationController.get);

// Notification
app.get('/notification/message/:ownerId/:userId/:message', notification.onUserSendMessage);
app.get('/notification/like/:ownerId/:userId', notification.onUserPressLike);

export default app;
