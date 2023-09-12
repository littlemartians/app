import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "../components/LittleMartian";
import cabloclus from "../martians/cabloclus";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Cabloclus - Little Martians</title>
        <meta name="description" content="Cabloclus - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={cabloclus} />
    </div>
  );
};

export default Home;
