'use client'
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import Image from "next/image"
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import FileSaver from "file-saver"

export default function page(){
  const [QR , setQR] = useState("")
  const [QRwithTitle , setQRwithTitle] = useState("")
  const [title , setTitle] = useState("")
  const [url , setURL] = useState("")
  const [validURL , setValidURL] = useState<String | null>(null)
  const [filename , setFielname] = useState("")
  const [customFilename , setCustomFilename] = useState("")
  async function getQRofURL(url:string) {
    const qr = await QRCode.toDataURL(url , {
      width : 400,
      margin : 1 ,
      type : "image/png"
    })
    return qr
  }

  async function getImageFromElement(id : any){
    const e = document.getElementById(id) as HTMLElement
    const image = toPng(e)

    return image
  }

  useEffect(()=>{
    async function doItwithAsync(){
      const qr =  await getQRofURL(url)
      setQR(qr)
      const imageQR = await getImageFromElement("qr")
      setQRwithTitle(imageQR)
    }

    if(url != ""){
      doItwithAsync()
      try{
        const newURL = new URL(url)
        setFielname(newURL.hostname)
        setValidURL(null)
      }
      catch{
        setValidURL("Your url may not valid")
      }
    }
    else {
      setFielname("untitled")
      setValidURL(null)
    }

  },[url , title])

  function clearURL(){
    //@ts-ignore
    document.getElementById("urlform").value = ""
    setURL("")
  }


  return (
    <div className="bg-slate-600 md:h-screen h-fit flex flex-col items-center pt-24 md:w-auto">
      <div id="qr" className="bg-white h-fit flex flex-col items-center md:w-auto w-11/12">
          {url == "" ? <h1 className="w-400 h-400 text-center"><p className="pt-48">Your qrcode show here!!</p></h1> : <Image src={QR} width={400} height={400} alt =""></Image>}
          {title === "" ? null : <h1 className="font-bold text-2xl pt-0 py-0">{title}</h1>}
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="title" className="text-white">setTitle</label>
        <input name="title" type="text" className="border border-blue-500 rounded-md" maxLength={25} onChange={e =>{
          setTitle(e.target.value)
        }} />
      </div>
      <div className="flex flex-col items-center">
        <label htmlFor="url" className="text-white">setURL</label>
        {validURL != null ? <p className="text-red-500">{validURL}</p> : null}
        <div className="flex flex-row">
          <input name="url" id="urlform" type="text" className="border border-blue-500 rounded-md ml-16 mr-1" onChange={e =>{
            setURL(e.target.value)
          }} />
          <button className="bg-white ml-2 rounded-md md:px-2 px-1" onClick={ clearURL }>clear</button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <label htmlFor="title" className="text-white">setFilename</label>
        <input name="title" type="text" className="border border-blue-500 rounded-md" maxLength={25} onChange={e =>{
          setCustomFilename(e.target.value)
        }} />
      </div>
      <button onClick={()=>{
        FileSaver.saveAs(QRwithTitle , `${customFilename === "" ? filename : customFilename}.png`)
      }} className="bg-white mt-3 rounded-md px-2">Download</button>
    </div>
  )
}