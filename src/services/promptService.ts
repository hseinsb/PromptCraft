import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Prompt {
  id?: string;
  title: string;
  role: string;
  goal: string;
  format: string;
  context: string;
  constraints: string;
  style: string;
  full_prompt: string;
  raw_input: string;
  template_used?: string | null;
  createdAt?: Timestamp;
  userId: string;
}

const PROMPTS_COLLECTION = "prompts";

// Add a new prompt
export async function savePrompt(prompt: Omit<Prompt, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, PROMPTS_COLLECTION), {
      ...prompt,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving prompt:", error);
    throw error;
  }
}

// Get all prompts for a user
export async function getUserPrompts(userId: string) {
  try {
    const q = query(
      collection(db, PROMPTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const prompts: Prompt[] = [];

    querySnapshot.forEach((doc) => {
      prompts.push({
        id: doc.id,
        ...doc.data(),
      } as Prompt);
    });

    return prompts;
  } catch (error) {
    console.error("Error getting prompts:", error);
    throw error;
  }
}

// Get a single prompt by ID
export async function getPrompt(promptId: string) {
  try {
    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Prompt;
    } else {
      throw new Error("Prompt not found");
    }
  } catch (error) {
    console.error("Error getting prompt:", error);
    throw error;
  }
}

// Delete a prompt
export async function deletePrompt(promptId: string) {
  try {
    await deleteDoc(doc(db, PROMPTS_COLLECTION, promptId));
  } catch (error) {
    console.error("Error deleting prompt:", error);
    throw error;
  }
}

// Update a prompt
export async function updatePrompt(promptId: string, updates: Partial<Prompt>) {
  try {
    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw error;
  }
}
