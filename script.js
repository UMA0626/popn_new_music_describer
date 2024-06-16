import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import textencofing from 'text-encoding';
const { TextDecoder } = textencofing;

const baseURL = 'https://popn.wiki';

const decode = async (res) => {
  const buf = await res.arrayBuffer();
  const isUTF8 = res.headers.get("Content-Type").includes("UTF-8") || res.headers.get("Content-Type").includes("utf-8");
  return isUTF8
    ? (new TextDecoder).decode(buf)
    : (new TextDecoder("Shift-JIS")).decode(buf);
};

const main = async () => {
  const htmlres = await fetch(`${baseURL}/sidebar?do=recent`);
  const html = await decode(htmlres);

  const dom = new JSDOM(html);
  const elms = dom.window.document.querySelectorAll("#dw__recent > div.no > ul > li > div > a.wikilink1");

  const musics = Array.from(elms)
    .map(el => el.textContent.replace("(E)", "").replace("(N)", "").replace("(H)", "").replace("(EX)", ""))
    .filter(m => !m.startsWith("Lv")
      && !m.startsWith("■Lv")
      && !m.startsWith("削除曲・対象外曲")
      && !m.startsWith("譜面完成早見表")
      && !m.startsWith("ポップンミュージック UniLab")
      && !m.startsWith("キャラクター担当曲")
      && !m.startsWith("S乱クリア難易度表")
      && !m.startsWith("score:")
    );
  console.log('musics', [...new Set(musics)]);
}

main();
