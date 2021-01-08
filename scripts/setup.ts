import * as fs from "fs";
import { generatePrhFile } from "@fal-works/prh-from-words";

(async () => {
  console.log("[setup] prh フォルダーの初期化を開始します。");
  await fs.promises.rm("prh", { recursive: true, force: true });
  await fs.promises.mkdir("prh");

  const generatePatterns = generatePrhFile(
    "lint-config/pattern-list.yaml",
    "prh/patterns.yaml",
    (line) => {
      const beforeAfter = line.split("=>").map((s) => s.trim());
      let before: string;
      let after: string;

      switch (beforeAfter.length) {
        case 1:
          before = after = beforeAfter[0];
          break;
        case 2:
          before = beforeAfter[0];
          after = beforeAfter[1];
          break;
        default:
          throw `invalid input: ${line}`;
      }

      return {
        pattern: `/(?<!\\w)${before}(?![\\w-])/i`,
        expected: after,
        prh: `正しくは ${after} です。`,
      };
    }
  );

  return generatePatterns.catch((reason) => {
    console.error("[setup error] prh のルール生成に失敗しました。");
    return Promise.reject(reason);
  });
})().then(
  () => console.log("[setup] prh フォルダーの初期化を完了しました。"),
  (reason) => {
    console.error("[setup] prh フォルダーの初期化に失敗しました。");
    console.error(reason);
  }
);
