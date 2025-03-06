const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { image_url } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: 'No image URL provided' });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'تو یک ربات تبدیل کننده عکس به متن هستی و وظیفه تو این است که هر عکسی که فرستادم متن درون آن عکس را برای من بفرستی و حرف اضافه هم نزن' },
                            { type: 'image_url', image_url: { url: image_url } }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
};