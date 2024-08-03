import { app } from '../firebase';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);

            // sending res to the backend
            const res = await fetch('/api/auth/google',
                {
                    method: 'POST',

                    headers: {
                        'Content-type': 'application/json'
                    },
                    
                    body: JSON.stringify({
                        name: result.user.displayName,
                        email: result.user.email,
                        photo: result.user.photoURL
                    })
                }
            );

            const data = res.json();
            dispatch(signInSuccess(data));
            navigate('/');

        } catch (error) {
            console.log('could not sign in with google', error);
        }
    }
    return (
        <button type='button' onClick={handleGoogleClick} className='bg-red-700 p-3 text-white rounded-lg uppercase hover:opacity-95'>
            continue with google
        </button>
    )
}
