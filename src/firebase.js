import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAgNjkpW9PAOcrL3SAokw6jP5o73ESnxvo",
  authDomain: "netflix-clone-c792e.firebaseapp.com",
  projectId: "netflix-clone-c792e",
  storageBucket: "netflix-clone-c792e.appspot.com",
  messagingSenderId: "195692884896",
  appId: "1:195692884896:web:d3323b5457bfc31218eac5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
        return user;
    } catch (error) {
        console.error(error);
        const message = error.code.split("/")[1].split("-").join(" ");
        toast.error(message);
    }
};

const login = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
    } catch (error) {
        console.error(error);
        const message = error.code.split("/")[1].split("-").join(" ");
        toast.error(message);
    }
};

const logout = () => signOut(auth);

export { auth, db, login, signup, logout };
