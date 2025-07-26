// /api/blob-upload-url.js
import { getSignedBlobUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { filename, contentType } = req.query;

  try {
    const { url, blob } = await getSignedBlobUrl({
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,  // must match env var
      contentType,
      filename,
    });

    res.status(200).json({ url, blob });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to create signed URL" });
  }
}
blob-upload-url.js

document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("Please select an image");

  const filename = encodeURIComponent(file.name);
  const contentType = encodeURIComponent(file.type);

  try {
    // 1. Request secure upload URL
    const res = await fetch(`/api/blob-upload-url?filename=${filename}&contentType=${contentType}`);
    const { url, blob } = await res.json();

    // 2. Upload file to Vercel Blob
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const imageUrl = blob.url;

    // 3. Prepare other profile data
    const profileData = {
      fullName: document.getElementById("fullName").value,
      skills: document.getElementById("skills").value,
      location: document.getElementById("location").value,
      rate: document.getElementById("rate").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      socialLinks: document.getElementById("socialLinks").value,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
    };

    // 4. Save profile to Firebase
    const firebaseRes = await fetch("https://haraka-connect-co-ug-default-rtdb.firebaseio.com/talents.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!firebaseRes.ok) throw new Error("Firebase save failed");

    alert("Profile submitted successfully!");
    document.getElementById("profileForm").reset();
  } catch (err) {
    console.error(err);
    alert("Error: Image upload failed");
  }
});
profile-upload.js
