// در فایل js/index.js
document.addEventListener('DOMContentLoaded', function() {
    const todolist = document.querySelector('.Todolist');
    const loading = document.querySelector('.loading');

    loading.classList.add("display")

    const chatbox = document.querySelector('.chatbot');
    const weather = document.querySelector('.weather');
    const eimazh = document.querySelector('.eimazh');

    // لودینگ اولیه (وقتی صفحه اول لود می‌شه)
    setTimeout(() => {
        loading.classList.add('display'); // مخفی کردن لودینگ
    }, 1000);

    const elements = [
        { element: todolist, href: '../todolist.html' },
        { element: chatbox, href: '../chatbot.html' },
        { element: weather, href: '../weather.html' },
        { element: eimazh, href: '../image.html' }
    ];

    elements.forEach(item => {
        if (item.element) {
            item.element.addEventListener('click', function() {
                // نشون دادن لودینگ قبل از انتقال
                loading.classList.remove('display'); // فرض می‌کنم display یعنی مخفی

                // انتقال به صفحه جدید بعد از یه تاخیر
                setTimeout(() => {
                    document.location.href = item.href;
                }, 1000); // 1 ثانیه لودینگ
            });
        } else {
            console.error(`آیتم  پیدا نشد!`);
        }
    });
});