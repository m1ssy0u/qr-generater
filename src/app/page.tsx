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
  const [filename , setFilename] = useState("")
  const [customFilename , setCustomFilename] = useState("")
  const [isDisabled , setIsDisabled] = useState("disabled")


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
      document.getElementById("download")?.removeAttribute("disabled")
      doItwithAsync()
      try{
        const newURL = new URL(url)
        setFilename(newURL.hostname)
        setValidURL(null)
      }
      catch{
        setValidURL("Your url may not valid")
      }
    }
    else {
      document.getElementById("download")?.setAttribute("disabled" , "disabled")
      setFilename("untitled")
      setValidURL(null)
    }

  },[url , title])

  function clearURL(){
    //@ts-ignore
    document.getElementById("urlform").value = ""
    setURL("")
  }
  function clearTitle(){
    //@ts-ignore
    document.getElementById("titleform").value = ""
    setTitle("")
  }
  function clearCustomFilename(){

    //@ts-ignore
    document.getElementById("customfilenameform").value = ""
    setCustomFilename("")
  }


  return (
    <div className="bg-slate-600 md:h-full h-fit md:pb-0 pb-24 flex flex-col items-center pt-24 md:w-auto">
      <div id="qr" className="bg-white h-fit flex flex-col items-center md:w-auto w-11/12">
          {url == "" ? <h1 className="w-400 h-400 text-center"><p className="pt-48">Your qrcode show here!!</p></h1> : <Image src={QR} width={400} height={400} alt =""></Image>}
          {title === "" ? null : <h1 className="font-bold text-2xl pt-0 py-0">{title}</h1>}
      </div>

      <div className="flex flex-col items-center">
        <label htmlFor="title" className="text-white">setTitle</label>
        <div className="flex flex-row">
          <input name="title" id="titleform" type="text" maxLength={20} className="border border-blue-500 rounded-md ml-14mr-1" onChange={e =>{
            setTitle(e.target.value)
          }} />
          <button className="bg-white ml-2 rounded-md md:px-2 px-1" onClick={ clearTitle }>clear</button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <label htmlFor="url" className="text-white">setURL</label>
        {validURL != null ? <p className="text-red-500">{validURL}</p> : null}
        <div className="flex flex-row">
          <input name="url" id="urlform" type="text" className="border border-blue-500 rounded-md ml-14mr-1" onChange={e =>{
            setURL(e.target.value)
          }} />
          <button className="bg-white ml-2 rounded-md md:px-2 px-1" onClick={ clearURL }>clear</button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <label htmlFor="title" className="text-white">setFilename</label>
        <div className="flex flex-row">
          <input name="customfilename" id="customfilenameform" type="text" className="border border-blue-500 rounded-md ml-14mr-1" onChange={e =>{
            setCustomFilename(e.target.value)
          }} />
          <button className="bg-white ml-2 rounded-md md:px-2 px-1" onClick={ clearCustomFilename }>clear</button>
        </div>
      </div>
      <button onClick={()=>{
        FileSaver.saveAs(QRwithTitle , `${customFilename === "" ? filename : customFilename}.png`)
      }} className="bg-white mb-9 mt-3 rounded-md px-2 disabled:bg-gray-300 disabled:text-red disabled:cursor-not-allowed"  id="download">Download</button>
    </div>
  )
}
