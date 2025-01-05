import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';

const app = express();

app.use(cors());
// 或者指定允許的來源
// app.use(cors({
//   origin: 'http://localhost:5173', // 只允許特定網域
//   methods: ['GET', 'POST'],        // 允許的 HTTP 方法
//   allowedHeaders: ['Content-Type'] // 允許的 HTTP 標頭
// }));
app.use(express.json());

// API 路由
app.use('/api/v1', v1Routes);

// 錯誤處理中間件
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hotel Booking API');
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
//   res.status(201).json({ message: "User registered successfully!", data });
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
