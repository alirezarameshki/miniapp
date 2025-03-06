const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API Key not configured' }) };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No body provided' }) };
        }

        const body = JSON.parse(event.body);
        const imageUrl = body.image_url;

        if (!imageUrl) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No image URL provided' }) };
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://aiminiapp.netlify.app',
                'X-Title': 'Image Analyzer',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'تو یک ربات تبدیل کننده عکس به متن هستی و وظیفه تو این است که هر عکسی که فرستادم متن درون آن عکس را برای من بفرستی و حرف اضافه هم نزن'
                            },
                            {
                                type: 'image_url',
                                image_url: { url: imageUrl }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Open Router error: ${response.status}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Something went wrong' })
        };
    }
};