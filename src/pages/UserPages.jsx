import { useEffect, useMemo, useState } from 'react'

const seedTransactions = [
  { id: 1, title: 'Monthly allowance', category: 'Income', type: 'Income', amount: 18000, date: '2026-11-01' },
  { id: 2, title: 'Groceries', category: 'Food', type: 'Expense', amount: 1650, date: '2026-10-30' },
  { id: 3, title: 'Bus pass', category: 'Transport', type: 'Expense', amount: 800, date: '2026-10-28' },
]
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial } catch { return initial }
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

export function Dashboard() {
  const [transactions] = useStoredState('bpTransactions', seedTransactions)
  const [budget] = useStoredState('bpBudget', 10000)
  const [goals] = useStoredState('bpGoals', [{ id: 1, name: 'Emergency fund', target: 30000, saved: 8500 }])
  const income = transactions.filter(t => t.type === 'Income').reduce((s,t) => s + Number(t.amount), 0)
  const expenses = transactions.filter(t => t.type === 'Expense').reduce((s,t) => s + Number(t.amount), 0)
  const spent = transactions.filter(t => t.type === 'Expense').reduce((s,t) => s + Number(t.amount), 0)
  return <div className="page-content">
    <div className="welcome-row"><div><h2>Good planning starts here.</h2><p className="muted">Here’s a snapshot of your finances.</p></div><span className="date-chip">{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
    <div className="stats-grid">
      <Stat label="Total income" amount={money(income)} note="Recorded income" icon="↗" />
      <Stat label="Total expenses" amount={money(expenses)} note="Recorded spending" icon="↘" />
      <Stat label="Available balance" amount={money(income-expenses)} note="Income minus expenses" icon="₹" featured />
      <Stat label="Monthly budget" amount={money(budget)} note={`${money(Math.max(0,budget-spent))} remaining`} icon="◷" />
    </div>
    <div className="content-grid">
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">ACTIVITY</span><h2>Recent transactions</h2></div><span className="subtle-count">{transactions.length} items</span></div>
        <TransactionTable transactions={transactions.slice(-5).reverse()} />
      </section>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">YOUR NEXT MILESTONE</span><h2>Savings goals</h2></div></div>
        {goals.length ? goals.slice(0,3).map(goal => <GoalProgress key={goal.id} goal={goal}/>) : <p className="muted">No goals yet. Add one in Savings goals.</p>}
        <div className="tip-box"><strong>Budget tip</strong><p>Review your spending weekly. A small adjustment is easier than a month-end surprise.</p></div>
      </section>
    </div>
  </div>
}

function Stat({label,amount,note,icon,featured}) { return <article className={`stat-card ${featured?'featured':''}`}><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{amount}</strong><small>{note}</small></article> }

export function Transactions() {
  const [transactions, setTransactions] = useStoredState('bpTransactions', seedTransactions)
  const [form, setForm] = useState({title:'',category:'Food',type:'Expense',amount:'',date:new Date().toISOString().slice(0,10)})
  const [message,setMessage] = useState('')
  const [search,setSearch] = useState('')
  const [typeFilter,setTypeFilter] = useState('All')
  const [categoryFilter,setCategoryFilter] = useState('All')
  const filtered = transactions.filter(t => (typeFilter==='All'||t.type===typeFilter) && (categoryFilter==='All'||t.category===categoryFilter) && `${t.title} ${t.category} ${t.date}`.toLowerCase().includes(search.toLowerCase()))
  function exportCSV() {
    const rows = [['Description','Type','Category','Amount','Date'], ...filtered.map(t=>[t.title,t.type,t.category,t.amount,t.date])]
    const csv = rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})); const a=document.createElement('a'); a.href=url; a.download='budget-transactions.csv'; a.click(); URL.revokeObjectURL(url)
  }
  function add(e) {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) return setMessage('Enter a description and an amount greater than zero.')
    setTransactions([...transactions,{...form,id:Date.now(),title:form.title.trim(),amount}])
    setForm({...form,title:'',amount:''}); setMessage('Transaction added.')
  }
  function remove(id) { setTransactions(transactions.filter(t=>t.id!==id)) }
  return <div className="page-content"><PageTitle kicker="TRACK YOUR MONEY" title="Transactions" text="Record income and expenses in one place."/>
    <section className="panel"><div className="panel-heading"><h2>Add a transaction</h2></div><form className="transaction-form" onSubmit={add}>
      <label>Description<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Internet bill"/></label>
      <label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Expense</option><option>Income</option></select></label>
      <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Food','Transport','Education','Bills','Shopping','Health','Salary','Income','Other'].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Amount (₹)<input type="number" min="1" required value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0"/></label>
      <label>Date<input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
      <button className="button primary" type="submit">+ Add transaction</button>
    </form>{message&&<p className="success-message">{message}</p>}</section>
    <section className="panel"><div className="panel-heading"><h2>All transactions</h2><div className="table-actions"><span className="subtle-count">{filtered.length} shown / {transactions.length}</span><button className="button secondary" type="button" onClick={exportCSV}>↓ Export CSV</button></div></div><div className="filter-row"><input aria-label="Search transactions" placeholder="Search description, category or date" value={search} onChange={e=>setSearch(e.target.value)}/><select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option>All</option><option>Income</option><option>Expense</option></select><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option>All</option>{[...new Set(transactions.map(t=>t.category))].map(c=><option key={c}>{c}</option>)}</select></div><TransactionTable transactions={[...filtered].reverse()} onDelete={remove} /></section>
  </div>
}

export function Budgets() {
  const [budget,setBudget] = useStoredState('bpBudget',10000)
  const [transactions] = useStoredState('bpTransactions',seedTransactions)
  const spent = transactions.filter(t=>t.type==='Expense').reduce((s,t)=>s+Number(t.amount),0)
  const percent = budget > 0 ? Math.min(100,spent/budget*100) : 0
  const alert = percent >= 100 ? 'Budget exceeded! Review your spending.' : percent >= 80 ? 'Warning: You have used at least 80% of your monthly budget.' : ''
  return <div className="page-content"><PageTitle kicker="SPEND WITH INTENTION" title="Monthly budget" text="Set a monthly spending limit and keep an eye on your progress."/>
    <section className="panel budget-panel">{alert && <div className={`budget-alert ${percent>=100 ? "danger" : "warning"}`} role="alert"><strong>⚠ {percent>=100 ? "Budget limit exceeded" : "Budget alert"}</strong><p>{alert}</p></div>}<span className="eyebrow">MONTHLY LIMIT</span><h2>{money(budget)}</h2><p className="muted">Your recorded expenses total {money(spent)}.</p><div className="progress-track"><span style={{width:`${percent}%`}}/></div><div className="progress-labels"><span>{money(spent)} spent</span><strong>{money(Math.max(0,budget-spent))} remaining</strong></div>
      <form className="budget-edit" onSubmit={e=>{e.preventDefault(); const v=Number(e.currentTarget.amount.value); if(v>0)setBudget(v)}}><label>Update monthly budget (₹)<input name="amount" type="number" min="1" defaultValue={budget}/></label><button className="button primary">Save budget</button></form>
    </section>
    <div className="notice-card"><strong>How to use this page</strong><p>Set a realistic limit based on your income. Your progress updates automatically when you add or remove expense transactions.</p></div>
  </div>
}

export function Goals() {
  const [goals,setGoals] = useStoredState('bpGoals',[{id:1,name:'Emergency fund',target:30000,saved:8500}])
  const [form,setForm] = useState({name:'',target:''})
  function add(e){e.preventDefault(); if(!form.name.trim()||Number(form.target)<=0)return; setGoals([...goals,{id:Date.now(),name:form.name.trim(),target:Number(form.target),saved:0}]);setForm({name:'',target:''})}
  function addSavings(id){const amount=Number(prompt('How much did you save? (₹)'));if(!Number.isFinite(amount)||amount<=0)return;setGoals(goals.map(g=>g.id===id?{...g,saved:g.saved+amount}:g))}
  function remove(id){setGoals(goals.filter(g=>g.id!==id))}
  return <div className="page-content"><PageTitle kicker="PLAN FOR TOMORROW" title="Savings goals" text="Give your savings a purpose and track progress over time."/>
    <section className="panel"><div className="panel-heading"><h2>Create a savings goal</h2></div><form className="goal-form" onSubmit={add}><label>Goal name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. New laptop"/></label><label>Target amount (₹)<input required min="1" type="number" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} placeholder="50000"/></label><button className="button primary">+ Create goal</button></form></section>
    <div className="goal-grid">{goals.map(g=><section className="panel" key={g.id}><div className="panel-heading"><h2>{g.name}</h2><button className="text-button danger-text" onClick={()=>remove(g.id)}>Remove</button></div><div className="goal-amount">{money(g.saved)} <span>of {money(g.target)}</span></div><div className="progress-track"><span style={{width:`${Math.min(100,g.saved/g.target*100)}%`}}/></div><div className="progress-labels"><span>{Math.min(100,Math.round(g.saved/g.target*100))}% complete</span><strong>{money(Math.max(0,g.target-g.saved))} to go</strong></div><div className="goal-progress-caption">{g.saved>=g.target ? "Goal achieved!" : `${money(g.target-g.saved)} remaining to reach your target`}</div><button className="button secondary" onClick={()=>addSavings(g.id)}>+ Add savings</button></section>)}</div>
  </div>
}

function TransactionTable({transactions,onDelete}) {
  if(!transactions.length) return <div className="empty-state"><span>↗</span><p>No transactions yet.</p><small>Add a transaction to start tracking your money.</small></div>
  return <div className="table-wrap"><table><thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Type</th><th className="align-right">Amount</th>{onDelete&&<th></th>}</tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td><strong>{t.title}</strong></td><td>{t.category}</td><td>{t.date}</td><td><span className={`type-pill ${t.type.toLowerCase()}`}>{t.type}</span></td><td className={`align-right ${t.type==='Income'?'income-text':''}`}>{t.type==='Income'?'+':'−'}{money(t.amount)}</td>{onDelete&&<td><button className="text-button danger-text" onClick={()=>onDelete(t.id)}>Delete</button></td>}</tr>)}</tbody></table></div>
}
function GoalProgress({goal}){return <div className="mini-goal"><div className="goal-line"><strong>{goal.name}</strong><span>{Math.min(100,Math.round(goal.saved/goal.target*100))}%</span></div><div className="progress-track"><span style={{width:`${Math.min(100,goal.saved/goal.target*100)}%`}}/></div><small>{money(goal.saved)} saved of {money(goal.target)}</small></div>}
function PageTitle({kicker,title,text}){return <div className="page-title"><span className="eyebrow">{kicker}</span><h2>{title}</h2><p>{text}</p></div>}

export function Analytics() {
  const [transactions] = useStoredState('bpTransactions', seedTransactions)
  const expenses = transactions.filter(t=>t.type==='Expense')
  const income = transactions.filter(t=>t.type==='Income').reduce((a,t)=>a+Number(t.amount),0)
  const total = expenses.reduce((a,t)=>a+Number(t.amount),0)
  const groups = Object.entries(expenses.reduce((acc,t)=>{acc[t.category]=(acc[t.category]||0)+Number(t.amount);return acc},{})).sort((a,b)=>b[1]-a[1])
  const max = Math.max(1,...groups.map(x=>x[1]))
  const colors = ['#1b7a52','#e5a13a','#5276a5','#b66b55','#8265a8','#6b8e93','#bd8b3c']
  const segments = groups.map((g,i)=>{const start=groups.slice(0,i).reduce((a,x)=>a+x[1],0)/Math.max(total,1)*100;const end=(start+g[1]/Math.max(total,1)*100);return `${colors[i%colors.length]} ${start}% ${end}%`}).join(',')
  return <div className="page-content"><PageTitle kicker="UNDERSTAND YOUR MONEY" title="Expense analytics" text="Explore your recorded income and spending by category."/>
    <div className="stats-grid"><Stat label="Total income" amount={money(income)} note="All recorded income" icon="↗"/><Stat label="Total expenses" amount={money(total)} note="All recorded expenses" icon="↘"/><Stat label="Net balance" amount={money(income-total)} note="Income minus expenses" icon="₹" featured/><Stat label="Categories" amount={groups.length} note="Categories with spending" icon="▦"/></div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">SPENDING BREAKDOWN</span><h2>Expenses by category</h2></div></div>{groups.length===0?<p className="muted">No expense data yet. Add expense transactions to see analytics.</p>:<div className="analytics-layout"><div className="donut-chart" style={{background:`conic-gradient(${segments})`}}><div><strong>{money(total)}</strong><small>Total spent</small></div></div><div className="category-breakdown">{groups.map(([name,value],i)=><div className="category-row" key={name}><div className="category-label"><span className="legend-dot" style={{background:colors[i%colors.length]}}/><strong>{name}</strong><span>{money(value)} · {Math.round(value/total*100)}%</span></div><div className="bar-track"><span style={{width:`${value/max*100}%`,background:colors[i%colors.length]}}/></div></div>)}</div></div>}</section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">COMPARISON</span><h2>Income vs expenses</h2></div></div><div className="comparison-bars"><div><span>Income</span><div className="bar-track"><span style={{width:`${income/Math.max(income,total,1)*100}%`}}/></div><strong>{money(income)}</strong></div><div><span>Expenses</span><div className="bar-track expense"><span style={{width:`${total/Math.max(income,total,1)*100}%`}}/></div><strong>{money(total)}</strong></div></div></section>
  </div>
}
