import express from 'express';
import * as bodyParser from 'body-parser';
import * as userController from './controllers/user.controller';
import * as matchController from './controllers/match.controller';
import * as chatController from './controllers/chat.controller';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Controller user
app.post('/profile/create', userController.createUser);
app.get('/profile/get/:email', userController.getUser);
app.get('/', userController.getAllUsers);
app.put('/profile/update/:userId', userController.updateUser);
app.delete('/profile/delete/:userId', userController.deleteUser);
app.post('/profile/send-code', userController.sendCode);

// Get list of users
app.get('/match', matchController.get);

// Like / ignore / super like
app.put('/match/like/:userId/:userIdBeLiked', matchController.like);
app.put('/match/ignore/:userId/:userIdBeIgnored', matchController.ignore);
app.put('/match/super/:userId/:userIdBeSuperLiked', matchController.superLike);

// Messages
app.post('/conversation', chatController.addMessage);
app.get('/conversation/get', chatController.getMessages);

export default app;
