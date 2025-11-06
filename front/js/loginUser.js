const form = document.getElementById("loginUserForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Login bem sucedido");

      // Store the user object in localStorage as valid JSON
      localStorage.setItem("usuarioLogado", JSON.stringify(result.dados));
      localStorage.setItem("id", JSON.stringify(result.dados.id));
      // Redirect AFTER storing
      window.location.href = "conta.html";
    } else {
      alert("Usuário ou senha incorretos");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro no servidor. Tente novamente mais tarde.");
  }
});
