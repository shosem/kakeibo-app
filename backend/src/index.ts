import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('はろー！')
})

app.get('/transactions', async (c) => {
  const type = c.req.query('type') // パスのクエリパラメータであるtype=を取得
  
  // typeのバリデーション
  if(!type || !['income', 'expense', 'all'].includes(type)){
    return c.json(
      {message: 'typeはincome, expense, allのいずれかである必要があります'},
      400,
    )
  }

  // 取引履歴を取得する
  // 以下モックデータ
  const transactionList = [
    { id: 1, 
      item: "給料",
      amount: 100000,
      date: '2025-01-01'
    },
    { id: 2,
      item: '食費',
      amount: -10000,
      date: '2025-01-02'
    }
  ]

  const result = {
    transactions: transactionList,
    totalCount: transactionList.length, // 総取引数
    totalAmount: transactionList.reduce((sum, transaction) => sum + transaction.amount, 0),
  }

  return c.json(result, 200)

})

// POST処理
app.post('/transactions', async(c) => {
  const body = await c.req.json()

  // リクエストボディを変数に代入
  const { item, amount, date } = body

  // バリデーション
  if (!item || amount === undefined || !date ){
    return c.json({ message: "必須項目が不足しています" }, 400)
  }

  if (typeof amount !== "number" || amount === 0){
    // 金額チェック
    return c.json({message: "金額は0以外の数値である必要がありますう！"}, 400)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)){
    // 日付け意識チェック
    return c.json({ message: "日付はYYYY-MM-DD形式で入力してください" })
  }
  // TODO登録処理を行うためにデータベースに接続して登録する
  // ボディ、ステータス返却
  return c.json(body, 201)

})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
