import { Entry } from "./coin"

export type User = {
    name: string
    entries: Entry[]
    debts: Entry[]
}

type AuthUser = User & {pwd: string}

const test_users: AuthUser[] = [
    { name:'Alice', pwd: '1234', entries: [{from: 'source', to: 'Alice', amount: 1000}], debts: []},
    { name:'Bob', pwd: '1234', entries: [{from: 'source', to: 'Bob', amount: 1000}], debts: []},
    { name:'Cat', pwd: '1234', entries: [{from: 'source', to: 'Cat', amount: 1000}], debts: []},
    { name:'Dylan', pwd: '1234', entries: [{from: 'source', to: 'Dylan', amount: 1000}], debts: []},
    { name:'Euphoria', pwd: '1234', entries: [{from: 'source', to: 'Euphoria', amount: 1000}], debts: []},
    { name:'Fart', pwd: '1234', entries: [{from: 'source', to: 'Fart', amount: 1000}], debts: []},
    { name:'Gillermo', pwd: '1234', entries: [{from: 'source', to: 'Gillermo', amount: 1000}], debts: []},
    { name:'Hamster', pwd: '1234', entries: [{from: 'source', to: 'Hamster', amount: 1000}], debts: []},
]

export const getUsers: () => Promise<User[]> = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(test_users.map(u => ({name: u.name, entries: u.entries, debts: u.debts}))), 200)
    })
}

export const validatePwd: (username: string, pwd: string) => Promise<boolean> = (username, pwd) => {
    return new Promise((resolve, reject) => {
        const user = test_users.find(u => u.name === username)
        setTimeout(() => resolve(Boolean(user && user.pwd === pwd)), 100)
    })
}

export const userBalance = (u: User) => {
    const sEntries = u.entries.reduce((sum, e) => sum + e.amount, 0)
    const sDebts = u.debts.reduce((sum, e) => sum + e.amount, 0)

    return sEntries - sDebts
}