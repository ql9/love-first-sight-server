import { db } from '../config/firebase';
import { Request, Response } from 'express';

const conversationsRef = db.collection('conversations');

function compare(a: any, b: any) {
    if (a.lastModified < b.lastModified) {
        return 1;
    }
    if (a.lastModified > b.lastModified) {
        return -1;
    }
    return 0;
}

function splitName(name: string) {
    return name.split(/[, ]+/).pop();
}

export const get = async (req: Request, res: Response) => {
    let state = true;
    if (req.params.state === 'false') {
        state = false;
    }
    await conversationsRef
        .where('participants', 'array-contains', req.params.userId)
        .where('state', '==', state)
        .get()
        .then(async cons => {
            if (cons.size == 0) {
                res.status(404).json('404 Not Found');
            }
            const results: (void | { conversationId: string; lastModified: any; text: any; name: any; avatar: any })[] = [];
            cons.forEach(async con => {
                const length = cons.size;
                results.push(
                    await conversationsRef
                        .doc(con.id)
                        .collection('messages')
                        .orderBy('createdAt', 'desc')
                        .limit(1)
                        .get()
                        .then(messages => {
                            const mes: FirebaseFirestore.DocumentData[] = [];
                            messages.forEach(message => {
                                mes.push(message.data());
                            });
                            const users = con.data()!.users;
                            let receiver, sender;

                            if (users[0].userId === req.params.userId) {
                                receiver = users[1];
                                sender = users[0];
                                sender.name = 'You';
                            } else {
                                receiver = users[0];
                                sender = users[1];
                                sender.name = receiver.name;
                            }
                            if (mes.length) {
                                if (mes[0].messageType === 'text') {
                                    return {
                                        conversationId: con.id,
                                        lastModified: mes[0].createdAt,
                                        text: mes[0].text,
                                        name: receiver.name,
                                        avatar: receiver.avatar,
                                        userId: receiver.userId,
                                    };
                                } else if (mes[0].messageType === 'audio') {
                                    return {
                                        conversationId: con.id,
                                        lastModified: mes[0].createdAt,
                                        text: splitName(sender.name) + ' sent a voice message.',
                                        name: receiver.name,
                                        avatar: receiver.avatar,
                                        userId: receiver.userId,
                                    };
                                } else {
                                    return {
                                        conversationId: con.id,
                                        lastModified: mes[0].createdAt,
                                        text: splitName(sender.name) + ' sent an image.',
                                        name: receiver.name,
                                        avatar: receiver.avatar,
                                        userId: receiver.userId,
                                    };
                                }
                            } else {
                                return {
                                    conversationId: con.id,
                                    lastModified: con.data()!.matchedAt,
                                    text: 'You matched ' + splitName(receiver.name),
                                    name: receiver.name,
                                    avatar: receiver.avatar,
                                    userId: receiver.userId,
                                };
                            }
                        })
                        .catch(err => console.log(err)),
                );
                if (results.length === length) {
                    res.status(200).json(results.sort(compare));
                }
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
