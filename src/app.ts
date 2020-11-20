import express from 'express';
import * as bodyParser from 'body-parser';
import * as userController from './controllers/user.controller';
import * as matchController from './controllers/match.controller';

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
app.put('/match/super/:userId/:userIdBeReported', matchController.report);

export default app;
