const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 這個中介軟體 (middleware) 會解析傳送過來的 JSON 資料
app.use(express.json());

// 讓伺服器可以提供您專案資料夾中的靜態檔案 (html, css, js)
app.use(express.static(path.join(__dirname)));

// 這是您的 API 端點 (endpoint)
// 前端的 fetch() 會將資料傳送到這裡
app.post('/api/save-score', (req, res) => {
    const quizResult = req.body;

    console.log('收到測驗結果:', quizResult);

    //
    // 在這裡加入將 quizResult 儲存到資料庫或檔案的程式碼
    // 例如：
    // - 使用 'fs' 模組寫入 CSV 或 JSON 檔案
    // - 使用 MongoDB, PostgreSQL, MySQL 等資料庫的客戶端函式庫進行儲存
    //

    // 傳送一個成功的回應給前端
    res.status(200).json({ message: '分數已成功儲存', data: quizResult });
});

app.listen(port, () => {
    console.log(`伺服器正在 http://localhost:${port} 上運行`);
    console.log('請在瀏覽器中開啟這個網址來進行測驗。');
});