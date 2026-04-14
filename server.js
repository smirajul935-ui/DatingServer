const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());
app.use(express.json());

// Agora Tokens ko Securely Generate karna
app.get('/api/agora-token', (req, res) => {
    const { channelName, uid } = req.query;
    
    if (!channelName || !uid) {
        return res.status(400).json({ error: 'channelName aur uid zaroori hai' });
    }

    // Ye keys hum Render server par chupayenge
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_CERTIFICATE;
    const role = RtcRole.PUBLISHER;
    const expireTime = Math.floor(Date.now() / 1000) + 3600; // 1 Ghante ka token

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, parseInt(uid), role, expireTime);
        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ error: 'Token generate nahi hua' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
