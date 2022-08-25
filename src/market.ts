import { Auth } from "./auth"
import { Coin, Entry } from "./coin"
import { User, getUsers, userBalance } from "./user"

export class Market {
    users?: User[]
    coin: Coin
    auth: Auth
    stateHack?: () => void

    constructor(auth: Auth) {
        this.coin = new Coin()
        this.coin.init()
        this.auth = auth
        this.init()

    }

    init = async() => {
        this.users = await getUsers()
        if (this.stateHack) this.stateHack()
    }

    
    executeTransaction = (entry: Entry) => {
        if (!this.users) return

        const uFrom = this.users.find(u => u.name === entry.from)
        const uTo = this.users.find(u => u.name === entry.to)
    
        if (!(uFrom && uTo)) return

        if (userBalance(uFrom) < entry.amount) return

        this.coin.addEntry(entry)
        uFrom.debts.push(entry)
        uTo.entries.push(entry)

    }
}
