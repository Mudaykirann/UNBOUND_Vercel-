import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [currentuser, setcurrentuser] = useState(JSON.parse(localStorage.getItem('user')))

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentuser));
    }, [currentuser]);

    return (
        <UserContext.Provider value={{ currentuser, setcurrentuser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;