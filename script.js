let TransactionHistory = [
  {
    description: 'Luz',
    amount: -100.50,
    date: '21/02/2021'
  },
  {
    description: 'Internet',
    amount: -150.09,
    date: '21/02/2021'
  },
  {
    description: 'Salário',
    amount: 500.10,
    date: '21/02/2021'
  },
]

const Modal = {
  handleModal(){
    const modal = document.querySelector('#modal').classList
    modal.contains('isVisible') === false
      ? modal.add('isVisible')
      : modal.remove('isVisible')
  }
}

const Transactions = {  
  income(){
    const result = TransactionHistory
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)        
    return result
  },
  
  outcome(){
    const result = TransactionHistory
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)    
    return Math.abs(result)
  },

  total(){
    const total = (this.income() - this.outcome())
    return total
  },

}

const Transaction = {   
  newTransaction(event){
    event.preventDefault()
    
    const description = document.querySelector('#new-transaction--description').value
    const type = document.querySelector('#new-transaction--type').value
    const amount = document.querySelector('#new-transaction--amount').value
    const date = document.querySelector('#new-transaction--date').value
    
    return console.log({
      description,
      amount: UTIL.parseAmount(type, amount),
      date: UTIL.parseDate(date)
    })
  }
}

const UTIL = {
  validateFields(description, type, amount, date){
    
  },

  parseAmount(type, amount){    
    if(type === '') throw new Error('Você deve informar o tipo de transação')
    if(type === '-'){
      return `${type}${amount}`
    } 
    if(type === '+'){
      return amount
    }
  },  
  parseDate(date){
    const newDate = date.split('-')
    return `${newDate[2]}/${newDate[1]}/${newDate[0]};`
  },
  parseCurrency(value){
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(value)
  }
}

const App = () => {
  document.querySelector('#balance-income').innerHTML = UTIL.parseCurrency(Transactions.income())
  document.querySelector('#balance-outcome').innerHTML = UTIL.parseCurrency(Transactions.outcome())
  document.querySelector('#balance-total').innerHTML = UTIL.parseCurrency(Transactions.total())

  const transactionsList = document.querySelector('#transactions table tbody')

  const newTransaction = (description, amount, date, index) => 
  `
    <tr>
      <td id="transactions-description">${description}</td>
      <td id="transactions-amount" class="debit">${amount}</td>
      <td id="transactions-date">${date}</td>
      <td id="transactions-remove" onclick="" data-index=${index}>excluir</td>
    </tr>
  `

  TransactionHistory.map((transaction, index) => { 
    transactionsList.appendChild(newTransaction({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      index
    }))
    
  })
}

App()