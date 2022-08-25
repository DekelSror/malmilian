import { Button, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import authService from "./auth"
import { Entry } from './coin'
import {Market} from './market';
import { User, userBalance } from './user';


const MoveCoins = ({user, market}: {user: User, market: Market}) => {
    const [entry, setEntry] = useState<Entry>({from: user.name, to: '', amount: 0})
    const {coin, users} = market
    

    return <Stack width='50%' margin={10} spacing={3} >

        <Typography> Your Balance: {userBalance(user)} </Typography>

        <Select variant='outlined' type='text' value={entry.to} onChange={e => setEntry({...entry, to: e.target.value as string})} >
            {users!.filter(u => u !== user).map(u => <MenuItem key={u.name} value={u.name} >{u.name}</MenuItem>)}
        </Select>

        <TextField type='number' value={entry.amount} inputProps={{step: 1}} label='amount' onChange={e => setEntry({...entry, amount: +e.target.value})} />

        <Stack direction='row' spacing={4}>
            <Button 
                sx={{width: 100}}
                size='small'
                variant='contained'
                onClick={() => {
                    if (entry.to !== '' && entry.amount > 0) {
                        market.executeTransaction(entry)

                        setEntry({from: 'Alice', to: '', amount: 0})
                }
            }} > do! </Button>

            <Button 
                sx={{width: 200}}
                size='small'
                variant='contained'
                onClick={() => {
                    console.log(coin.validateChain())
                }}
            > validate chain </Button>
        </Stack>

        {coin.chain!.map((block, i) => <Typography key={i}>{i}/0x{block.hash.toString(16)}</Typography>)}
        <Typography> 0x{coin.currentBlockHash().toString(16)} </Typography>
        {coin.block!.entries.map(entry => <div key={entry.from + entry.to + entry.amount}>
            from {entry.from} to {entry.to} amount {entry.amount}
        </div>)}

    </Stack>
}


const Login = ({onLogin}: {onLogin: (username: string, pwd: string) => void}) => {
    const [username, set_username] = useState('')
    const [pwd, set_pwd] = useState('')

    return <Stack spacing={3}>
        <TextField value={username} type='text' label='username' onChange={e => set_username(e.target.value)} />
        <TextField value={pwd} type='text' label='pwd' onChange={e => set_pwd(e.target.value)} />
        <Button 
            variant='contained' 
            disabled={pwd === '' || username === ''} 
            onClick={() => onLogin(username, pwd)} 
        >
            login
        </Button>
    </Stack>
}

const market = new Market(authService)

const App = () => {
    const [x, xx] = useState(true)
    const [phase, setPhase] = useState(0)
    const [user, setUser] = useState<User>()

    market.stateHack = () => xx(!x)
    authService.stateHack = () => xx(!x)

    useEffect(() => {
        if (market.users) setPhase(1)
    }, [market.users])


    return <Stack alignItems='center' justifyContent='center' padding={15}>
        {phase === 0 && <div>loading users...</div>}
        {phase === 1 && <Login 
            onLogin={(username, pwd) => {
                const res = authService.login(username, pwd)
                console.log(res)

                if (res.status === 'admitted') {
                    setUser(market.users!.find(u => u.name === username)!)
                    setPhase(2)
                }

            }} 
        />}
        {phase === 2 && user && <MoveCoins user={user} market={market} />}
    </Stack> 
}

export default App
