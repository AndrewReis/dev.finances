const Modal = {
  open() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.add('active');
  },

  close() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.remove('active');
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('@devFinances:')) || [];
  },

  set(transactions) {
    localStorage.setItem('@devFinances:', JSON.stringify(transactions));
  }
}

const Transactions = {
  all: Storage.get(),
  
  add(transaction) {
    this.all.push(transaction);
    App.reload();
  },

  remove(index) {
    this.all.splice(index, 1);
    App.reload();
  },

  incomes() {
    let income = 0;
    this.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },

  outcomes() {
    let outcome = 0;
    this.all.forEach(transaction => {
      if (transaction.amount < 0) {
        outcome += transaction.amount;
      }
    });
    return outcome;
  },

  total() {
    const total = this.incomes() + this.outcomes();
    return total;
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransactions(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.draw(transaction, index);
    
    tr.dataset.index = index;
    DOM.transactionContainer.appendChild(tr);
  },

  draw(transaction, index) {
    let classElement = transaction.amount > 0 ? 'income' : 'outcome';
    const amount = Utils.formatCurrency(transaction.amount);
    
    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${classElement}">${amount}</td>
        <td class="date">23/01/2021</td>
        <td> <img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"> </td>
    `;

    return html;
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML =  Utils.formatCurrency(Transactions.incomes());
    document.getElementById('outcomeDisplay').innerHTML = Utils.formatCurrency(Transactions.outcomes());
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total());
  },

  clear() {
    this.transactionContainer.innerHTML = '';
  }

}

const Utils = {

  formatAmount(value) {
    value = Number(value) * 100;
    return value;
  },

  formatDate(date) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';
    value = String(value).replace(/\D/g, '');
    
    value = Number(value) / 100;

    value = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    });

    return signal + value;
  }
}

const Form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    }
  },

  validateFields() {
    const { description, amount, date } = this.getValues()
    if (!description || !amount || !date) {
      throw new Error('Por favor, preencha todos os campos.')
    }
  },

  formatValue() {
    let { description, amount, date } = this.getValues()
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    };

  },

  clearFields() {
    this.description.value = ''
    this.amount.value = ''
    this.date.value = ''
  },

  submit(event) {
    event.preventDefault();
    
    try {
      this.validateFields();
      const transaction = this.formatValue();
      
      Transactions.add(transaction);

      this.clearFields();

      Modal.close();
      App.reload();

    } catch (error) {
      alert(error.message);
    }

    // this.formatData();
  }
}

const App = {
  init() {
    Transactions.all.forEach(DOM.addTransactions)
    DOM.updateBalance();    

    Storage.set(Transactions.all);
  },
  
  reload() {
    DOM.clear();
    this.init();
  }
}

App.init();
