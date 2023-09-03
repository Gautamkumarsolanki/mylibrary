import React, { useState } from 'react'
import Navbar from './Navbar'
import Dashboard from './Dashboard'
import BookList from './BookList'

export default function Home() {
    const [view, setView] = useState(0);
    console.log(view);
    return (
        <>
            <Navbar view={view} setView={setView} />
            <div style={{ marginTop: '8rem' }}>
                {view === 1 ? <Dashboard /> :
                    <BookList setView={setView}/>}
            </div>
        </>
    )
}
