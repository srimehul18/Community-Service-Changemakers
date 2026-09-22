import { seedCategories } from './categories'
import { seedIssues } from './issues'
import { seedUsers } from './users'

const keys = { users: 'changemakers_users', issues: 'changemakers_issues', categories: 'changemakers_categories' }

export function initializeDemoData() { if (!localStorage.getItem(keys.users)) localStorage.setItem(keys.users, JSON.stringify(seedUsers)); if (!localStorage.getItem(keys.issues)) localStorage.setItem(keys.issues, JSON.stringify(seedIssues)); if (!localStorage.getItem(keys.categories)) localStorage.setItem(keys.categories, JSON.stringify(seedCategories)) }
export function getData(type) { initializeDemoData(); return JSON.parse(localStorage.getItem(keys[type]) || '[]') }
export function setData(type, value) { localStorage.setItem(keys[type], JSON.stringify(value)); window.dispatchEvent(new Event('changemakers-data-change')) }
export function formatDate(date = new Date()) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) }
export function formatDateTime(date = new Date()) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(date)) }
export const getIssues = () => getData('issues'); export const saveIssues = (issues) => setData('issues', issues)
export const getUsers = () => getData('users'); export const saveUsers = (users) => setData('users', users)
export const getCategories = () => getData('categories'); export const saveCategories = (categories) => setData('categories', categories)
