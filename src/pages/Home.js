import React from 'react';
import './App.css'
// import { SiBlockchaindotcom } from "react-icons/si";

import block from './images/blockchain.png'
// import blockTo from '../public/images/blockchain.png'

const Home = () => {
    return (
        <div>
            <img src={block} className="logo react" alt='' />
            {/* <img src={blockTo} alt='' /> */}
        </div>
    );
};

export default Home;
