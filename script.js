const Storage = {
  get(){
    return JSON.parse(localStorage.getItem('@myfinances:transactions')) || []
  }, 

  set(data){
    return localStorage.setItem('@myfinances:transactions', JSON.stringify(data))
  },

  clear(){
    return localStorage.clear()
  }
}

const Modal = {
  handleModal(){
    const modal = document.querySelector('#modal').classList
    modal.contains('isVisible') === false
      ? modal.add('isVisible')
      : modal.remove('isVisible')
  }
}

const Transactions = {
  all: Storage.get(),

  income(){
    let income = 0
    const result = Transactions.all
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, income)        
    return result
  },
  
  outcome(){
    let outcome = 0
    const result = Transactions.all
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, outcome)    
    return Math.abs(result)
  },

  total(){     
    const total = (this.income() - this.outcome())    
    return total
  },
}

const Transaction = {   
  newTransaction(event){    
    try {
      event.preventDefault()
      const description = document.querySelector('#new-transaction--description')
      const type = document.querySelector('#new-transaction--type')
      const amount = document.querySelector('#new-transaction--amount')
      const date = document.querySelector('#new-transaction--date')
      
      const data = {
        description: Validation.parseDescription(description.value),
        amount: Validation.parseAmount(type.value, amount.value),
        date: Validation.parseDate(date.value)
      }      
      
      const transactions = Transactions.all

      Storage.clear()
      transactions.push(data)
      Storage.set(transactions)

      description.value = ''
      type.value = ''
      amount.value = ''
      date.value = ''
      
      Modal.handleModal()
      App.reload()
      
    } catch (error) {
      alert(error.message)
    } 
     
  },

  removeTransaction(index){
    const transactions = Transactions.all
    transactions.splice(index, 1)
    
    Storage.clear()
    Storage.set(transactions)       
    App.reload()  
  }
}

const Validation = {
  parseDescription(description){
    if(!description) throw new Error('A descrição da transação precisa ser informada')

    description = description.trim()
    return description
  },

  parseAmount(transactionType, transactionAmount){
    if(!transactionAmount) throw new Error('Informe o valor do lançamento')
    if(!transactionType) throw new Error('Você deve informar o tipo de transação')

    transactionAmount = String(transactionAmount).replace(/\D/g, '')    
    transactionAmount = Number(transactionAmount)
    
    if(transactionType === '-'){
      const result = Number(`${transactionType}${transactionAmount}`)
      return result
    } 
    if(transactionType === '+'){
      return transactionAmount
    }    
  },  

  parseDate(date){
    if(!date) throw new Error('Informe a data do lançamento')

    const newDate = date.split('-')
    return `${newDate[2]}/${newDate[1]}/${newDate[0]}`
  },

  parseCurrency(value){
    value = value / 100
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(value)
  }
}

const DOM = {
  transactionList: document.querySelector('#transactions ul'),
  
  populateTransactions(transaction, index){        
    const transactionItem = document.createElement('li')
    transactionItem.innerHTML = DOM.transactionContent(transaction, index)         

    DOM.transactionList.appendChild(transactionItem)
  },  

  transactionContent(transaction, index){
    const transactionTypeCSS = transaction.amount > 0 ? 'income' : 'debit'

    return `
      <span id="transactions-description">${transaction.description}</span>
      <span id="transactions-amount" class=${transactionTypeCSS}>${Validation.parseCurrency(transaction.amount)}</span>
      <span id="transactions-date">${transaction.date}</span>
      <span id="transactions-remove"><button onclick="Transaction.removeTransaction(${index})"><img src="./assets/trash-2.svg"></img></button></span>
    `     
  }, 

  updateBalance(){
    document.querySelector('#balance-income').innerHTML = Validation.parseCurrency(Transactions.income())
    document.querySelector('#balance-outcome').innerHTML = Validation.parseCurrency(Transactions.outcome())
    
    if(Transactions.total() < 0){
      document.querySelector('#card.card-total').classList.remove('positive-balance')
      document.querySelector('#card.card-total').classList.add('negative-balance')
      document.querySelector('#balance-total').innerHTML = Validation.parseCurrency(Transactions.total())
    }
    if(Transactions.total() >= 0){
      document.querySelector('#card.card-total').classList.remove('negative-balance')
      document.querySelector('#card.card-total').classList.add('positive-balance')
      document.querySelector('#balance-total').innerHTML = Validation.parseCurrency(Transactions.total())
    }
  },

  clearTransactionsList(){
    DOM.transactionList.innerHTML = ""
  }
}

const App = {
  init(){    
    const transactions = Storage.get()
    
    transactions.map((transaction, index) => {
      DOM.populateTransactions(transaction, index)  
    })    
    DOM.updateBalance()    

  },

  reload(){
    DOM.clearTransactionsList()    
    App.init()
  }
 
}

App.init()