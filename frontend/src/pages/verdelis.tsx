import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "../components/LittleMartian";
import verdelis from "../martians/verdelis";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Nebulana - Little Martians</title>
        <meta name="description" content="Verdelis - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={verdelis} />
    </div>
  );
};

export default Home;
