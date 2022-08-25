import { getUsers, validatePwd, User } from "./user"

export interface Auth {
    login: (userName: string, pwd: string) => any // i.e JWT
    logout: (props: any) => void 
    renewToken: () => any
    request: (url: string, params: any) => any
}

class TestLogin implements Auth {
    token?: {value: number, issued: number}
    users?: User[]
    stateHack?: () => void


    constructor() {
        this.init()
        const prevToken = window.localStorage.getItem('test-login-token')

        if (prevToken) this.token = JSON.parse(prevToken)
    }

    init = async() => {
        this.users = await getUsers()
        if (this.stateHack) this.stateHack()
    }
    
    login = (userName: string, pwd: string) => {
        if (!this.users) return {status: 'denied', reason: 'service not ready'}

        const user = this.users.find(u => u.name === userName)

        if (!user) return {status: 'denied', reason: 'no user'}
        if (!validatePwd(userName, pwd)) return {status: 'denied', reason: 'wrong pwd'}
        
        this.generate()

        return {status: 'admitted', token: this.token}
        
    }

    generate = () => {        
        this.token = {value: Math.random(), issued: (new Date()).valueOf()}
        window.localStorage.setItem('test-login-token', JSON.stringify(this.token))
    }

    logout = (props: any) => this.token = undefined

    renewToken = () => {
        if (!this.token) return
        
        if ((new Date().valueOf()) - this.token.issued > 60 * 60 * 1000) return
        
        this.generate()
        return this.token
    }

    request = (url: string, params: RequestInit) => {
    
        if (!this.token) return

        // if the token is about to expire, renew
        
        const headers = {...(params.headers || {}), Authorization: JSON.stringify(this.token)}

        console.log(headers)

        return 200

        // return fetch(url, {...params, headers: headers})
    }
}


export default new TestLogin()