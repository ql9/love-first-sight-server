import { User } from '../models/user.model';
import { db, FieldValue } from '../config/firebase';
import { Request, Response } from 'express';

const usersRef = db.collection('users');

// export const createUser = async (req: Request, res: Response) => {
//     const user = req.body as User;

//     await usersRef
//         .add(user)
//         .then(data => {
//             res.status(200).json(data.id);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || 'Some error occurred while creating new user',
//             });
//         });
// };

export const createUser = async (req: Request, res: Response) => {
    // const user = req.body as User;
    await usersRef
        .orderBy('nthUser', 'desc')
        .limit(1)
        .get()
        .then(async users => {
            const userIdBefore: string[] = [];
            users.forEach(user => {
                userIdBefore.push(user.id);
            });
            let userId = 0;
            if (userIdBefore.length) {
                userId = parseInt(userIdBefore[0]) + 1;
            }
            const availableUsers: string[] = [];
            for (let i = 0; i < userId; i++) {
                availableUsers.push(i.toString());
            }
            const user = {
                name: req.body.name,
                email: req.body.email,
                intro: req.body.intro,
                birthday: req.body.birthday,
                gender: req.body.gender,
                avatar: req.body.avatar,
                hobbies: req.body.hobbies,
                availableUsers: availableUsers,
                nthUser: userId,
            } as User;

            await usersRef
                .doc(userId.toString())
                .set(user)
                .then(async () => {
                    for (let i = 0; i < userId; i++) {
                        await usersRef.doc(i.toString()).update({
                            availableUsers: FieldValue.arrayUnion(userId.toString()),
                        });
                    }
                    res.status(200).json(userId);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occurred while creating new user',
                    });
                });
        });
};

export const getAllUsers = async (req: Request, res: Response) => {
    await usersRef
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                res.status(200).json(results);
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
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
            res.status(200).json({
                detail: `user id: ${req.params.userId} deleted!`,
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
