import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaXRhampxYWh6YmhweWFzYWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMDg5MzUsImV4cCI6MjA1MjU4NDkzNX0.qe8KRYhyonkdKS0u6RdjLhhI4H8Z4vO0_1dB2W9XqDY, {
  auth: { persistSession: false }
})
const categories = ['Food', 'Housing', 'Car', 'Entertainment']

const { data: { users }, error} = await supabase.auth.admin.listUsers()
const usersIds = users.map((el) => el.id)

async function seedTransactions() {
  // Delete existing data
  const { error: deleteError } = await supabase.from('transactions')
    .delete().gte('id', 0)

  if (deleteError) {
    console.error('Error deleting existing data:', deleteError)
    return
  }

  let transactions = []

  for(const user of usersIds) {
    for (let year = new Date().getFullYear(); year > new Date().getFullYear() - 2; year--) {
      for (let i = 0; i < 20; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        )
  
        let type, category
        const typeBias = Math.random()
  
        if (typeBias < 0.85) {
          type = 'Expense'
          category = faker.helpers.arrayElement(categories) // Category only for 'Expense'
        } else if (typeBias < 0.95) {
          type = 'Income'
        } else {
          type = faker.helpers.arrayElement(['Saving', 'Investment'])
        }
  
        let amount
        switch (type) {
          case 'Income':
            amount = faker.number.int({ min: 2000, max: 5000 })
            break
          case 'Expense':
            amount = faker.number.int({ min: 100, max: 1000 })
            break
          case 'Saving':
          case 'Investment':
            amount = faker.number.int({ min: 5000, max: 10000 })
            break
          default:
            amount = 0
        }
  
        transactions.push({
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence({ min: 2, max: 10 }),
          category: type === 'Expense' ? category : null, // * Category only for 'Expense'
          user_id: user
        })
      }
    }
  }

  const { error: insertError } = await supabase.from('transactions').upsert(transactions)

  if (insertError) {
    console.error('Error inserting data:', insertError)
  } else {
    console.log('Data inserted successfully.')
  }
}

seedTransactions().catch(console.error)