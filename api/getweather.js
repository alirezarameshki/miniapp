const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { weather_data } = req.body;

        if (!weather_data) {
            return res.status(400).json({ error: 'No weather data provided' });
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
                        role: 'system',
                        content: 'تو یک ربات هواشناس هستی و لطفا بر اساس اطلاعات دریافتی یک پیشنهاد کوتاه و جامع بده که طبق اطلاعات هواشناسی ایا در چند روز اینده چه کاری باید و چه کاری نباید انجام بدیم'
                    },
                    {
                        role: 'user',
                        content: weather_data
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
};