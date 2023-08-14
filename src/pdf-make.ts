import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  Column,
  Content,
  ContentColumns,
  TDocumentDefinitions,
  TableCell,
} from 'pdfmake/interfaces';
import fs from 'node:fs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const buildHeader = async (
  url: string,
  urlClient: string
): Promise<Content> => {
  const logoClient = await fetchImage(urlClient);
  const logoClientBf = Buffer.from(logoClient);
  const logoClientBase64 = logoClientBf.toString('base64');
  const imgBase64 = await fetchImage(url);

  const imageBuffer = Buffer.from(imgBase64);
  // Convertir la imagen en formato Base64
  const imageBase64 = imageBuffer.toString('base64');
  return {
    alignment: 'justify',
    margin: [0, 0, 0, 50],
    columns: [
      {
        text: `Address: xxxx
              QuoteNumber: 1000`,
        // style: 'header',
        alignment: 'left',
      },
      // {
      //   image: 'data:image/png;base64,' + logoClientBase64,
      //   width: 160,
      //   height: 30,
      //   alignment: 'left',
      // },
      {
        // Columna 1: Imagen
        image: 'data:image/jpeg;base64,' + imageBase64,
        // fit: [100, 100], // Ajustar el tamaño de la imagen (opcional)
        width: 200,
        height: 50,
        alignment: 'center',
      },
    ],
  };
};

interface Idata {
  name: string;
  value: number;
}

const buildTables = async (): Promise<Content> => {
  const header = `Beyond Flood - Essential
  $284.48
  Your Property is Eligible for this Product, with Lower Coverage(s)
  than those Selected. Maximum Cov A/Cov C available is
  $250K/$125K.`;
  header;

  let tablesList: Column[] = [];
  let data: Idata[] = [
    {
      name: 'Deductible',
      value: 5000,
    },
    {
      name: 'DwellingLimit',
      value: 2000,
    },
    {
      name: 'Content Limit',
      value: 1000,
    },
    {
      name: 'Increased Cost of Compliance (in addition to Dwelling limit)',
      value: 3000,
    },
  ];

  for (let i = 0; i < 4; i++) {
    let bodyList: TableCell[][] = [];
    for (let ele of data) {
      let body: Content[] = [
        {
          text: `$${ele.value}\n${ele.name}`,
          style: 'contentTablesTier',
        },
      ];
      bodyList.push(body);
    }
    let content: Content = {
      // style: 'tableExample',
      table: {
        // widths: ['auto', 'auto', 'auto'],
        headerRows: 1,
        body: [
          [
            {
              text: header,
              style: 'headerTablesTier',
            },
          ],
          ...bodyList,
        ],
      },
      layout: {
        fillColor: function (rowIndex: any, node: any, columnIndex: any) {
          return rowIndex % 2 === 1 ? '#CCCCCC' : null;
        },
      },
    };
    tablesList.push(content);
  }

  return {
    alignment: 'justify',
    margin: [0, 25, 0, 25],
    columns: tablesList,
  };
};

const fetchImage = async (url: string): Promise<ArrayBuffer> => {
  const res = await fetch(url);
  return res.arrayBuffer();
};

const buidContent = async (): Promise<Content> => {
  const imgBase64 = await fetchImage(
    'https://e7.pngegg.com/pngimages/14/381/png-clipart-flag-fluttering-red-flag-miscellaneous-flag-thumbnail.png'
  );

  const imageBuffer = Buffer.from(imgBase64);
  // Convertir la imagen en formato Base64
  const imageBase64 = imageBuffer.toString('base64');
  return {
    alignment: 'justify',
    columnGap: 5,
    fontSize: 8,
    columns: [
      {
        margin: [0, 5, 0, 5],
        columns: [
          {
            image: 'data:image/jpeg;base64,' + imageBase64,
            width: 15,
            height: 15,
            alignment: 'center',
          },
          {
            text: 'Lorem Ipsum is and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            alignment: 'left',
          },
        ],
      },
      {
        margin: [0, 5, 0, 5],
        columns: [
          {
            image: 'data:image/jpeg;base64,' + imageBase64,
            width: 15,
            height: 15,
            alignment: 'center',
          },
          {
            text: 'Lorem Ipsum is and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            alignment: 'left',
          },
        ],
      },
    ],
  };
};

const buildFooter = async (): Promise<Content> => {
  return {
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    // style: 'footer',
    fontSize: 8,
    alignment: 'center',
    margin: [0, 25, 0, 0], // Margen inferior de 10 unidades
  };
};

const buildTags = async (tag: string): Promise<Content> => {
  return {
    margin: [0, 10, 0, 10],
    columns: [
      {
        alignment: 'center',
        text: 'Coverage Options* | Underwritten by Direct General Insurance Company',
        fillColor: '#CCCCCC',
        background: '#CCCCCC',
        // border: [false, false, false, false],
        bold: true,
      },
    ],
  };
};

const createPDF = async () => {
  // Definir el contenido del documento
  const documentDefinition: TDocumentDefinitions = {
    content: [
      await buildHeader(
        'https://quickquote.beyondfloods.com/static/media/BF_Logo_with_Text.d819e341.png',
        'https://minio.ops.cuemby.net/cep/iep/flood/clients/logoPolicySimple.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YOURACCESSKEY%2F20230811%2F%2Fs3%2Faws4_request&X-Amz-Date=20230811T030300Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=1e49cf62af681712161ac4f4c2326dc0a9d30be49cce3dbd736ead8ccbb98c78'
      ),
      await buildTags(
        'Flood Risk Issues Found for Property, Given Coverages Chosen'
      ),
      await buidContent(),
      await buidContent(),
      await buidContent(),
      await buildTags(
        'Coverage Options* | Underwritten by Direct General Insurance Company'
      ),
      await buildTables(),
      await buildFooter(),
    ],
    styles: {
      header: {
        bold: true,
        fontSize: 12,
        margin: [0, 0, 0, 10], // Margen inferior de 10 unidades
      },
      paragraph: {
        margin: [0, 0, 0, 10], // Margen inferior de 10 unidades
        fontSize: 12,
      },
      tableExample: {
        margin: [0, 5, 0, 15], // Margen inferior de 15 unidades
      },
      imageHeader: {
        alignment: 'right',
      },
      //Tables
      headerTablesTier: {
        bold: true,
        fontSize: 14,
        alignment: 'center',
      },
      contentTablesTier: {
        fontSize: 10,
        alignment: 'center',
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };

  // Crear el documento PDF
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  // Obtener los bytes del PDF
  const pdfBytes = await new Promise<Buffer>((resolve, reject) => {
    pdfDocGenerator.getBuffer((buffer) => resolve(buffer));
  });
  // Guardar el PDF en el servidor
  fs.writeFileSync('pdfs/example-pdfmake.pdf', pdfBytes);
};

const main = async () => {
  await createPDF();
  console.log('PDF save!!');
};

main();
