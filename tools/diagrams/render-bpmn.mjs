import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

const root = resolve(import.meta.dirname, '../..');

export async function renderBpmn(source, output) {
  const xml = readFileSync(source, 'utf8');
  const viewerScript = readFileSync(resolve(root, 'node_modules/bpmn-js/dist/bpmn-viewer.production.min.js'), 'utf8');
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><html><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({ content: viewerScript });
    const svg = await page.evaluate(async (bpmnXml) => {
      const viewer = new BpmnJS({ container: '#canvas' });
      await viewer.importXML(bpmnXml);
      const result = await viewer.saveSVG();
      viewer.destroy();
      return result.svg;
    }, xml);
    writeFileSync(output, svg, 'utf8');
  } finally {
    await browser.close();
  }
}
