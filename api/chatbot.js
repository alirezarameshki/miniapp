const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'No message provided' });
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
                        content: 'لطفا جواب سوال را به صورت روان و شفاف و با قالب بندی مقدمه و بدنه و نتیجه گیری بفرست و بین هر قالب فاصله <br>بزار و برو به خط بعدی'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                top_p: 1,
                temperature: 0.5,
                repetition_penalty: 1
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