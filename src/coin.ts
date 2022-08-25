
export type Entry = {
    from: string
    to: string
    amount: number
}

type ChainEntry = Entry & {date: Date}

export type ChainBlock = {
    hash: number
    prevBlockHash: number
    entries: ChainEntry[]
}

const simpleHash = (key: string, seed = 19) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < key.length; i++) {
        ch = key.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

enum BlockCmp {same, hash, prev, entries, active_hash}

export class Coin {
    chain?: ChainBlock[]
    block?: ChainBlock
    private hashFn?: (key: string) => number

    get ready() { return !!(this.chain) && !!(this.hashFn) && !!(this.block) }

    setHashFn = (hashFn: (key: string) => number) => this.hashFn = hashFn    

    init = () => {
        if (this.ready) return

        const genesis: ChainBlock = {hash: 0x0, prevBlockHash: 0x0, entries: []}

        this.chain = [genesis]
        this.block = this.chain[0]

        if (!this.hashFn) this.hashFn = simpleHash
    }

    private validateEntry = (entry: Entry) => true


    addEntry = (entry: Entry) => {
        if (!this.validateEntry(entry)) return
        if (!this.ready) return

        if (this.block!.entries.length === 5) this.addBlock()
        
        this.block!.entries = [...this.block!.entries, {...entry, date: new Date()}]
        const blockHashAfter =  this.currentBlockHash()
        this.block!.hash = blockHashAfter
        return blockHashAfter
    }

    getEntry = (hash: number) => {
        
    }

    private sameBlock: (a: ChainBlock, b: ChainBlock) => BlockCmp = (a,b) => {
        if (a.hash !== b.hash) return BlockCmp.hash
        if (a.prevBlockHash !== b.prevBlockHash) return BlockCmp.prev
        if (a.entries.length !== b.entries.length) return BlockCmp.entries
        if (this.blockHash(a) !== this.blockHash(b)) return BlockCmp.active_hash

        return BlockCmp.same
    }

    validateChain = () => {
        if (!this.ready) return

        let block: ChainBlock = {hash: 0x0, prevBlockHash: 0x0, entries: []}
        let problems: {orginal: ChainBlock, test: ChainBlock}[] = []

        for (const cblock of this.chain!) {
            for (const entry of cblock.entries) {
                block.entries = [...block.entries, entry]
                block.hash = this.blockHash(block)
            }

            const cmp = this.sameBlock(cblock, block)

            if (cmp !== BlockCmp.same) {
                console.log('problem', BlockCmp[cmp])
                problems.push({orginal: cblock, test: block})
            }

            block.prevBlockHash = block.hash
            block.entries = []
        }

        return problems
    }


    currentBlockHash = () => this.hashFn!(JSON.stringify(this.block!))
    blockHash = (block: ChainBlock) => this.hashFn!(JSON.stringify(block))

    
    private addBlock() {
        if (!this.ready) return

        const block: ChainBlock = {hash: this.block!.hash, prevBlockHash: this.block!.hash, entries: []}

        this.chain = [...this.chain!, block]
        this.block = this.chain[this.chain.length - 1]
    }
}




