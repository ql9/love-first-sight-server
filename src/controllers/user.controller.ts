import { User } from '../models/user.model';
import { db, FieldValue } from '../config/firebase';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const usersRef = db.collection('users');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'staplerapp@gmail.com',
        pass: 'staplerapp123456',
    },
});

function randomCode() {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString();
}

export const sendCode = async (req: Request, res: Response) => {
    await usersRef
        .where('email', '==', req.body.email)
        .get()
        .then(async users => {
            const usersId: string[] = [];
            users.forEach(user => {
                usersId.push(user.id);
            });
            if (usersId.length) {
                res.status(405).json('that email address is already in use!');
            }
            const code = randomCode();
            const mailOptions = {
                from: 'Stapler team',
                to: req.body.email,
                subject: 'Sign-up code for Stapler',
                text: 'This is code to active your Stapler account, do not share this code to anyone: ' + code,
            };
            await transporter.sendMail(mailOptions).then(() => {
                console.log(code);
                res.status(200).json(code);
            });
        })
        .catch(() => {
            res.status(500).json('can not send code to ' + req.body.email);
        });
};

export const createUser = async (req: Request, res: Response) => {
    await usersRef.get().then(async users => {
        const availableUsers: string[] = [];
        const ignoredYou: string[] = [];
        const matches: string[] = [];
        const likedUsers: string[] = [];
        const blockedYou: string[] = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Object is possibly 'null'
        const images: string[] = [null, null, null, null, null, null, null, null];
        users.forEach(user => availableUsers.push(user.id));
        const user = {
            name: req.body.name,
            email: req.body.email,
            intro: req.body.intro,
            birthday: req.body.birthday,
            gender: req.body.gender,
            hobbies: req.body.hobbies,
            avatar: req.body.avatar,
            superLike: 0,
            matches: matches,
            createdAt: new Date().getTime(),
            availableUsers: availableUsers,
            ignoredYou: ignoredYou,
            images: images,
            likedUsers: likedUsers,
            blockedYou: blockedYou,
        } as User;

        await usersRef
            .doc(req.body.userId)
            .set(user)
            .then(() => {
                availableUsers.forEach(user => {
                    usersRef.doc(user).update({
                        availableUsers: FieldValue.arrayUnion(req.body.userId),
                    });
                });
                res.status(200).json('create success');
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating new user',
                });
            });
    });
};

export const getUser = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userId)
        .get()
        .then(user => {
            if (user.exists) {
                res.status(200).json(user.data());
            } else {
                res.status(404).json({ detail: 'Not found user' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const updateUser = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userId)
        .update(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const deleteUser = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userId)
        .delete()
        .then(() => {
            res.status(200).json(`user id: ${req.params.userId} deleted!`);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
