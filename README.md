# Budget Planner — React + Vite

A student-project starter built with React, Vite, and React Router. It includes User and Admin modules, localStorage-based signup/login, route protection, transactions, a monthly budget, and savings goals.

## Requirements
- Node.js 18+ (recommended)
- npm

## Run locally
1. Extract the ZIP.
2. Open this folder in VS Code.
3. Open Terminal in VS Code and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite.

## Demo admin account
- Email: `admin@budget.local`
- Password: `Admin@123`

Regular users can create an account from the Sign up page. New signups receive the `user` role. The role is deliberately not selectable on signup.

## Modules
- **User:** Dashboard, Transactions, Budgets, Savings Goals.
- **Admin:** System Overview, User Accounts.
- **Authentication:** Signup, login, logout, protected routes, and role-based redirects.
- **Not Found:** fallback 404 route.

## Storage notes
This project uses browser `localStorage` to satisfy the college-project requirement. Accounts and budgeting data stay in the same browser profile and are not shared between devices. Passwords are stored as plain text in localStorage, so this is only suitable for a demo/academic submission—not real users or sensitive financial information. Production authentication requires a backend, secure password hashing, and server-side authorization.

To reset demo data, open browser DevTools → Application/Storage → Local Storage and remove keys beginning with `bp` plus `budgetPlannerUsers` and `budgetPlannerSession`.

## Deploy to Vercel
1. Push the project folder to a GitHub repository.
2. Sign in to Vercel and import that repository.
3. Vercel should detect Vite automatically. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy, then test `/`, `/login`, `/signup`, and a protected route after signing in.

A `vercel.json` rewrite is included so React Router routes work when opened directly or refreshed.

## Verify before submitting
Run `npm run build` and fix any errors. Test signup, login, logout, admin login, role-based access, add/delete transaction, change budget, and savings goals on the deployed URL.

## Added features in this upgraded version

- Expense analytics page with category-wise donut chart and income-vs-expense comparison.
- Budget alerts when recorded spending reaches 80% or 100% of the configured limit.
- Transaction search plus type and category filters.
- Export of the currently filtered transaction list to CSV.
- Savings-goal progress percentage, remaining amount, and goal-completed message.
- Light/dark theme toggle; preference is saved in localStorage.

## Run locally

1. Install Node.js (LTS).
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL printed by Vite.
5. Run `npm run build` to create the production build in `dist/`.

## Demo limitations and security

This is a frontend college-demo application. User data and authentication state are stored in browser localStorage. There is no backend database, server-side authorization, or secure password handling. Do not use real financial or personal data. Analytics and alerts are calculated from the transactions stored in the current browser.
