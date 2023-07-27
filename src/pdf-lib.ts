import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import fs from 'node:fs';

const MARGIN_PAGE = 30;

// Images
// const jpgImageBytes = fetch("https://quickquote.beyondfloods.com/static/media/BF_Logo_with_Text.d819e341.png")
const fetchImage = async (url: string): Promise<ArrayBuffer> => {
  const res = await fetch(url);
  return res.arrayBuffer();
};

// Create a new PDFDocument
const createPDFDocument = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  // const page = pdfDoc.addPage([400, 200]);
  // const { font } = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
  return pdfDoc;
};

const newPage = async (pdf: PDFDocument): Promise<PDFPage> => {
  const page = pdf.addPage();
  // Agregar margen de 50 unidades a cada lado del documento
  const margin = MARGIN_PAGE;
  const startX = margin;
  const startY = page.getHeight() - margin;
  const fontSize = 12;
  const content = 'Este es el contenido del documento con márgenes.';
  page.drawText(content, {
    x: startX,
    y: startY - fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  // Agregar Fuente
  return page;
};

const buildHeader = () => {};

const buildTable = async (pdf: PDFDocument, page: PDFPage) => {
  const table = [
    ['Nombre', 'Edad', 'País'],
    ['Juan', '30', 'España'],
    ['María', '25', 'México'],
    ['Peter', '35', 'EE. UU.'],
  ];

  const tableWidth = 350;
  const tableHeight = 150;
  const cellMargin = 10;
  const tableX = page.getWidth() - MARGIN_PAGE;
  const tableY = page.getHeight() - MARGIN_PAGE - 100;

  // const { font } = await pdf.embedFont("A3", )
  const timesRomanFont = await pdf.embedFont(StandardFonts.TimesRoman);

  const drawTable = (
    content: string[][],
    startX: number,
    startY: number,
    rowHeight: number,
    colWidth: number[]
  ) => {
    let x = startX;
    let y = startY;

    for (let i = 0; i < content.length; i++) {
      for (let j = 0; j < content[i].length; j++) {
        const text = content[i][j];
        const textWidth = timesRomanFont.widthOfTextAtSize(text, 10);
        const cellWidth = colWidth[j];

        const padding = (cellWidth - textWidth) / 2;
        const textX = x + padding;
        const textY = y - (rowHeight - 10) / 2;

        page.drawText(text, {
          x: textX,
          y: textY,
          size: 10,
          color: rgb(0, 0, 0),
        });

        x += cellWidth;
      }

      y -= rowHeight;
      x = startX;
    }
  };

  const rowHeight = 20;
  const colWidth = [100, 50, 100];

  drawTable(table, tableX, tableY, rowHeight, colWidth);
};

// Embed the JPG image bytes and PNG image bytes
const embedImage = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  pngImageBytes: ArrayBuffer
) => {
  // const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
  const pngImage = await pdfDoc.embedPng(pngImageBytes);
  // Get the width/height of the PNG image scaled down to 50% of its original size
  const pngDims = pngImage.scale(0.25);

  // Draw the PNG image near the lower right corner of the JPG image
  page.drawImage(pngImage, {
    x: page.getWidth() / 2 - MARGIN_PAGE,
    y: page.getHeight() - pngDims.height - MARGIN_PAGE,
    // y: 750,
    width: pngDims.width,
    height: pngDims.height,
  });

  const pdfBytes = await pdfDoc.save();
};

const main = async () => {
  const imageArrayBuffer = await fetchImage(
    'https://quickquote.beyondfloods.com/static/media/BF_Logo_with_Text.d819e341.png'
  );

  const pdf = await createPDFDocument();
  const page1 = await newPage(pdf);
  await embedImage(pdf, page1, imageArrayBuffer);
  await buildTable(pdf, page1);
  const pdfBytes = await pdf.save();
  fs.writeFileSync('pdf/output-pdflib.pdf', pdfBytes);
  console.log('PDF save!!');
};

main();
