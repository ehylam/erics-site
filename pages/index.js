import Head from 'next/head';
import { useEffect, useRef, Suspense } from 'react';
import Canvas from '../components/Canvas';
import Hero from '../components/Hero';
import Section from '../components/Section';
import ThreeImage from '../components/ThreeImage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Home() {
  gsap.registerPlugin(ScrollTrigger);
  const content = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, voluptatum qui aliquid tempora quasi, similique natus temporibus error optio mollitia cupiditate quaerat eos nemo, minus impedit! Reprehenderit architecto alias, sunt quod voluptatem aliquam dolores odit autem consequuntur, illo et? Expedita eum qui accusamus voluptates. Nemo exercitationem voluptatibus est quos? Eaque.";

  return (
    <main>
      <Head>
        <title>Eric&apos;s Site</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="scrollable">
        <Canvas />
        <Hero />
        <ThreeImage src="./images/pic1.jpeg"/>
        <ThreeImage src="./images/pic2.jpeg"/>
        <ThreeImage src="./images/pic3.jpeg"/>
      </div>

    </main>
  )
}
