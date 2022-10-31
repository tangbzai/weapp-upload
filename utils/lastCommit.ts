import { execSync } from "child_process";
import type { LastCommitType } from "../index.d";
import dateFormat from "./dateFormat";

function matchStr(baseString: string, regex: RegExp): string {
  return baseString.match(regex)?.[0]?.trim();
}

export default function lastCommit(): LastCommitType {
  try {
    const logStr = execSync("git log -1").toString();
    const logBranchStr = execSync("git branch").toString();
    return {
      commit: matchStr(logStr, /(?<=commit).+/g),
      merge: matchStr(logStr, /(?<=Merge:).+/g),
      author: matchStr(logStr, /(?<=Author:).+/g),
      date: dateFormat(matchStr(logStr, /(?<=Date:).+/g)),
      info: matchStr(logStr, /\n\n.*/g),
      branch: matchStr(logBranchStr, /(?<=\*\s)\S+/),
      buildTime: dateFormat(new Date()),
    };
  } catch (err) {
    throw new Error(err);
  }
}
