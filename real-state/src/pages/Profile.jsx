import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  signOutFailure, 
  signOutStart, 
  signOutSuccess, 
  updateUserFailure, 
  updateUserStart, 
  updateUserSuccess,

 }
from '../redux/user/userSlice';
import {Link} from 'react-router-dom'

export default function Profile() {
  const { currentUser, error,loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined)
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingErrors, setShowListingErrors] = useState(false)
  const [userListings, setUserListings] = useState([]);
  const [listingDeleteError,setListingDeleteError] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListing,setShowListing] = useState(false);
  const dispatch = useDispatch();
  // console.log(formData);
  

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


  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(formData)
        })
        const data = await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }


  const handleDeleteUser = async()=>{
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      })

      const data = await res.json();

      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }


  const handleSignOut = async(req,res) =>{
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data  = await res.json();

      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }


  const handelHideListing = ()=>{
    setShowListing(false)
    setUserListings([]);
  }


  const handleShowListing = async () => {
    setShowListing(true)
    try {
      setShowListingErrors(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);

      const data = await res.json();

      if(data.success === false){
        setShowListingErrors(true)
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingErrors(true);
      setUserListings(null)
    }
  }

  
  const handleListingDelete = async (listingId)=>{
    try {
      setListingDeleteError(false);
      const res = await fetch(`/api/listing/delete/${listingId}`,
        {
          method:'DELETE'
        }
      )

      const data = res.json();
      if(data.success === false){
        setListingDeleteError(true);
        return;
      }

      setUserListings((prev)=>prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      setListingDeleteError(true);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

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

        <input type="text"
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange} />

        <input
          type="email"
          placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange} />

        <input type="password" placeholder='password' id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange} />

        <button  className='bg-slate-700 text-white rounded-lg
         p-3 hover:opacity-95 disabled:opacity-80'>
          UPDATE
        </button>

        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 text-center' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'user updated successfully' : ''}
      </p>

      {
        showListing 
          ? <button onClick={handelHideListing} className='text-green-600 w-full mb-3'>Hide listing</button>
          : <button onClick={handleShowListing} className='text-green-700 w-full '>Show listing</button>
      }
      <p>{showListingErrors ? 'Error in showing listings': ''}</p>

      {userListings && userListings.length > 0 && 
        userListings.map((listing)=>{
          // console.log(listing.imageUrls);
          
          return(
            <div key={listing._id} className="border rounded-lg p-3 flex 
          justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls} alt="listing cover" 
               className='h-16 w-16 object-contain'
              />
            </Link>

            <Link className='text-slate-700 font-semibold flex-1 truncate hover:underline' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col items-center'>
              <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>

              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
          )          
        })
      }

    </div>
  )
}
