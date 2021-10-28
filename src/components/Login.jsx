import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as LoginSvg } from "../svgs/login.svg";

import { useAuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";

const Login = () => {
  const authCtx = useAuthContext();
  const history = useHistory();

  const loginWithGoogle = async () => {
    const user = await authCtx.loginUserGoogle();
    if (user) history.push("/dashboard");
  };

  const loginWithFacebook = async () => {
    const user = await authCtx.loginUserFacebook();
    if (user) history.push("/dashboard");
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full justify-center items-center">
      <div className="w-3/5 hidden md:block p-4">
        <LoginSvg />
      </div>

      {/* Login buttons div */}
      <div className="w-full md:w-2/5 h-full flex flex-col items-center justify-center space-y-8 bg-cfblue-500">
        <p
          className="text-indigo-800 text-pale-white font-mono font-black text-6xl lg:text-8xl mb-16 hover:text-cfblue-700 cursor-pointer
         transition-colors duration-500 ease-in-out"
        >
          Colloquy
        </p>
        <button
          type="button"
          className="p-4 rounded-md w-52 bg-pale-white hover:bg-cfblue-700 hover:text-pale-white text-cfblue-500 shadow-md transition-colors duration-500 ease-in-out"
          onClick={loginWithGoogle}
        >
          <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon>
          <span className="ml-2">Sign in with Google</span>
        </button>
        <button
          type="button"
          className="p-4 rounded-md w-52 bg-pale-white hover:bg-cfblue-700 hover:text-pale-white text-cfblue-500 shadow-md transition-colors duration-500 ease-in-out"
          onClick={loginWithFacebook}
        >
          <FontAwesomeIcon icon={faFacebookF}></FontAwesomeIcon>
          <span className="ml-2">Sign in with Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
