'use client'

import React from 'react'
import { useState , useEffect } from 'react'
import QRcode from 'qrcode'
import Image from 'next/image'
type Props = {
  url : String
}

export default function QrImage({}: Props) {
    const [qrCode , setQrCode] = useState("")
    async function genQR(url : string) {
        const qr = await QRcode.toDataURL(url ,{
          width : 1000 ,
          margin : 1 ,
          type : "image/png"
        })
        setQrCode(qr)
      }
      useEffect(()=>{
        genQR("https://www.facebook.com/")
      })
  return (
    <div id='qr' className='w-fit h-fit bg-white flex flex-col items-center'> 
        <Image height={1000} width={1000} src={qrCode} alt=''></Image>
    <h1 className='w-auto bg-green-500 inline-block'>Title</h1>
  </div>
  )
}