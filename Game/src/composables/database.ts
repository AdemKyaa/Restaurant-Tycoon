import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../firebase-config';
import { db } from '../firebase-config';
import 'firebase/firestore';
import { collection, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, onMounted } from 'vue';

firebase.initializeApp(firebaseConfig);

interface User {
    id: string;
    Envanter: string[];
    name: string;
    password: string;
}

export function userData() {
    const users = ref<User[]>([]);

    onMounted(async () => {
        const querySnapshot = await
        getDocs(collection(db, "users"));;
        users.value = querySnapshot.docs.map(doc => {
            return {id: doc.id, ...(doc.data() as Omit<User, 'id'>)}
        });
    });

    return { users };
}

export async function addUser(name:string, password:string) {
    try {
        const docRef = await
        addDoc(collection(db, "users"), {
            name,
            password
        });
        return docRef.id;
    }catch(error){
        throw error;
    }
}

const username = ref("");

export async function loggedIn(name: string) {
    username.value = name;
    return {username};
}

export function loggingIn() {
    const name = ref("");
    name.value = username.value;
    return { name };
}

export async function updateEnvanter(index: number, value: string) {
    if(!username.value) throw new Error(`Giriş yapılmamış`);

    const q = query(collection(db, 'users'), where('name', '==', username.value));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error(`Kullanıcı bulunamadı`);

    const docSnap = snap.docs[0];
    const data = docSnap.data() as Partial<User>;

    const current = Array.isArray(data.Envanter) ? [...data.Envanter] : [];
    if (index >= current.length) current.length = index + 1;
    current[index] = value;

    await updateDoc(docSnap.ref, { Envanter: current });
}

export {db};