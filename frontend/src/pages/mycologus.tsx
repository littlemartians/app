import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "../components/LittleMartian";
import mycologus from "../martians/mycologus";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Mycologus - Little Martians</title>
        <meta name="description" content="Mycologus - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={mycologus} />
    </div>
  );
};

export default Home;
