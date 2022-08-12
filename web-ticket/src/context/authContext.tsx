import Cookies from "js-cookie";
import React, {
  useContext,
  useState,
  useEffect,
  Children,
  ReactComponentElement,
} from "react";
import { getCurrentUser } from "../utils/auth_http_calls";
const AuthContext = React.createContext({
  currentUser: null,
  loading: true,
  authModalProps: { open: false, props: { activeTab: "LOGIN" } },
  toggleAuthModal: (status: boolean, options: any) => {
    throw "Component not wrapped in auth provider";
  },
  login: ({ token }: any) => {
    throw "Component not wrapped in auth provider";
  },
  logout: () => {
    throw "Component not wrapped in auth provider";
  },
} as any);
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<any | null>();
  const [loading, setLoading] = useState(true);
  const [authModalProps, setAuthModalProps] = useState({
    open: false,
    props: {},
  });
  //   function login({ email, password }: any) {
  //     return signInWithEmailAndPassword(auth, email, password);
  //   }
  async function getLoggedInUser() {
    setLoading(true);
    let res = await getCurrentUser();
    if (res.error) {
      setCurrentUser(null);
      //   Cookies.remove("jwt_auth", { path: "/" });
      setLoading(false);
    } else {
      setCurrentUser(res);
      setLoading(false);
    }
  }
  async function logout() {
    Cookies.remove("jwt_auth", { path: "/" });
    setCurrentUser(null);
    setLoading(false);
  }
  async function login({ token }: any) {
    Cookies.set("jwt_auth", `Bearer ${token}`, {
      path: "/",
      expires: new Date(8640000000000000),
    });
    await getLoggedInUser();
  }
  function toggleAuthModal(status: boolean, options: any | null) {
    setAuthModalProps((prevState) => ({
      open: status,
      props: options == null ? prevState.props : options,
    }));
  }
  useEffect(() => {
    getLoggedInUser();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading,
    toggleAuthModal,
    authModalProps,
  };
  return (
    <AuthContext.Provider value={value as any}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
