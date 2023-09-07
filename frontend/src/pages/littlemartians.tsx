import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import "antd/dist/reset.css";

import martians from "../martians";

const Home: NextPage = () => {
  
  return (
    <div>
      <Head>
        <title>Little Martians</title>
        <meta name="description" content="App template interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <LittleMartian /> */}
      {martians.map((martian) => (
        <div key={martian.key}>
          <h1><a href={`/${martian.key}`}>{martian.name}</a></h1>
        </div>
      ))}
    </div>
  );
};

export default Home;
