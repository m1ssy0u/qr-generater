'use client';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import FileSaver from 'file-saver';

export default function Page() {
  const [QR, setQR] = useState('');
  const [QRwithTitle, setQRwithTitle] = useState('');
  const [title, setTitle] = useState('');
  const [url, setURL] = useState('');
  const [filename, setFilename] = useState('');
  const [customFilename, setCustomFilename] = useState('');
  const [validURL, setValidURL] = useState<string | null>(null);

  async function generateQRCode(url: string) {
    const qr = await QRCode.toDataURL(url, {
      width: 400,
      margin: 1,
      type: 'image/png',
    });
    setQR(qr);
  }

  async function getImageFromElement(id: string) {
    const element = document.getElementById(id) as HTMLElement;
    if (element) {
      const image = await toPng(element, {
        cacheBust: true,
      });
      return image;
    }
    return null;
  }

  useEffect(() => {
    async function generate() {
      if (url) {
        try {
          const newURL = new URL(url);
          setFilename(newURL.hostname);
          setValidURL(null);
          await generateQRCode(url);
          const imageWithTitle = await getImageFromElement('qr');
          if (imageWithTitle) {
            setQRwithTitle(imageWithTitle);
          }
        } catch {
          setValidURL('Your URL may not be valid.');
        }
      } else {
        setFilename('untitled');
        setValidURL(null);
      }
    }
    generate();
  }, [url, title]);

  const handleDownload = () => {
    if (QRwithTitle) {
      const finalFilename = customFilename || filename || 'qrcode';
      FileSaver.saveAs(QRwithTitle, `${finalFilename}.png`);
    }
  };

  return (
    <div className="bg-gray-900 h-fit flex flex-col items-center pt-24">
      <div id="qr" className="bg-white flex flex-col items-center">
        {QR ? (
          <img src={QR} alt="QR Code" width={400} height={400} />
        ) : (
          <p>Your QR code will appear here!</p>
        )}
        {title && <h1 className="font-bold text-2xl">{title}</h1>}
      </div>

      <div className="flex flex-col items-center mt-4">
        <label htmlFor="title" className="text-white">
          Title
        </label>
        <div className="flex">
          <input
            id="titleform"
            type="text"
            maxLength={20}
            className="border border-blue-500 rounded-md"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="bg-white ml-2 rounded-md px-2"
            onClick={() => setTitle('')}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <label htmlFor="url" className="text-white">
          URL
        </label>
        {validURL && <p className="text-red-500">{validURL}</p>}
        <div className="flex">
          <input
            id="urlform"
            type="text"
            className="border border-blue-500 rounded-md"
            onChange={(e) => setURL(e.target.value)}
          />
          <button
            className="bg-white ml-2 rounded-md px-2"
            onClick={() => setURL('')}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <label htmlFor="customfilename" className="text-white">
          Custom Filename
        </label>
        <div className="flex">
          <input
            id="customfilenameform"
            type="text"
            className="border border-blue-500 rounded-md"
            onChange={(e) => setCustomFilename(e.target.value)}
          />
          <button
            className="bg-white ml-2 rounded-md px-2"
            onClick={() => setCustomFilename('')}
          >
            Clear
          </button>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="bg-white mt-3 rounded-md px-2"
      >
        Download
      </button>
    </div>
  );
}
