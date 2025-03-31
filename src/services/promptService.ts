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
  favorite?: boolean;
}

const PROMPTS_COLLECTION = "prompts";

// Add a new prompt
export async function savePrompt(prompt: Omit<Prompt, "id" | "createdAt">) {
  try {
    console.log("Saving prompt to Firebase:", prompt);
    const docRef = await addDoc(collection(db, PROMPTS_COLLECTION), {
      ...prompt,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving prompt:", error);
    throw error;
  }
}

// Get all prompts for a user
export async function getUserPrompts(userId: string) {
  try {
    console.log("Getting prompts for user:", userId);
    const q = query(
      collection(db, PROMPTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const prompts: Prompt[] = [];

    querySnapshot.forEach((doc) => {
      console.log("Document data:", doc.id, doc.data());
      // Ensure all fields exist with proper defaults
      const data = doc.data();

      const prompt: Prompt = {
        id: doc.id,
        title: data.title || "",
        role: data.role || "",
        goal: data.goal || "",
        format: data.format || "",
        context: data.context || "",
        constraints: data.constraints || "",
        style: data.style || "",
        full_prompt: data.full_prompt || "",
        raw_input: data.raw_input || "",
        template_used: data.template_used || null,
        createdAt: data.createdAt || null,
        userId: data.userId || userId,
        favorite: typeof data.favorite === "boolean" ? data.favorite : false,
      };

      prompts.push(prompt);
    });

    console.log("Retrieved prompts count:", prompts.length);
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
    console.log("Deleting prompt with ID:", promptId);
    await deleteDoc(doc(db, PROMPTS_COLLECTION, promptId));
    console.log("Prompt successfully deleted");
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
