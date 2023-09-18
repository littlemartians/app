import axios from 'axios';
import dotenv from 'dotenv';
import {EdenClient} from "@edenlabs/eden-sdk";
dotenv.config();

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_API_SECRET = process.env.EDEN_API_SECRET;

const eden = new EdenClient({
  apiKey: EDEN_API_KEY,
  apiSecret: EDEN_API_SECRET,
});

const pollForTask = async function(pollingInterval: number, taskId: string) {
  let finished = false;
  while (!finished) {
    const taskResult = await eden.tasks.get({taskId: taskId});
    console.log(taskResult);
    if (taskResult?.task?.status == "faled") {
      throw new Error('Failed')
    }
    else if (taskResult?.task?.status == "completed") {
      finished = true;
      const url = taskResult?.task?.output?.files[0];
      return url;
    }
    await new Promise(resolve => setTimeout(resolve, pollingInterval))
  }
}

const create = async (prompt: string) => {
  
  const config = {
    width: 768,
    height: 768,
    text_input: prompt,
  };

  console.log(config);

  const taskResult = await eden.tasks.create({
    generatorName: "create", 
    config: config
  });

  if (!taskResult || !taskResult.taskId || taskResult.error) {
    console.log(taskResult.error);
    return;
  }
  
  const result = await pollForTask(5000, taskResult.taskId);
  
  if (result.error) {
    console.log(result.error);
    return;
  }

  return result;
};

export default create;