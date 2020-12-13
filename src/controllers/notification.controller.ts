import { db, ms } from '../config/firebase';
import { Request, Response } from 'express';

export const onUserSendMessage = async (req: Request, res: Response) => {
    const user = await db
        .collection('users')
        .doc(req.params.userId)
        .get()
        .then(user => {
            return user.data();
        })
        .catch(err => {
            console.log(err);
        });
    const tokens = await db
        .collection('users')
        .doc(req.params.ownerId)
        .get()
        .then(owner => {
            return owner.data()?.tokens;
        })
        .catch(err => {
            console.log(err);
        });
    await ms
        .sendToDevice(
            tokens,
            {
                notification: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    title: `${user.name}`,
                    body: req.params.message,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    image: 'https://i.pinimg.com/originals/d5/5e/fc/d55efcc94b469ad21115c1d7fb9f0631.jpg',
                    sound: 'default',
                },
                data: {
                    type: 'Chat',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    name: user.name,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    avatar: user.avatar,
                    conversationId: req.params.conversationId,
                    ownerId: req.params.userId,
                },
            },
            {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
            },
        )
        .then(() => res.status(200).json('send notification success!!'))
        .catch(() => res.status(500).json('not send notification'));
};

export const onUserPressLike = async (req: Request, res: Response) => {
    const user = await db
        .collection('users')
        .doc(req.params.userId)
        .get()
        .then(user => {
            return user.data();
        })
        .catch(err => {
            console.log(err);
        });
    const tokens = await db
        .collection('users')
        .doc(req.params.ownerId)
        .get()
        .then(owner => {
            return owner.data()?.tokens;
        })
        .catch(err => {
            console.log(err);
        });
    await ms
        .sendToDevice(
            tokens,
            {
                notification: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    body: `${user.name} liked you`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    sound: 'default',
                },
            },
            {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
            },
        )
        .then(() => res.status(200).json('send notification success!!'))
        .catch(() => res.status(500).json('not send notification'));
};
