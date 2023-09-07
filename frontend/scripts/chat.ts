import readline from 'readline';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import martians from '../src/martians';
import dotenv from 'dotenv';
import https from 'https';

const streaming = false;

dotenv.config();

const argv = process.argv.slice(2);
if (!argv.length) {
  console.log("No Martian specified");
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const martian = martians.filter((m) => m.key === argv[0])[0];
if (!martian) {
  console.log("No such Martian");
  process.exit(1);
}

let conversation : ChatCompletionRequestMessage[] = [{
  "role": "system",
  "content": martian.systemPrompt
}]
conversation = conversation.concat(martian.messages as ChatCompletionRequestMessage[])

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

console.log(`\n\n=================== Conversation with ${martian.name} ===================`)
console.log(conversation)
console.log("\n\n ---- start chatting ----\n\n")


async function chat_stream(config: any) {
  return new Promise<string>(async (resolve, reject) => {
    let answer = '';
    try {
      const res = await openai.createChatCompletion({
        ...config,
        stream: true,
      }, { responseType: 'stream' });
      res.data.on('data', (data: any) => {
        const lines = data.toString().split('\n').filter((line: string) => line.trim() !== '');
        for (const line of lines) {
          const message = line.replace(/^data: /, '');          
          if (message === '[DONE]') {
            resolve(answer);
            return;
          }
          try {
            const parsed = JSON.parse(message);
            const delta = parsed.choices[0].delta.content;
            if (delta) {
              answer += delta;
              process.stdout.write(delta);
            }
          } catch(error) {
            resolve(answer);
          }
        }
      });
    } catch (error: any) {
      reject(error);
    }
  });
}


async function converse() {
  rl.question('\x1b[32mHuman\x1b[0m: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
    } else if (input.toLowerCase() === 'new') {
      conversation = martian.messages as ChatCompletionRequestMessage[];
      console.log("\n\n=====================================================================\n\n")
      await converse();
    } else {
      conversation.push({
        "role": "user", 
        "content": input
      });
      let answer;
      if (streaming) {
        process.stdout.write(`\x1b[31m${martian.name}\x1b[0m: `);
        answer = await chat_stream({
          model: "gpt-3.5-turbo",
          messages: conversation,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      }
      else {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: conversation,
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });    
        answer = response?.data?.choices[0].message?.content || "error";
        console.log(`\x1b[31m${martian.name}\x1b[0m: ${answer}`);
      }
      conversation.push({
        "role": "assistant", 
        "content": answer
      });
      console.log("\n")
      await converse();
    }
  });
}

converse();

