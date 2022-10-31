import { createInterface } from "readline";

/**
 * Promise 版的 question
 */
export default function question(query: string): Promise<string> {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readline.question(query, (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}
