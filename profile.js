(function initProfilePage() {
  const nicknameValue = document.getElementById("nicknameValue");
  const emailValue = document.getElementById("emailValue");
  const descriptionValue = document.getElementById("descriptionValue");
  const profileAvatar = document.getElementById("profileAvatar");
  const chatBtn = document.getElementById("chatBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileMsg = document.getElementById("profileMsg");

  function profileLetter(value) {
    return (String(value || "").trim().charAt(0).toLowerCase() || "a");
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const fallbackNickname = user.displayName || "Anonymous";
    const fallbackLetter = profileLetter(fallbackNickname);

    nicknameValue.textContent = fallbackNickname;
    emailValue.textContent = user.email || "-";
    profileAvatar.src = `images/pfp/${fallbackLetter}.png`;

    try {
      const snap = await firebase.firestore().collection("users").doc(user.uid).get();
      if (snap.exists) {
        const data = snap.data();
        const nickname = data.nickname || fallbackNickname;
        const letter = profileLetter(nickname);

        nicknameValue.textContent = nickname;
        emailValue.textContent = data.email || user.email || "-";
        descriptionValue.textContent = data.description || "No description yet.";
        profileAvatar.src = data.profilePicture || `images/pfp/${letter}.png`;
      }
    } catch (error) {
      console.error(error);
      profileMsg.textContent = "Could not load profile details.";
      profileMsg.classList.remove("hidden");
    }

    chatBtn.onclick = () => {
      window.location.href = "server.html";
    };

    logoutBtn.onclick = async () => {
      await firebase.auth().signOut();
      window.location.href = "login.html";
    };
  });
})();
