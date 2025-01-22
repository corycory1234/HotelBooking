import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = [
    "http://localhost:3000", // 本地測試
    process.env.FRONTEND_URL, // 正式網域
];

// 設定 CORS
app.use(
    cors({
        origin: function (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void
        ) {
            // 允許不帶 origin 的請求（如 mobile app 或 Postman）
            if (!origin) {
                callback(null, true);
                return;
            }

            if (
                allowedOrigins.indexOf(origin) !== -1 ||
                process.env.NODE_ENV === "development"
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // 允許跨域請求攜帶 cookie
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
);

app.use(express.json());
app.use(cookieParser());

// API 路由
app.use("/api/v1", v1Routes);

// 錯誤處理中間件
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #f0f7ff 0%, #e3f2ff 100%);
            padding: 2rem;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        h1 {
            color: #2563eb;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .description {
            color: #4b5563;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .feature {
            background: #f0f7ff;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
        }

        .feature-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }

        .feature h3 {
            color: #1e3a8a;
            margin-bottom: 0.5rem;
        }

        .feature p {
            color: #4b5563;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }

        @media (max-width: 768px) {
            .features {
                grid-template-columns: 1fr;
            }
            body {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>Hotel Booking API</h1>
                <p class="description">
                    歡迎使用我們的飯店預訂管理系統。這個 API 提供完整的飯店預訂和管理解決方案。
                </p>
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🏨</div>
                    <h3>飯店管理</h3>
                    <p>輕鬆管理飯店物業、房間和設施</p>
                </div>

                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <h3>預訂系統</h3>
                    <p>高效的預訂管理和訂房處理</p>
                </div>

                <div class="feature">
                    <div class="feature-icon">👥</div>
                    <h3>用戶管理</h3>
                    <p>完整的用戶認證和檔案管理</p>
                </div>
            </div>

            <div class="footer">
                <p>Version 1.0 - API 文件已可使用</p>
            </div>
        </div>
    </div>
</body>
</html>`);
});

// require("dotenv").config();
// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// app.get("/", (request, response) => {
//   response.send(`<h1>Hello, Node</h1>`);
// });

// // 用戶註冊路由
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;

//   // 使用 Supabase 註冊用戶
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) return res.status(400).json({ error: error.message });
// res.status(201).json({ message: "User registered successfully!", data });
// });

// // 用戶登入路由
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     // 使用 Supabase 登入用戶
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) return res.status(400).json({ error: error.message });
//     res.status(200).json({ message: 'User logged in successfully!', data });
//   });

app.listen(port, () => {
    console.log(`伺服器運行在 http://localhost:${port}`);
});
