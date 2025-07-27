<script type="module">
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  // Wait for form submission
  document.getElementById("profileForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("You must be logged in to submit your profile.");
        return;
      }

      // Get selected image file
      const file = document.getElementById("imageInput").files[0];
      if (!file) return alert("Please select an image");

      const filename = encodeURIComponent(file.name);
      const contentType = file.type;

      try {
        // 1. Get secure upload URL from your backend
        const res = await fetch(`/api/blob-upload-url?filename=${filename}&contentType=${contentType}`);
        if (!res.ok) throw new Error("Failed to get upload URL");
        const { url, blob } = await res.json();

        // 2. Upload image to Vercel Blob
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const imageUrl = blob.url;

        // 3. Prepare profile data
        const profileData = {
          uid: user.uid,
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

        // 4. Save profile to Firebase Realtime Database under /talents/{uid}
        const saveUrl = `https://haraka-connect-co-ug-default-rtdb.firebaseio.com/talents/${user.uid}.json`;
        const firebaseRes = await fetch(saveUrl, {
          method: "PUT", // Use PUT to write to specific user path
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        });

        if (!firebaseRes.ok) throw new Error("Failed to save profile to Firebase");

        // Success
        alert("Profile submitted successfully!");
        document.getElementById("profileForm").reset();
        window.location.href = "/dashboard.html"; // Redirect after success

      } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
      }
    });
  });
</script>
