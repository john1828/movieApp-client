// import React from "react";
// const UserContext = React.createContext();
// export const UserProvider = UserContext.Provider;
// export default UserContext;

import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => ({
        token: localStorage.getItem('token') || null
    }));

    useEffect(() => {
        console.log("User context token:", user.token);
    }, [user]);

    function unsetUser() {
        localStorage.removeItem('token');
        setUser({ token: null });
    }

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;