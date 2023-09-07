import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "components/LittleMartian";
import lumis from "../martians/lumis";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Lumis - Little Martians</title>
        <meta name="description" content="Lumis - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={lumis} />
    </div>
  );
};

export default Home;
