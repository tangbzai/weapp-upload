import { LastCommitType } from "../..";

/**
 * 格式化描述
 */
export default function formatDescription(
  description?: string,
  baseData?: { version?: string } & LastCommitType
) {
  if (!description) return undefined;
  const mapping = {
    "${TIME}": baseData.buildTime,
    "${VERSION}": baseData.version,
    "${AUTHOR}": baseData.author,
    "${BRANCH}": baseData.branch,
    "${COMMIT}": baseData.commit,
    "${DATE}": baseData.date,
    "${INFO}": baseData.info,
  };
  return Object.entries(mapping).reduce(
    (des, [tmp, val]) => des.replace(tmp, val),
    description
  );
}
