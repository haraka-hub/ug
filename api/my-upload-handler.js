// /api/my-upload-handler.js (Vercel Serverless Function)
import { getSignedBlobUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { filename, contentType } = req.query;

  try {
    const { url, blob } = await getSignedBlobUrl({
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
      filename,
    });

    res.status(200).json({ url, blob });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to create signed URL" });
  }
}

// Frontend Image Upload Logic (add to your HTML script or profile-upload.js)

async function uploadImageToVercel(file) {
  const filename = encodeURIComponent(file.name);
  const contentType = encodeURIComponent(file.type);

  const res = await fetch(`/api/my-upload-handler?filename=${filename}&contentType=${contentType}`);
  if (!res.ok) throw new Error("Failed to get upload URL");

  const { url, blob } = await res.json();

  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return blob.url;
}

// Example form submit usage:
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("imageInput").files[0];
  const name = document.getElementById("name").value;
  const skills = document.getElementById("skills").value;
  const location = document.getElementById("location").value;
  const rate = document.getElementById("rate").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const social = document.getElementById("social").value;

  try {
    const imageUrl = await uploadImageToVercel(file);

    await addDoc(collection(db, "talents"), {
      name,
      skills,
      location,
      rate,
      email,
      phone,
      social,
      image: imageUrl,
      createdAt: serverTimestamp()
    });

    alert("Profile submitted successfully!");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});
console.log("Loaded token:", process.env.BLOB_READ_WRITE_TOKEN ? "YES" : "NO");
