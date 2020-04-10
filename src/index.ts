import express from 'express';
import fetch from 'node-fetch';
import { config as dotenv, DotenvParseOutput } from 'dotenv';

// Parse .env config
let envParsed = dotenv();
if (envParsed.error) {
  throw envParsed.error;
}
const config = dotenv().parsed as DotenvParseOutput;

console.log(`WEATHERMAPS_API_KEY: ${config.WEATHERMAPS_API_KEY}`);