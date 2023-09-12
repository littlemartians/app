import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "../components/LittleMartian";
import conga from "../martians/conga";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Conga - Little Martians</title>
        <meta name="description" content="App template interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={conga} />
    </div>
  );
};

export default Home;
