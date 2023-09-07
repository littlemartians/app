import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import LittleMartian from "components/LittleMartian";
import femina from "../martians/femina";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Femina - Little Martians</title>
        <meta name="description" content="Femina - Little Martians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LittleMartian martian={femina} />
    </div>
  );
};

export default Home;
