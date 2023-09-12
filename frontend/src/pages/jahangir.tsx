import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "../components/LittleMartian";
import jahangir from "../martians/jahangir";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Jahangir - Little Martians</title>
        <meta name="description" content="Jahangir - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={jahangir} />
    </div>
  );
};

export default Home;
