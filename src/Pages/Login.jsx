/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router'
import { auth, googleAuthProvider } from '../firebaseConfig'
import { signInWithPopup } from 'firebase/auth'

function Login({ setIsAuth }) {
  const navigate = useNavigate()

  function googleSignIn() {
    signInWithPopup(auth, googleAuthProvider).then((result) => {
      localStorage.setItem('isAuth', true)
      setIsAuth(true)
      navigate('/')
      console.log(result.user.displayName)

    })
  }
  return (
    <div className="LoginPage">
      <p>sign in with google</p>
      <button className="GoogleSignIn" onClick={googleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login