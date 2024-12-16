const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const shortid = require('shortid');

const rateLimit = require('express-rate-limit');

const urlLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 20, 
    message: 'You have exceeded the daily request limit for this URL.'
});

router.post('/shorten', urlLimiter, async (req, res) => {
    const { longUrl } = req.body;

    
    if (!longUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        
        let url = await Url.findOne({ longUrl });
        if (url) return res.json({ shortUrl: `http://localhost:3000/${url.shortUrl}` });

       
        const shortUrl = shortid.generate();
        url = new Url({ longUrl, shortUrl });
        await url.save();

        res.json({ shortUrl: `http://localhost:3000/${shortUrl}` });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/redirect/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });

        if (!url) return res.status(404).json({ error: 'URL not found' });

        
        url.hitCount += 1;

    
        if (url.hitCount % 10 === 0) {
            await url.save();
            return res.redirect('https://www.google.com');
        }

        await url.save();
        res.redirect(url.longUrl);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/top/:number', async (req, res) => {
    const number = parseInt(req.params.number);

    try {
        const topUrls = await Url.find().sort({ hitCount: -1 }).limit(number);
        res.json(topUrls);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/details/:url', async (req, res) => {
    const { url } = req.params;

    try {
        let result;

        if (shortid.isValid(url)) {
            result = await Url.findOne({ shortUrl: url });
        } else {
            result = await Url.findOne({ longUrl: url });
        }

        if (!result) return res.status(404).json({ error: 'URL not found' });

        res.json({ longUrl: result.longUrl, shortUrl: result.shortUrl, hitCount: result.hitCount });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});



module.exports = router;
