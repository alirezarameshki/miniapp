const fetch = require('node-fetch');
const FormData = require('form-data');

const BALE_BOT_TOKEN = process.env.BALE_BOT_TOKEN || "997412463:ZBHkczDwgrJkXpjEmNwrFd97udeiQJ5vAtK5BYTW";
const IMGBB_API_KEY = "2a95140901ea5fc62ad060bfc12004e7"; // کلید imgbb
const GEMINI_API_URL = "https://gemini-three-inky.vercel.app/api/getData"; // فرضاً API Gemini

async function sendMessage(chatId, text, replyMarkup = null) {
    const url = `https://tapi.bale.ai/bot${BALE_BOT_TOKEN}/sendMessage`;
    console.log("URL درخواست:", url);
    const body = {
        chat_id: chatId,
        text: text
    };
    if (replyMarkup) {
        body.reply_markup = replyMarkup;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log("پاسخ از بله:", data);
    return data.ok;
}

async function getFile(fileId) {
    const url = `https://tapi.bale.ai/bot${BALE_BOT_TOKEN}/getFile?file_id=${fileId}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.ok) {
        return `https://tapi.bale.ai/file/bot${BALE_BOT_TOKEN}/${data.result.file_path}`;
    }
    throw new Error("خطا در گرفتن فایل");
}

async function uploadToImgbb(fileUrl) {
    const response = await fetch(fileUrl);
    const imageBuffer = await response.buffer();
    const base64Image = imageBuffer.toString('base64');

    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const formData = new FormData();
    formData.append("image", base64Image);

    const imgbbResponse = await fetch(url, {
        method: 'POST',
        body: formData
    });
    const data = await imgbbResponse.json();
    console.log("پاسخ imgbb:", data);
    if (data.success) {
        return data.data.url;
    }
    throw new Error("خطا در آپلود به imgbb: " + data.error.message);
}

async function processImageWithGemini(imageUrl) {
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
    });
    const data = await response.json();
    console.log("پاسخ Gemini:", data);
    return data.choices[0].message.content; // فرضاً ساختار جواب Gemini
}

module.exports = async (req, res) => {
    console.log("درخواست کامل:", req.method, req.headers, req.body);
    if (req.method === 'POST') {
        try {
            if (!req.body) {
                console.log("بدنه درخواست خالیه!");
                return res.status(400).send('No body provided');
            }

            const { message } = req.body;
            if (!message || !message.chat) {
                console.log("پیام نامعتبر:", req.body);
                return res.status(400).send('Invalid message format');
            }

            const chatId = message.chat.id;
            const text = message.text;

            const keyboard = {
                keyboard: [["تبدیل عکس به متن"]],
                resize_keyboard: true,
                one_time_keyboard: false
            };

            if (text === '/start') {
                await sendMessage(chatId, `
        **سلام به ربات هوش مصنوعی خوش آمدید**
        
        امکانات ربات:
        - تودو لیست (برای ذخیره لیست کارها)
        - چت بات (برای پرسیدن سوال از هوش مصنوعی)
        - دریافت اطلاعات دقیق هواشناسی (با قابلیت هوش مصنوعی)
        - تبدیل عکس به متن
                `, keyboard);
                console.log("پیام خوش‌آمدگویی برای", chatId, "ارسال شد");
            } else if (text === "تبدیل عکس به متن") {
                await sendMessage(chatId, "لطفاً یه عکس بفرست تا متنش رو استخراج کنم!", keyboard);
            } else if (message.photo) {
                console.log("عکس دریافت شد:", message.photo);
                await sendMessage(chatId, "عکس دریافت شد! در حال پردازش...", keyboard);

                const photo = message.photo[message.photo.length - 1];
                const fileId = photo.file_id;
                const fileUrl = await getFile(fileId);
                console.log("لینک عکس:", fileUrl);

                const imgbbUrl = await uploadToImgbb(fileUrl);
                console.log("لینک imgbb:", imgbbUrl);

                const geminiResult = await processImageWithGemini(imgbbUrl);
                console.log("جواب Gemini:", geminiResult);

                await sendMessage(chatId, `متن استخراج‌شده:\n${geminiResult}`, keyboard);
            } else {
                await sendMessage(chatId, "لطفاً از منو گزینه‌ای انتخاب کن یا عکس بفرست!", keyboard);
            }
            res.status(200).send('OK');
        } catch (error) {
            console.error("خطا:", error);
            await sendMessage(chatId, "یه مشکلی پیش اومد! دوباره امتحان کن.", keyboard);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};