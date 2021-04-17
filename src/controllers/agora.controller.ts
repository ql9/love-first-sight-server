import { Request, Response } from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const role = RtcRole.PUBLISHER;

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

export const createKey = (req: Request, res: Response) => {
    const { appID, appCertificate, channelName, uid } = req.body;
    try {
        res.status(200).json(RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs));
    } catch (error) {
        res.status(500).json(error);
    }
};
