import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { app } from '../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined)
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        console.log(progress);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }))
      }
    );
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>

        <input
          onChange={(e) => setFile(e.target.files[[0]])}
          type="file"
          ref={fileRef}
          hidden
          accept='image/' />
        <img onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
       
        <p className='text-sm self-center'>
          {
            fileUploadError ? (<span className='text-red-700 font-semibold'>Error Image Upload (image must be less than 2 mb)</span>)
              : filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
                : filePerc === 100 ? (<span className='text-green-700 font-bold'>Image Uploaded Successfully</span>)
                  : ('')
          }
        </p>
        <input type="text" placeholder='username' id='username'
          className='border p-3 rounded-lg' />

        <input type="email" placeholder='email' id='email'
          className='border p-3 rounded-lg' />

        <input type="password" placeholder='password' id='password'
          className='border p-3 rounded-lg' />

        <button className='bg-slate-700 text-white rounded-lg
         p-3 hover:opacity-95 disabled:opacity-80'>
          UPDATE
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
