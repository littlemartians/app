import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "components/LittleMartian";
import nebulana from "../martians/nebulana";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Nebulana - Little Martians</title>
        <meta name="description" content="Nebulana - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={nebulana} />
    </div>
  );
};

export default Home;
