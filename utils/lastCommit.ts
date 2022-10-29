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
      commit: matchStr(logStr, new RegExp("(?<=commit).+", "g")),
      merge: matchStr(logStr, new RegExp("(?<=Merge:).+", "g")),
      author: matchStr(logStr, new RegExp("(?<=Author:).+", "g")),
      date: dateFormat(matchStr(logStr, new RegExp("(?<=Date:).+", "g"))),
      info: matchStr(logStr, new RegExp("\n\n.*", "g")),
      branch: matchStr(logBranchStr, new RegExp("(?<=\*\s)\S+")),
      buildTime: dateFormat(new Date()),
    };
  } catch (err) {
    throw new Error(err);
  }
}
